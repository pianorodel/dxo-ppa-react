import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { Input, Spinner } from "reactstrap";
import { AvatarIcon } from "../AvatarIcon";
import "./style.css";

const AutoSuggestInput = ({
  lookup,
  onSelect,
  placeholder = "Search...",
  debounceTime = 500,
  labelField = "fullName", // default main display field
  displayFields = ["grade", "sport"], // secondary info fields (can be customized)
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedLookup = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await lookup(value);
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lookup failed:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceTime),
    [lookup, debounceTime]
  );

  useEffect(() => {
    if (query.trim()) debouncedLookup(query);
    else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (item) => {
    const label = item[labelField] || "";
    setQuery(label);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSelect) onSelect(item);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".autosuggest-container"))
        setShowSuggestions(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const tertiaryBg = getComputedStyle(document.documentElement)
    .getPropertyValue("--vz-tertiary-bg")
    .trim();
  const borderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--vz-input-border-custom")
    .trim();

  return (
    <div className="autosuggest-container" style={{ position: "relative" }}>
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: borderColor === "#ced4da" ? "#ffffffff" : tertiaryBg,
            border: borderColor,
            borderTop: "none",
            padding: "10px",
            textAlign: "center",
            zIndex: 999,
          }}
        >
          <Spinner size="sm" color="primary" /> Loading...
        </div>
      )}

      <style></style>

      {showSuggestions && !loading && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: borderColor === "#ced4da" ? "#ffffffff" : tertiaryBg,
            border: borderColor,
            borderRadius: "6px",
            zIndex: 999,
            marginTop: "2px",
            listStyle: "none",
            padding: 0,
          }}
        >
          {suggestions.slice(0, 3).map((item, index) => (
           <li
  className={`autosuggest-suggestion-item hover-li-white`}
  key={item.id || index}
  onMouseDown={() => handleSelect(item)}
  style={{
    padding: "8px 10px",
    cursor: "pointer",
    borderBottom: borderColor,
    transition: "background 0.3s ease, color 0.3s ease",
  }}
>
  <div className="d-flex align-items-center gap-2">
    <AvatarIcon name={item[labelField]} avatarImg={item.avatarPath}/>

    <div className="name-textt">
      <div
        className="name-label"
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color:
            borderColor === "#ced4da" ? "#333333ff" : "#ffffffff",
          transition: "color 0.3s ease",
        }}
      >
        {item[labelField]}
      </div>

      {displayFields.map(
        (field) =>
          item[field] && (
            <div
              key={field}
              className="text-muted name-textt sub-label"
              style={{ fontSize: "11px" }}
            >
              {item[field]}
            </div>
          )
      )}
    </div>
  </div>
</li>

          ))}
        </ul>
      )}

      {showSuggestions &&
        !loading &&
        suggestions.length === 0 &&
        query.trim() && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              background: borderColor === "#ced4da" ? "#ffffffff" : tertiaryBg,
              border: borderColor,
              borderTop: "none",
              padding: "10px",
              textAlign: "center",
              zIndex: 999,
            }}
          >
            No results found
          </div>
        )}
    </div>
  );
};

export default AutoSuggestInput;
