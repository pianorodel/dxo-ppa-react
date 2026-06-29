import { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Label } from "reactstrap";

// ─── Small Sub-Components ────────────────────────────────────────────────────

const SearchInput = ({ value, onChange, placeholder, isLoading, themeVars, inputRef }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      border: `1px solid ${themeVars.borderColor}`,
      borderRadius: "6px",
      padding: "6px 10px",
      backgroundColor: themeVars.inputBg,
      gap: "8px",
    }}>
    {/* Search Icon */}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={themeVars.bodyColor} strokeWidth="2" style={{ flexShrink: 0, opacity: 0.5 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>

    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        color: themeVars.bodyColor,
        fontSize: "14px",
      }}
    />

    {/* Loading Spinner */}
    {isLoading && <span className="spinner-border spinner-border-sm" style={{ color: themeVars.primaryColor, flexShrink: 0 }} />}

    {/* Clear Search */}
    {value && !isLoading && (
      <button
        type="button"
        onClick={() => onChange("")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          color: themeVars.bodyColor,
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
        }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);

// ─── Option Item (in the list) ────────────────────────────────────────────────

const OptionItem = ({ option, onSelect, getOptionLabel, themeVars }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onSelect(option)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 12px",
        borderRadius: "20px",
        border: `1px solid ${hovered ? themeVars.primaryColor : themeVars.borderColor}`,
        backgroundColor: hovered ? `${themeVars.primaryColor}18` : themeVars.inputBg,
        color: themeVars.bodyColor,
        cursor: "pointer",
        fontSize: "13px",
        transition: "all 0.15s ease",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>
      {/* Plus Icon */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={themeVars.primaryColor} strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {getOptionLabel(option)}
    </div>
  );
};

// ─── Selected Item (in the selected section) ──────────────────────────────────

const SelectedItem = ({ option, onRemove, getOptionLabel, themeVars }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 10px 5px 12px",
        borderRadius: "20px",
        backgroundColor: hovered ? themeVars.dangerColor : themeVars.primaryColor,
        color: themeVars.whiteColor,
        fontSize: "13px",
        transition: "background-color 0.15s ease",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>
      {getOptionLabel(option)}

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(option)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          color: themeVars.whiteColor,
          opacity: hovered ? 1 : 0.75,
          transition: "opacity 0.15s ease",
        }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ searchQuery, themeVars }) => (
  <div
    style={{
      padding: "20px",
      textAlign: "center",
      color: themeVars.bodyColor,
      opacity: 0.45,
      fontSize: "13px",
    }}>
    {searchQuery ? `No results found for "${searchQuery}"` : "No options available"}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const AsyncSelectItems = ({
  name,
  control,
  label,
  loadOptions,
  isMulti = false,
  defaultValue = [],
  rules = {},
  placeholder = "",
  styles = {},
  getOptionValue = (option) => option.value,
  getOptionLabel = (option) => option.label,
  cacheOptions = false,
  defaultOptions = false,
  isLocal = false,
  disabledMarginBottom,
  maxHeight = 220, // max height of the options list
  ...restProps
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allOptions, setAllOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusLoaded, setFocusLoaded] = useState(false);
  const [themeVars, setThemeVars] = useState({});
  const searchDebounceRef = useRef(null);
  const inputRef = useRef(null);

  const isRequired = !!rules?.required;

  // ── Theme watcher ──────────────────────────────────────────────────────────
  useEffect(() => {
    const updateThemeVars = () => {
      const root = document.documentElement;
      setThemeVars({
        inputBg: getComputedStyle(root).getPropertyValue("--vz-input-bg-custom").trim(),
        bodyColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim(),
        borderColor: getComputedStyle(root).getPropertyValue("--vz-input-border-custom").trim(),
        tertiaryBg: getComputedStyle(root).getPropertyValue("--vz-tertiary-bg").trim(),
        invalidColor: getComputedStyle(root).getPropertyValue("--vz-form-invalid-color").trim(),
        primaryColor: getComputedStyle(root).getPropertyValue("--vz-primary").trim(),
        whiteColor: getComputedStyle(root).getPropertyValue("--vz-white").trim(),
        dangerColor: getComputedStyle(root).getPropertyValue("--vz-danger").trim(),
      });
    };

    updateThemeVars();
    const observer = new MutationObserver(updateThemeVars);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme", "class"],
    });
    return () => observer.disconnect();
  }, []);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!focusLoaded && typeof loadOptions === "function") {
      setIsLoading(true);
      loadOptions("")
        .then((opts) => {
          setAllOptions(opts || []);
          setFilteredOptions(opts || []);
          setFocusLoaded(true);
        })
        .catch((err) => console.warn("loadOptions error:", err))
        .finally(() => setIsLoading(false));
    }
  }, [focusLoaded, loadOptions]);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(searchDebounceRef.current);

    if (!searchQuery.trim()) {
      setFilteredOptions(allOptions);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      if (isLocal) {
        // Filter locally
        const filtered = allOptions.filter((opt) => getOptionLabel(opt).toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredOptions(filtered);
      } else {
        // Remote search
        setIsLoading(true);
        try {
          const opts = await loadOptions(searchQuery);
          setFilteredOptions(opts || []);
        } catch (err) {
          console.warn("search error:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, allOptions, isLocal, getOptionLabel, loadOptions]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isSelected = useCallback(
    (option, selectedValues) => {
      if (!selectedValues) return false;
      const values = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
      return values.some((v) => getOptionValue(v) === getOptionValue(option));
    },
    [getOptionValue],
  );

  const handleSelect = useCallback(
    (option, field) => {
      if (isMulti) {
        const current = Array.isArray(field.value) ? field.value : [];
        if (!isSelected(option, current)) {
          field.onChange([...current, option]);
        }
      } else {
        field.onChange(option);
      }
    },
    [isMulti, isSelected],
  );

  const handleRemove = useCallback(
    (option, field) => {
      if (isMulti) {
        const current = Array.isArray(field.value) ? field.value : [];
        field.onChange(current.filter((v) => getOptionValue(v) !== getOptionValue(option)));
      } else {
        field.onChange(null);
      }
    },
    [isMulti, getOptionValue],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
          {isRequired && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const hasError = !!error;
          const isDisabled = restProps.isDisabled || restProps.disabled;

          // Options that are NOT yet selected
          const visibleOptions = filteredOptions.filter((opt) => !isSelected(opt, field.value));

          // Normalise selected to array for rendering
          const selectedItems = isMulti ? (Array.isArray(field.value) ? field.value : []) : field.value ? [field.value] : [];

          return (
            <div
              style={{
                border: `1px solid ${hasError ? themeVars.invalidColor : themeVars.borderColor}`,
                borderRadius: "8px",
                backgroundColor: themeVars.inputBg,
                opacity: isDisabled ? 0.6 : 1,
                pointerEvents: isDisabled ? "none" : "auto",
                overflow: "hidden",
              }}>
              {/* ── Search Bar ─────────────────────────────────────────── */}
              <div style={{ padding: "10px 10px 8px" }}>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={placeholder}
                  isLoading={isLoading}
                  themeVars={themeVars}
                  inputRef={inputRef}
                />
              </div>

              {/* ── Options List ───────────────────────────────────────── */}
              <div
                style={{
                  maxHeight: `${maxHeight}px`,
                  overflowY: "auto",
                  padding: "4px 10px 8px",
                  borderBottom: selectedItems.length > 0 ? `1px solid ${themeVars.borderColor}` : "none",
                }}>
                {visibleOptions.length === 0 && !isLoading ? (
                  <EmptyState searchQuery={searchQuery} themeVars={themeVars} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      paddingTop: "4px",
                    }}>
                    {visibleOptions.map((option) => (
                      <OptionItem
                        key={getOptionValue(option)}
                        option={option}
                        onSelect={(opt) => handleSelect(opt, field)}
                        getOptionLabel={getOptionLabel}
                        themeVars={themeVars}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* ── Selected Items ───────────────────────────────────────── */}
              {selectedItems.length > 0 && (
                <div
                  style={{
                    padding: "8px 10px 10px",
                    backgroundColor: `${themeVars.primaryColor}08`,
                  }}>
                  {/* Header Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: themeVars.bodyColor,
                        opacity: 0.5,
                      }}>
                      Selected ({selectedItems.length})
                    </span>

                    {/* Clear All Button */}
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => field.onChange(isMulti ? [] : null)}
                        style={{
                          background: "none",
                          border: `1px solid ${themeVars.dangerColor}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          padding: "2px 8px",
                          fontSize: "11px",
                          color: themeVars.dangerColor,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeVars.dangerColor;
                          e.currentTarget.style.color = themeVars.whiteColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = themeVars.dangerColor;
                        }}>
                        {/* Trash Icon */}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Selected Chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}>
                    {selectedItems.map((option) => (
                      <SelectedItem
                        key={getOptionValue(option)}
                        option={option}
                        onRemove={(opt) => handleRemove(opt, field)}
                        getOptionLabel={getOptionLabel}
                        themeVars={themeVars}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Validation Error ──────────────────────────────────── */}
              {hasError && (
                <div
                  style={{
                    padding: "4px 10px 8px",
                    fontSize: "13px",
                    color: themeVars.invalidColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                  {/* Warning Icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error.message}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default AsyncSelectItems;
