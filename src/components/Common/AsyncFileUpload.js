import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { OFFICE_EXTS, getExtension, isImageFile } from "@/constants/fileTypes";

import useCustomHook from "../Hooks/useCustomHook";
import DeleteModal from "./Modals/DeleteModal";
import FileViewer from "./Modals/FileViewer";
import { PhotoViewer } from "./PhotoViewer";

const S3_BASE = process.env.REACT_APP_S3;
const getFullUrl = (path) => `${S3_BASE}${path}`;

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

const Spinner = ({ color = "#fff" }) => (
  <div
    style={{
      width: 14,
      height: 14,
      flexShrink: 0,
      border: `2px solid ${color}40`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "asyncSpinAnim 0.8s linear infinite",
    }}
  />
);

const AsyncFileUpload = ({
  files = [],
  uploadService,
  deleteService,
  uploadPayload = {},
  deletePayload = {},
  fileUploadKey = "files",
  fileUniqueId = "fileId",
  onUploadSuccess,
  onDeleteSuccess,
  onUploadError,
  onDeleteError,
  showStats = true,
  compact = true,
  disabled = false,
}) => {
  // Coerce compact so compact="false" / compact={0} / etc. behave correctly.
  const isCompact = compact !== false && compact !== "false" && compact !== 0;

  const { state, customFunction } = useCustomHook();
  const [fileList, setFileList] = useState([]);
  const [themeVars, setThemeVars] = useState({});
  const [viewer, setViewer] = useState({ open: false, url: "", original: "", name: "" });
  const [photoSrc, setPhotoSrc] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const progressMap = useRef({});
  const activeTimers = useRef({});

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
    setFileList(files.map((f) => ({ ...f, status: "done", _progress: 100 })));
  }, [files]);

  useEffect(() => {
    return () => {
      Object.values(activeTimers.current).forEach(clearTimeout);
    };
  }, []);

  const simulateProgress = useCallback((tempId) => {
    progressMap.current[tempId] = 0;
    const tick = () => {
      const current = progressMap.current[tempId];
      if (current === undefined || current >= 75) return;
      const next = Math.min(current + Math.random() * 10 + 5, 75);
      progressMap.current[tempId] = next;
      setFileList((prev) => prev.map((f) => (f._tempId === tempId ? { ...f, _progress: Math.round(next) } : f)));
      activeTimers.current[tempId] = setTimeout(tick, Math.random() * 400 + 200);
    };
    activeTimers.current[tempId] = setTimeout(tick, 150);
  }, []);

  const completeProgress = useCallback((tempId, doneData) => {
    clearTimeout(activeTimers.current[tempId]);
    delete activeTimers.current[tempId];
    delete progressMap.current[tempId];
    setFileList((prev) => prev.map((f) => (f._tempId === tempId ? { ...f, _progress: 100 } : f)));
    activeTimers.current[`done_${tempId}`] = setTimeout(() => {
      setFileList((prev) => prev.map((f) => (f._tempId === tempId ? { ...doneData, status: "done", _progress: 100 } : f)));
    }, 500);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length) return;
      const valid = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);
      const tempFiles = valid.map((file) => ({
        _tempId: crypto.randomUUID(),
        fileName: file.name,
        fileSize: file.size,
        status: "uploading",
        _progress: 0,
      }));
      setFileList((prev) => [...prev, ...tempFiles]);
      tempFiles.forEach((f) => simulateProgress(f._tempId));
      try {
        const res = await uploadService({ [fileUploadKey]: valid, ...uploadPayload }).unwrap();
        if (!res?.success) throw new Error("Upload failed");
        const uploaded = Array.isArray(res.returnData) ? res.returnData : [res.returnData];
        tempFiles.forEach((f, i) => completeProgress(f._tempId, uploaded[i] || {}));
        onUploadSuccess?.(res);
      } catch (err) {
        const ids = new Set(tempFiles.map((f) => f._tempId));
        tempFiles.forEach((f) => {
          clearTimeout(activeTimers.current[f._tempId]);
          delete activeTimers.current[f._tempId];
          delete progressMap.current[f._tempId];
        });
        setFileList((prev) => prev.filter((f) => !ids.has(f._tempId)));
        onUploadError?.(err);
      }
    },
    [uploadService, uploadPayload, fileUploadKey, simulateProgress, completeProgress, onUploadSuccess, onUploadError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, disabled, noClick: false });

  const handleRemoveClick = (e, file) => {
    e.stopPropagation();
    if (file.status === "uploading") return;
    customFunction.updateToggle("toggleDelete", file);
  };

  const handleConfirmDelete = async () => {
    const file = state?.trxValue;
    const fileId = file?.[fileUniqueId];
    try {
      const res = await deleteService({ [fileUniqueId]: fileId, ...deletePayload }).unwrap();
      if (res?.success) {
        setFileList((prev) => prev.filter((f) => f[fileUniqueId] !== fileId));
        onDeleteSuccess?.(fileId, res);
        customFunction.updateToggle("toggleDelete");
      }
    } catch (err) {
      onDeleteError?.(err);
    }
  };

  const handleView = (e, file, isImg) => {
    e.stopPropagation();
    if (isImg) {
      setPhotoSrc(getFullUrl(file.original));
    } else {
      const full = getFullUrl(file.original);
      const ext = getExtension(file.fileName);
      const url = OFFICE_EXTS.includes(ext) ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(full)}` : full;
      setViewer({ open: true, url, original: full, name: file.fileName });
    }
  };

  const bg = themeVars.inputBg || "#fff";
  const border = themeVars.borderColor || "#ced4da";
  const text = themeVars.bodyColor || "#212529";
  const muted = themeVars.mutedColor || "#6c757d";
  const primary = themeVars.primary || "#405189";
  const lightBg = themeVars.light || "#f8f9fa";

  const readyCount = fileList.filter((f) => f.status === "done").length;
  const totalSize = fileList.reduce((a, f) => a + (f.fileSize || f.size || 0), 0);

  // Dropzone: spacious (default) vs compact
  const renderDropzone = () => {
    if (disabled) return null;

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
            marginBottom: fileList.length > 0 ? 12 : 0,
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
              {[
                { ext: "PDF", icon: "ri-file-pdf-line", color: "#993C1D", bg: "rgba(153,60,29,0.1)" },
                { ext: "DOCX", icon: "ri-file-word-line", color: "#185FA5", bg: "rgba(24,95,165,0.1)" },
                { ext: "XLSX", icon: "ri-file-excel-line", color: "#3B6D11", bg: "rgba(59,109,17,0.1)" },
                { ext: "Image", icon: "ri-image-line", color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
                { ext: "ZIP", icon: "ri-file-zip-line", color: "#5F5E5A", bg: "rgba(95,94,90,0.1)" },
              ].map((t) => (
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
          marginBottom: fileList.length > 0 ? 14 : 0,
        }}>
        <input {...getInputProps()} />
        <i className="ri-upload-cloud-2-line" style={{ fontSize: 40, color: primary, display: "block", marginBottom: 10 }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 6 }}>
          {isDragActive ? "Drop files here..." : "Drag & drop files here"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { ext: "PDF", icon: "ri-file-pdf-line", color: "#993C1D", bg: "rgba(153,60,29,0.1)" },
            { ext: "DOCX", icon: "ri-file-word-line", color: "#185FA5", bg: "rgba(24,95,165,0.1)" },
            { ext: "XLSX", icon: "ri-file-excel-line", color: "#3B6D11", bg: "rgba(59,109,17,0.1)" },
            { ext: "Image", icon: "ri-image-line", color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
            { ext: "ZIP", icon: "ri-file-zip-line", color: "#5F5E5A", bg: "rgba(95,94,90,0.1)" },
          ].map((t) => (
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

  // File row: spacious (default) vs compact
  const renderRow = (file) => {
    const name = file.fileName || file.name || "";
    const size = file.fileSize || file.size || 0;
    const isUploading = file.status === "uploading";
    const isDone = file.status === "done";
    const progress = file._progress ?? (isDone ? 100 : 0);
    const meta = getMeta(name);
    const ext = getExt(name).toUpperCase() || "FILE";
    const isImg = isImageFile(name);
    const thumbUrl = file.thumbnail ? getFullUrl(file.thumbnail) : null;
    const rowId = file[fileUniqueId] || file._tempId;

    if (isCompact) {
      const isHovered = hoveredRow === rowId;
      return (
        <div
          key={rowId}
          onMouseEnter={() => setHoveredRow(rowId)}
          onMouseLeave={() => setHoveredRow(null)}
          onClick={(e) => isDone && handleView(e, file, isImg)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            border: `1px solid ${border}`,
            borderLeft: `3px solid ${isUploading ? primary : isDone ? "#0ab39c" : border}`,
            borderRadius: 8,
            background: isHovered ? lightBg : bg,
            animation: "asyncSlideIn 0.2s ease",
            cursor: isDone ? "pointer" : "default",
            transition: "background 0.15s ease",
          }}>
          {isImg && thumbUrl ? (
            <img src={thumbUrl} alt={name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: isUploading ? `${primary}20` : meta.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {isUploading ? <Spinner color={primary} /> : <i className={meta.icon} style={{ fontSize: 17, color: meta.color }} />}
            </div>
          )}

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
                {name}
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
              {fmtSize(size)}
              {isUploading ? ` \u00b7 Uploading ${progress}%` : ""}
            </div>
            {isUploading && (
              <div style={{ height: 3, borderRadius: 2, background: `${border}60`, overflow: "hidden", marginTop: 5 }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background: primary,
                    width: `${progress}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 4,
              flexShrink: 0,
              opacity: isHovered || isUploading ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => handleRemoveClick(e, file)}
                disabled={isUploading}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  color: isUploading ? `${muted}50` : muted,
                  fontSize: 16,
                  padding: 4,
                  borderRadius: 4,
                  lineHeight: 1,
                }}
                title="Remove file">
                <i className="ri-close-line" />
              </button>
            )}
          </div>
        </div>
      );
    }

    // spacious (original) row
    const barColor = primary;
    const isHovered = hoveredRow === rowId;
    return (
      <div
        key={rowId}
        onMouseEnter={() => setHoveredRow(rowId)}
        onMouseLeave={() => setHoveredRow(null)}
        onClick={(e) => isDone && handleView(e, file, isImg)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          border: `0.5px solid ${border}`,
          borderRadius: 8,
          background: isHovered ? lightBg : bg,
          animation: "asyncSlideIn 0.2s ease",
          cursor: isDone ? "pointer" : "default",
          transition: "background 0.15s ease",
        }}>
        {isImg && thumbUrl ? (
          <img src={thumbUrl} alt={name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
        ) : (
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              flexShrink: 0,
              background: isUploading ? `${primary}20` : meta.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {isUploading ? <Spinner color={primary} /> : <i className={meta.icon} style={{ fontSize: 18, color: meta.color }} />}
          </div>
        )}

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
              {name}
            </span>
            {!isUploading && (
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
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isUploading ? 4 : 0 }}>
            <span style={{ fontSize: 12, color: muted }}>{fmtSize(size)}</span>
            {isUploading && (
              <span style={{ fontSize: 11, padding: "1px 8px", borderRadius: 20, background: `${primary}15`, color: primary, fontWeight: 500 }}>
                {progress}% uploading...
              </span>
            )}
          </div>
          {isUploading && (
            <div style={{ height: 3, borderRadius: 2, background: `${border}60`, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: barColor,
                  width: `${progress}%`,
                  transition: "width 0.4s ease, background 0.3s ease",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            flexShrink: 0,
            opacity: isHovered || isUploading ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => handleRemoveClick(e, file)}
              disabled={isUploading}
              style={{
                background: "none",
                border: "none",
                cursor: isUploading ? "not-allowed" : "pointer",
                color: isUploading ? `${muted}50` : muted,
                fontSize: 16,
                padding: 2,
                borderRadius: 4,
              }}
              title="Remove file">
              <i className="ri-close-line" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <DeleteModal
        title={`Delete "${state?.trxValue?.fileName || "File"}"`}
        show={state?.toggle?.toggleDelete}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => customFunction.updateToggle("toggleDelete")}
      />

      <FileViewer
        data={viewer.url}
        originalUrl={viewer.original}
        show={viewer.open}
        moduleName={`View: ${viewer.name}`}
        onCloseClick={() => setViewer((v) => ({ ...v, open: false }))}
      />

      {photoSrc && (
        <PhotoViewer src={photoSrc} onClose={() => setPhotoSrc(null)}>
          <span style={{ display: "none" }} />
        </PhotoViewer>
      )}

      <style>{`
        @keyframes asyncSpinAnim { to { transform: rotate(360deg); } }
        @keyframes asyncSlideIn  { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* {showStats && fileList.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Files", value: fileList.length },
            { label: "Total size", value: fmtSize(totalSize) },
            { label: "Done", value: readyCount },
          ].map((s) => (
            <div key={s.label} style={{ background: lightBg, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: text }}>{s.value}</div>
            </div>
          ))}
        </div>
      )} */}

      {renderDropzone()}

      {fileList.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: isCompact ? 6 : 8 }}>{fileList.map((file) => renderRow(file))}</div>
      ) : disabled ? (
        <div style={{ textAlign: "center", padding: "2rem", color: muted, fontSize: 13 }}>
          <i className={isCompact ? "ri-folder-open-line" : "ri-file-unknow-line"} style={{ fontSize: 32, display: "block", marginBottom: 8, opacity: 0.4 }} />
          No files attached.
        </div>
      ) : null}
    </>
  );
};

export default AsyncFileUpload;