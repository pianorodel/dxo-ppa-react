import { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "reactstrap";

/**
 * AsyncAutocompleteField
 *
 * Drop-in upgrade of the previous version. Same core API, plus:
 *  - Full keyboard navigation (ArrowUp/Down, Enter, Escape, Tab)
 *  - Bold highlighting of the matched substring in suggestions
 *  - Rich two-line options (label + sublabel) with optional initials avatar
 *  - Stale-response guard so out-of-order fetches never overwrite fresh results
 *  - Outside-click dismissal (replaces the blur setTimeout hack, so the
 *    dropdown scrollbar is now draggable)
 *  - Empty state with optional "create new" action
 *  - onSelect callback that hands back the FULL option object
 *  - ARIA combobox semantics
 */
const AsyncAutocompleteField = ({
  name,
  control,
  label,
  loadOptions,
  rules = {},
  placeholder = "",
  getOptionLabel = (opt) => opt.label,
  getOptionSublabel = null, // (opt) => string — renders a muted second line
  getOptionValue = null, // (opt) => string|number — stable React key
  renderOption = null, // (opt, { query }) => node — full custom row override
  onSelect = null, // (opt) => void — receive the full selected object
  onCreateNew = null, // (query) => void — shows a "create" row when no results
  showAvatar = false, // initials circle on the left of each option
  minLength = 1, // chars before fetching
  debounceMs = 300,
  disabledMarginBottom,
  ...restProps
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [query, setQuery] = useState("");

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const isRequired = !!rules?.required;
  const listboxId = `${name}-listbox`;

  // ----- outside click closes the dropdown ---------------------------------
  useEffect(() => {
    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  // ----- keep highlighted option scrolled into view ------------------------
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[highlightedIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  // ----- debounced + race-safe fetch ----------------------------------------
  const fetchSuggestions = useCallback(
    (inputValue) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!inputValue || inputValue.trim().length < minLength) {
        setSuggestions([]);
        setIsOpen(false);
        setHighlightedIndex(-1);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        const requestId = ++requestIdRef.current;
        setIsLoading(true);
        try {
          const results = await loadOptions(inputValue);
          if (requestId !== requestIdRef.current) return; // stale — discard
          setSuggestions(results ?? []);
          setIsOpen(true);
          setHighlightedIndex(results?.length ? 0 : -1);
        } catch {
          if (requestId === requestIdRef.current) setSuggestions([]);
        } finally {
          if (requestId === requestIdRef.current) setIsLoading(false);
        }
      }, debounceMs);
    },
    [loadOptions, debounceMs, minLength],
  );

  // ----- bold the matched substring -----------------------------------------
  const highlightMatch = (text) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const getInitials = (text) =>
    text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  const avatarPalette = [
    { bg: "var(--vz-primary-bg-subtle, #e6f1fb)", fg: "var(--vz-primary, #0c447c)" },
    { bg: "var(--vz-success-bg-subtle, #e1f5ee)", fg: "var(--vz-success, #085041)" },
    { bg: "var(--vz-warning-bg-subtle, #faeeda)", fg: "var(--vz-warning, #854f0b)" },
    { bg: "var(--vz-info-bg-subtle, #eeedfe)", fg: "var(--vz-info, #3c3489)" },
  ];

  return (
    <div
      className={disabledMarginBottom ? "mb-0" : "mb-3"}
      ref={wrapperRef}
      style={{ position: "relative" }}>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const selectOption = (opt) => {
            field.onChange(getOptionLabel(opt));
            onSelect?.(opt);
            setSuggestions([]);
            setIsOpen(false);
            setHighlightedIndex(-1);
          };

          const handleKeyDown = (e) => {
            if (!isOpen) {
              if (e.key === "ArrowDown" && suggestions.length) setIsOpen(true);
              return;
            }
            switch (e.key) {
              case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((i) => (i + 1) % suggestions.length);
                break;
              case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
                break;
              case "Enter":
                if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                  e.preventDefault();
                  selectOption(suggestions[highlightedIndex]);
                }
                break;
              case "Escape":
              case "Tab":
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
              default:
                break;
            }
          };

          const showEmptyState = isOpen && !isLoading && query && suggestions.length === 0;

          return (
            <>
              <div style={{ position: "relative" }}>
                <input
                  {...restProps}
                  id={name}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined
                  }
                  className={`form-control${error ? " is-invalid" : ""}`}
                  placeholder={placeholder}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />

                {isLoading && (
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}>
                    <span className="spinner-border spinner-border-sm text-primary" />
                  </div>
                )}
              </div>

              {isOpen && (suggestions.length > 0 || showEmptyState) && (
                <div
                  className="shadow-sm border rounded"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1056,
                    backgroundColor: "var(--vz-input-bg-custom, #fff)",
                    marginTop: 4,
                    overflow: "hidden",
                  }}>
                  <ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    className="list-unstyled mb-0"
                    style={{ maxHeight: 260, overflowY: "auto" }}>
                    {suggestions.map((opt, idx) => {
                      const optLabel = getOptionLabel(opt);
                      const sublabel = getOptionSublabel?.(opt);
                      const palette = avatarPalette[idx % avatarPalette.length];
                      const isActive = idx === highlightedIndex;
                      return (
                        <li
                          key={getOptionValue ? getOptionValue(opt) : `${optLabel}-${idx}`}
                          id={`${name}-option-${idx}`}
                          role="option"
                          aria-selected={isActive}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectOption(opt);
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: isActive
                              ? "var(--vz-tertiary-bg, #f3f6f9)"
                              : "transparent",
                          }}>
                          {renderOption ? (
                            renderOption(opt, { query })
                          ) : (
                            <>
                              {showAvatar && (
                                <div
                                  className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: 32,
                                    height: 32,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    backgroundColor: palette.bg,
                                    color: palette.fg,
                                  }}>
                                  {getInitials(optLabel)}
                                </div>
                              )}
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div className="text-truncate" style={{ fontSize: 14 }}>
                                  {highlightMatch(optLabel)}
                                </div>
                                {sublabel && (
                                  <div
                                    className="text-muted text-truncate"
                                    style={{ fontSize: 12 }}>
                                    {sublabel}
                                  </div>
                                )}
                              </div>
                              {isActive && (
                                <i
                                  className="ri-corner-down-left-line text-muted flex-shrink-0"
                                  style={{ fontSize: 14 }}
                                />
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}

                    {showEmptyState && (
                      <li
                        role="option"
                        aria-selected={false}
                        style={{ padding: "12px" }}
                        className="text-center">
                        <div className="text-muted" style={{ fontSize: 13 }}>
                          No results for "{query}"
                        </div>
                        {onCreateNew && (
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 mt-1"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIsOpen(false);
                              onCreateNew(query);
                            }}>
                            <i className="ri-add-line align-middle me-1" />
                            Add "{query}" as new
                          </button>
                        )}
                      </li>
                    )}
                  </ul>

                  {suggestions.length > 0 && (
                    <div
                      className="d-none d-md-flex border-top text-muted"
                      style={{ padding: "5px 12px", gap: 14, fontSize: 11 }}>
                      <span>
                        <i className="ri-arrow-up-line" />
                        <i className="ri-arrow-down-line" /> navigate
                      </span>
                      <span>↵ select</span>
                      <span>esc dismiss</span>
                    </div>
                  )}
                </div>
              )}

              {error && <div className="invalid-feedback d-block">{error.message}</div>}
            </>
          );
        }}
      />
    </div>
  );
};

export default AsyncAutocompleteField;