import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const TYPE_META = {
  pdf: { bg: "rgba(153,60,29,0.12)", color: "#993C1D", icon: "ri-file-pdf-line" },
  doc: { bg: "rgba(24,95,165,0.12)", color: "#185FA5", icon: "ri-file-word-line" },
  docx: { bg: "rgba(24,95,165,0.12)", color: "#185FA5", icon: "ri-file-word-line" },
  xls: { bg: "rgba(59,109,17,0.12)", color: "#3B6D11", icon: "ri-file-excel-line" },
  xlsx: { bg: "rgba(59,109,17,0.12)", color: "#3B6D11", icon: "ri-file-excel-line" },
  ppt: { bg: "rgba(216,90,48,0.12)", color: "#D85A30", icon: "ri-file-ppt-line" },
  pptx: { bg: "rgba(216,90,48,0.12)", color: "#D85A30", icon: "ri-file-ppt-line" },
  jpg: { bg: "rgba(186,117,23,0.12)", color: "#BA7517", icon: "ri-image-line" },
  jpeg: { bg: "rgba(186,117,23,0.12)", color: "#BA7517", icon: "ri-image-line" },
  png: { bg: "rgba(186,117,23,0.12)", color: "#BA7517", icon: "ri-image-line" },
  gif: { bg: "rgba(186,117,23,0.12)", color: "#BA7517", icon: "ri-image-line" },
  zip: { bg: "rgba(95,94,90,0.12)", color: "#5F5E5A", icon: "ri-file-zip-line" },
  rar: { bg: "rgba(95,94,90,0.12)", color: "#5F5E5A", icon: "ri-file-zip-line" },
  txt: { bg: "rgba(83,74,183,0.12)", color: "#534AB7", icon: "ri-file-text-line" },
  default: { bg: "rgba(83,74,183,0.12)", color: "#534AB7", icon: "ri-file-line" },
};

const getExt = (name) => (name?.split(".").pop() || "").toLowerCase();
const getMeta = (name) => TYPE_META[getExt(name)] || TYPE_META.default;
const fmtSize = (b) => (!b ? "\u2014" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

const ACCEPT_BADGES = [
  { ext: "PDF", icon: "ri-file-pdf-line", color: "#993C1D", bg: "rgba(153,60,29,0.1)" },
  { ext: "DOCX", icon: "ri-file-word-line", color: "#185FA5", bg: "rgba(24,95,165,0.1)" },
  { ext: "XLSX", icon: "ri-file-excel-line", color: "#3B6D11", bg: "rgba(59,109,17,0.1)" },
  { ext: "Image", icon: "ri-image-line", color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
  { ext: "ZIP", icon: "ri-file-zip-line", color: "#5F5E5A", bg: "rgba(95,94,90,0.1)" },
];

const FileUpload = ({ onFilesChange, maxFiles = 20, accept, compact = true, showStats = true }) => {
  // Coerce so compact="false" / compact={0} behave correctly.
  const isCompact = compact === true || compact === "true" || compact === 1;

  const [files, setFiles] = useState([]);
  const [themeVars, setThemeVars] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const progressRefs = useRef({});

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      setThemeVars({
        inputBg: getComputedStyle(root).getPropertyValue("--vz-input-bg-custom").trim(),
        bodyColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim(),
        borderColor: getComputedStyle(root).getPropertyValue("--vz-input-border-custom").trim(),
        primary: getComputedStyle(root).getPropertyValue("--vz-primary").trim(),
        light: getComputedStyle(root).getPropertyValue("--vz-light").trim(),
        mutedColor: getComputedStyle(root).getPropertyValue("--vz-secondary-color").trim(),
      });
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme", "class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    onFilesChange?.(files.map((f) => f.file));
  }, [files]);

  const simulateProgress = (id) => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 30 + 10;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "ready" } : f)));
      }
      if (progressRefs.current[id]) {
        progressRefs.current[id].style.width = Math.min(pct, 100) + "%";
      }
    }, 150);
  };

  const onDrop = useCallback((accepted) => {
    const validFiles = accepted.filter((f) => f.size <= MAX_FILE_SIZE);
    const newEntries = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: "uploading",
    }));
    setFiles((prev) => [...prev, ...newEntries]);
    newEntries.forEach((e) => simulateProgress(e.id));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles,
    accept,
    noClick: false,
  });

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const readyCount = files.filter((f) => f.status === "ready").length;
  const totalSize = files.reduce((a, f) => a + f.file.size, 0);

  const bg = themeVars.inputBg || "#fff";
  const border = themeVars.borderColor || "#ced4da";
  const text = themeVars.bodyColor || "#212529";
  const muted = themeVars.mutedColor || "#6c757d";
  const primary = themeVars.primary || "#405189";
  const lightBg = themeVars.light || "#f8f9fa";

  // ── Dropzone ──────────────────────────────────────────────
  const renderDropzone = () => {
    if (isCompact) {
      return (
        <div
          {...getRootProps()}
          style={{
            border: `1.5px dashed ${isDragActive ? primary : border}`,
            borderRadius: 10,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            background: isDragActive ? `${primary}10` : bg,
            transition: "border-color 0.2s, background 0.2s",
            marginBottom: files.length > 0 ? 12 : 0,
          }}>
          <input {...getInputProps()} />
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              flexShrink: 0,
              background: `${primary}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <i className="ri-upload-cloud-2-line" style={{ fontSize: 24, color: primary }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: text, margin: "0 0 6px" }}>
              {isDragActive ? "Drop files to upload" : "Drag & drop files, or click to browse"}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ACCEPT_BADGES.map((t) => (
                <span
                  key={t.ext}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    padding: "2px 8px",
                    border: `0.5px solid ${t.color}40`,
                    borderRadius: 20,
                    color: t.color,
                    background: t.bg,
                  }}>
                  <i className={t.icon} style={{ fontSize: 12 }} />
                  {t.ext}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? primary : border}`,
          borderRadius: 10,
          padding: "2rem 1.5rem",
          textAlign: "center",
          cursor: "pointer",
          background: isDragActive ? `${primary}10` : bg,
          transition: "border-color 0.2s, background 0.2s",
        }}>
        <input {...getInputProps()} />
        <i className="ri-upload-cloud-2-line" style={{ fontSize: 40, color: primary, display: "block", marginBottom: 10 }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 6 }}>
          {isDragActive ? "Drop files here..." : "Drag & drop files here"}
        </p>
        <p style={{ fontSize: 13, color: muted, marginBottom: 16 }}>or click to browse — max 10MB per file</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {ACCEPT_BADGES.map((t) => (
            <span
              key={t.ext}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                padding: "3px 10px",
                border: `0.5px solid ${t.color}40`,
                borderRadius: 20,
                color: t.color,
                background: t.bg,
              }}>
              <i className={t.icon} style={{ fontSize: 13 }} />
              {t.ext}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── File row ──────────────────────────────────────────────
  const renderRow = (f) => {
    const meta = getMeta(f.file.name);
    const ext = getExt(f.file.name).toUpperCase() || "FILE";
    const isReady = f.status === "ready";

    if (isCompact) {
      const isHovered = hoveredRow === f.id;
      return (
        <div
          key={f.id}
          onMouseEnter={() => setHoveredRow(f.id)}
          onMouseLeave={() => setHoveredRow(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            border: `1px solid ${border}`,
            borderLeft: `3px solid ${isReady ? "#0ab39c" : primary}`,
            borderRadius: 8,
            background: isHovered ? lightBg : bg,
            animation: "fadeSlideIn 0.2s ease",
            transition: "background 0.15s ease",
          }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              flexShrink: 0,
              background: meta.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <i className={meta.icon} style={{ fontSize: 17, color: meta.color }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 240,
                }}>
                {f.file.name}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: 3,
                  background: meta.bg,
                  color: meta.color,
                  flexShrink: 0,
                }}>
                {ext}
              </span>
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
              {fmtSize(f.file.size)}
              {!isReady ? " \u00b7 Uploading..." : ""}
            </div>
            {!isReady && (
              <div style={{ height: 3, borderRadius: 2, background: `${border}60`, overflow: "hidden", marginTop: 5 }}>
                <div
                  ref={(el) => {
                    if (el) progressRefs.current[f.id] = el;
                  }}
                  style={{ height: "100%", borderRadius: 2, background: primary, width: "0%", transition: "width 0.3s ease" }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexShrink: 0,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}>
            <button
              type="button"
              onClick={() => removeFile(f.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: muted,
                fontSize: 16,
                padding: 4,
                borderRadius: 4,
                lineHeight: 1,
              }}
              title="Remove file">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      );
    }

    // spacious (original) row
    return (
      <div
        key={f.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          border: `0.5px solid ${border}`,
          borderRadius: 8,
          background: bg,
          animation: "fadeSlideIn 0.2s ease",
        }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            flexShrink: 0,
            background: meta.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <i className={meta.icon} style={{ fontSize: 18, color: meta.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 220,
              }}>
              {f.file.name}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: 4,
                background: meta.bg,
                color: meta.color,
                textTransform: "uppercase",
              }}>
              {ext}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: muted }}>{fmtSize(f.file.size)}</span>
            {isReady ? (
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 8px",
                  borderRadius: 20,
                  background: "rgba(10,179,156,0.15)",
                  color: "#0ab39c",
                  fontWeight: 500,
                }}>
                <i className="ri-checkbox-circle-line me-1" />
                Ready
              </span>
            ) : (
              <span style={{ fontSize: 11, padding: "1px 8px", borderRadius: 20, background: lightBg, color: muted, fontWeight: 500 }}>
                Uploading...
              </span>
            )}
          </div>
          <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: `${border}60`, overflow: "hidden" }}>
            <div
              ref={(el) => {
                if (el) progressRefs.current[f.id] = el;
              }}
              style={{
                height: "100%",
                borderRadius: 2,
                background: isReady ? "#0ab39c" : primary,
                width: isReady ? "100%" : "0%",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeFile(f.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: muted,
            fontSize: 18,
            padding: 2,
            borderRadius: 4,
            flexShrink: 0,
            lineHeight: 1,
          }}
          title="Remove file">
          <i className="ri-close-line" />
        </button>
      </div>
    );
  };

  return (
    <div>

      {renderDropzone()}

      {files.length > 0 && (
        <div style={{ marginTop: isCompact ? 0 : 14, display: "flex", flexDirection: "column", gap: isCompact ? 6 : 8 }}>
          {files.map((f) => renderRow(f))}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;