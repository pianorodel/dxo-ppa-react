import React, { useEffect, useState } from "react";

const LoadingOverlay = ({ loading, loader, children, opacity = 0.8, blur = false, loadingText = "Loading..." }) => {
  const [themeVars, setThemeVars] = useState({
    bodyBg: "#fff",
    bodyColor: "#000",
  });

  useEffect(() => {
    const updateThemeVars = () => {
      const root = document.documentElement;
      setThemeVars({
        bodyBg: getComputedStyle(root).getPropertyValue("--vz-body-bg").trim() || "#fff",
        bodyColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim() || "#000",
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

  const applyOpacity = (hex, alpha = 1) => {
    if (!hex.startsWith("#")) return hex;
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex.length === 3 ? cleanHex.repeat(2) : cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div style={{ position: "relative" }}>
      {children}

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: applyOpacity(themeVars.bodyBg, opacity),
            backdropFilter: blur ? "blur(2px)" : "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 10,
            transition: "background 0.3s ease",
          }}>
          {loader || (
            <div
              style={{
                color: themeVars.bodyColor,
                fontWeight: 500,
                marginTop: 10,
                textAlign: "center",
                fontFamily: "system-ui, sans-serif",
              }}>
              {loadingText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
