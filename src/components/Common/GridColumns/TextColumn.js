import { useState } from "react";

export const TextColumn = ({ text = "", onClick, width = "auto" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  // Handle null, undefined, or non-string values
  const safeText = text ?? "";
  const shouldTruncate = safeText.length > maxLength;

  const displayText = isExpanded || !shouldTruncate ? safeText : `${safeText.substring(0, maxLength)}...`;

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setIsExpanded(!isExpanded);
  };

  // Convert text to array of lines for rendering
 const renderText = (text) => {
  const str = text == null ? "" : String(text);
  return str.split("\n").map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

  return (
    <div className={onClick ? "cursor-pointer" : ""} onClick={onClick} style={{ width }}>
      {renderText(displayText)}
      {shouldTruncate && (
        <span className="text-success ml-1 font-medium cursor-pointer" onClick={handleToggle}>
          {isExpanded ? "...See less" : "...See more"}
        </span>
      )}
    </div>
  );
};
