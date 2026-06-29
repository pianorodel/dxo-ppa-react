import { useState, useEffect } from "react";

const COLORS = {
  success:   { light: { bg: "#d1f2eb", text: "#0f6848", border: "#a3e4d7", hover: "#52be80" },
               dark:  { bg: "#0f4d35", text: "#6ee0b4", border: "#1a6e4a", hover: "#2ecc71" } },
  danger:    { light: { bg: "#fde8e4", text: "#9b2226", border: "#f5b7b1", hover: "#e74c3c" },
               dark:  { bg: "#4a1215", text: "#f1948a", border: "#7b1d1d", hover: "#c0392b" } },
  warning:   { light: { bg: "#fef3cd", text: "#7d5a00", border: "#fce083", hover: "#f0ad4e" },
               dark:  { bg: "#4a3500", text: "#f8c471", border: "#7d5a00", hover: "#d4a017" } },
  info:      { light: { bg: "#d6eef8", text: "#0a4c72", border: "#a9d4ee", hover: "#3498db" },
               dark:  { bg: "#072d44", text: "#7ec8e3", border: "#0a4c72", hover: "#2980b9" } },
  primary:   { light: { bg: "#dce4f5", text: "#1e3a7b", border: "#b0c2e8", hover: "#405189" },
               dark:  { bg: "#111f45", text: "#8fa8d9", border: "#1e3a7b", hover: "#405189" } },
  purple:    { light: { bg: "#ede7f6", text: "#512da8", border: "#c5aee0", hover: "#7b1fa2" },
               dark:  { bg: "#2e1065", text: "#c084fc", border: "#512da8", hover: "#7c3aed" } },
  pink:      { light: { bg: "#fce4ec", text: "#880e4f", border: "#f48fb1", hover: "#e91e63" },
               dark:  { bg: "#4a0728", text: "#f48fb1", border: "#880e4f", hover: "#c2185b" } },
  secondary: { light: { bg: "#f0f1f2", text: "#495057", border: "#ced4da", hover: "#adb5bd" },
               dark:  { bg: "#212529", text: "#adb5bd", border: "#495057", hover: "#6c757d" } },
  dark:      { light: { bg: "#e2e3e5", text: "#1a1d20", border: "#c6c8ca", hover: "#6c757d" },
               dark:  { bg: "#1a1d20", text: "#e2e3e5", border: "#495057", hover: "#adb5bd" } },
};

const isDarkMode = () => {
  try {
    const layoutMode = document.documentElement.getAttribute("data-bs-theme")
      || document.documentElement.getAttribute("data-layout-mode")
      || document.cookie.split("; ").find(r => r.startsWith("layoutMode="))?.split("=")[1]
      || "light";
    return layoutMode === "dark";
  } catch { return false; }
};

export const StatusChip = ({ label = '', isActive = false, color = 'success', onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dark, setDark] = useState(isDarkMode);
  const on = isActive || isHovered;

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDarkMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme", "data-layout-mode"] });
    return () => observer.disconnect();
  }, []);

  const c = (COLORS[color] || COLORS.success)[dark ? "dark" : "light"];

  // Muted (inactive, not hovered) — neutral fill/border but readable text
  const mutedBg = dark ? "transparent" : "#f8f9fa";
  const mutedText = dark ? "#adb5bd" : "#6c757d";   // readable secondary grey
  const mutedBorder = dark ? "#343a40" : "#e9ecef";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: on ? 500 : 500,
        cursor: "pointer",
        outline: "none",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transition: "all 0.15s ease",
        background: on ? c.bg : mutedBg,
        color: on ? c.text : mutedText,
        border: `1.5px solid ${on ? c.hover : mutedBorder}`,
      }}
    >
      {label}
      {children}
    </button>
  );
};

export default StatusChip;