import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import FileViewer from "@/components/Common/Modals/FileViewer";

const S3_BASE = process.env.REACT_APP_S3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

const EXT_META = {
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
  zip: { bg: "rgba(95,94,90,0.12)", color: "#5F5E5A", icon: "ri-file-zip-line" },
  rar: { bg: "rgba(95,94,90,0.12)", color: "#5F5E5A", icon: "ri-file-zip-line" },
  default: { bg: "rgba(83,74,183,0.12)", color: "#534AB7", icon: "ri-file-line" },
};

const getExt = (name = "") => (name.split(".").pop() || "").toLowerCase();
const getMeta = (name = "") => EXT_META[getExt(name)] || EXT_META.default;
const fmtSize = (b) => (b == null ? "\u2014" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const baseName = (path = "") => path.split("/").pop();

const IconBox = ({ meta, size = 36, uploading = false }) => (
  <div
    className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
    style={{ width: size, height: size, background: uploading ? "rgba(55,138,221,0.15)" : meta.bg }}>
    {uploading ? (
      <div
        style={{
          width: 14,
          height: 14,
          border: "2px solid rgba(55,138,221,0.25)",
          borderTopColor: "#378add",
          borderRadius: "50%",
          animation: "sfuSpin 0.8s linear infinite",
        }}
      />
    ) : (
      <i className={meta.icon} style={{ fontSize: size === 38 ? 20 : 18, color: meta.color }} />
    )}
  </div>
);

const ExtBadge = ({ ext, meta }) => (
  <span
    className="text-uppercase fw-bold flex-shrink-0"
    style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: meta.bg, color: meta.color }}>
    {ext}
  </span>
);

const ViewFileCard = ({ path, fileName, fileSize, onView }) => {
  const [hovered, setHovered] = useState(false);
  const name = baseName(path);
  const ext = getExt(name);
  const meta = getMeta(name);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="d-flex align-items-center gap-3 rounded-2"
      style={{
        padding: "10px 14px",
        border: "1px solid var(--vz-border-color)",
        borderLeft: "3px solid #534AB7",
        background: hovered ? "var(--vz-light)" : "var(--vz-card-bg)",
        transition: "background 0.15s ease",
      }}>
      <IconBox meta={meta} />
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span onClick={onView} className="fw-semibold text-truncate flex-grow-1" style={{ fontSize: 13, cursor: "pointer" }} title={fileName}>
            {fileName}
          </span>
          <ExtBadge ext={ext} meta={meta} />
        </div>
        {fileSize != null && (
          <span className="text-muted" style={{ fontSize: 12 }}>
            {fmtSize(fileSize)}
          </span>
        )}
      </div>
    </div>
  );
};

const ExistingFileCard = ({ path, fileName, fileSize, onRemove, onView, disabled }) => {
  const [hovered, setHovered] = useState(false);
  const name = baseName(path);
  const ext = getExt(name);
  const meta = getMeta(name);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="d-flex align-items-center gap-3 rounded-2"
      style={{
        padding: "10px 14px",
        border: "1px solid var(--vz-border-color)",
        borderLeft: "3px solid #0ab39c",
        background: hovered ? "var(--vz-light)" : "var(--vz-card-bg)",
        transition: "background 0.15s ease",
      }}>
      <IconBox meta={meta} />
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span onClick={onView} className="fw-semibold text-truncate flex-grow-1" style={{ fontSize: 13, cursor: "pointer" }} title={fileName}>
            {fileName}
          </span>
          <ExtBadge ext={ext} meta={meta} />
        </div>
        {fileSize != null && (
          <span className="text-muted" style={{ fontSize: 12 }}>
            {fmtSize(fileSize)}
          </span>
        )}
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-link p-0 flex-shrink-0 text-muted"
          style={{ fontSize: 18, lineHeight: 1, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}
          title="Remove">
          <i className="ri-close-line" />
        </button>
      )}
    </div>
  );
};

const NewFileCard = ({ file, progress, uploading, onRemove, disabled }) => {
  const [hovered, setHovered] = useState(false);
  const meta = getMeta(file.name);
  const ext = getExt(file.name).toUpperCase() || "FILE";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="d-flex align-items-center gap-3 rounded-2"
      style={{
        padding: "10px 14px",
        border: "1px solid var(--vz-border-color)",
        borderLeft: `3px solid ${uploading ? "#378add" : "#0ab39c"}`,
        background: hovered ? "var(--vz-light)" : "var(--vz-card-bg)",
        animation: "sfuSlideIn 0.2s ease",
        transition: "background 0.15s ease",
      }}>
      <IconBox meta={meta} uploading={uploading} />
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="fw-semibold text-truncate flex-grow-1" style={{ fontSize: 13 }} title={file.name}>
            {file.name}
          </span>
          <ExtBadge ext={ext} meta={meta} />
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: 12 }}>
            {fmtSize(file.size)}
          </span>
          {uploading && (
            <span
              className="fw-medium"
              style={{ fontSize: 11, padding: "1px 8px", borderRadius: 20, background: "rgba(55,138,221,0.15)", color: "#378add" }}>
              {progress}% uploading...
            </span>
          )}
        </div>
        {uploading && (
          <div className="mt-1 overflow-hidden" style={{ height: 3, borderRadius: 2, background: "rgba(0,0,0,0.08)" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#378add", width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>
        )}
      </div>
      {!disabled && !uploading && (
        <button
          type="button"
          onClick={onRemove}
          className="btn btn-link p-0 flex-shrink-0 text-muted"
          style={{ fontSize: 18, lineHeight: 1, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}
          title="Remove">
          <i className="ri-close-line" />
        </button>
      )}
    </div>
  );
};

const SingleFileUpload = ({
  label,
  description,
  icon,
  iconColor,
  iconBg,
  existingFile = null,
  fileName,
  fileSize,
  onFileChange,
  disabled = false,
  accept,
  onRemove,
  isView = false,
}) => {
  const [newFile, setNewFile] = useState(null);
  const [existingRemoved, setExistingRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openViewer, setOpenViewer] = useState(false);
  const [viewUrl, setViewUrl] = useState("");
  const [viewName, setViewName] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const timerRef = useRef(null);
  const blobUrlRef = useRef(null);

  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    },
    [],
  );

  const handleDrop = useCallback(
    (accepted) => {
      if (!accepted?.length) return;
      const file = accepted[0];
      if (file.size > MAX_FILE_SIZE) return;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = URL.createObjectURL(file);
      setNewFile(file);
      setExistingRemoved(true);
      setUploading(true);
      setProgress(0);
      clearInterval(timerRef.current);
      let pct = 0;
      timerRef.current = setInterval(() => {
        pct += Math.random() * 25 + 10;
        if (pct >= 100) {
          clearInterval(timerRef.current);
          setProgress(100);
          setUploading(false);
          onFileChange?.(file);
        } else {
          setProgress(Math.round(pct));
        }
      }, 180);
    },
    [onFileChange],
  );

  const handleRemoveNew = () => {
    clearInterval(timerRef.current);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    onRemove?.({ type: "new", file: newFile });
    setNewFile(null);
    setUploading(false);
    setProgress(0);
    onFileChange?.(null);
  };

  const handleRemoveExisting = () => {
    onRemove?.({ type: "existing", path: existingFile });
    setExistingRemoved(true);
    onFileChange?.(null);
  };

  const openExistingViewer = () => {
    const fullRoute = `${S3_BASE}${existingFile}`;
    const ext = getExt(existingFile);
    const viewerUrl = OFFICE_EXTS.includes(ext) ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullRoute)}` : fullRoute;
    setViewUrl(viewerUrl);
    setOriginalUrl(fullRoute);
    setViewName(fileName || baseName(existingFile));
    setOpenViewer(true);
  };

  const openNewViewer = () => {
    if (!blobUrlRef.current) return;
    setViewUrl(blobUrlRef.current);
    setOriginalUrl(blobUrlRef.current);
    setViewName(newFile.name);
    setOpenViewer(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop, multiple: false, disabled: disabled || isView, accept });

  const showExisting = !!existingFile && !existingRemoved && !newFile;
  const showNew = !!newFile;
  const showDropzone = !showExisting && !showNew && !disabled && !isView;

  const headerColor = isView ? "#534AB7" : iconColor || "#534AB7";
  const headerBg = isView ? "rgba(83,74,183,0.12)" : iconBg || "rgba(83,74,183,0.12)";
  const headerIcon = icon || "ri-file-line";

  return (
    <div className="border rounded-3 overflow-hidden">
      <FileViewer
        data={viewUrl}
        originalUrl={originalUrl}
        onCloseClick={() => setOpenViewer(false)}
        show={openViewer}
        moduleName={`View: ${viewName}`}
      />

      {(label || description) && (
        <div
          className="d-flex align-items-center gap-3 px-3 py-2 border-bottom"
          style={{ background: isView ? "rgba(83,74,183,0.05)" : "var(--vz-light)" }}>
          <div
            className="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, background: headerBg }}>
            <i className={headerIcon} style={{ fontSize: 16, color: headerColor }} />
          </div>
          <div className="flex-grow-1">
            {label && (
              <div className="fw-bold" style={{ fontSize: 13 }}>
                {label}
              </div>
            )}
            {description && (
              <div className="text-muted" style={{ fontSize: 11 }}>
                {description}
              </div>
            )}
          </div>
          {!isView && showNew && uploading && (
            <span
              className="fw-bold flex-shrink-0"
              style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(55,138,221,0.12)", color: "#378add" }}>
              <i className="ri-loader-4-line me-1" />
              Uploading
            </span>
          )}
        </div>
      )}

      <div className="p-3 d-flex flex-column gap-2">
        {isView ? (
          existingFile ? (
            <ViewFileCard path={existingFile} fileName={fileName} fileSize={fileSize} onView={openExistingViewer} />
          ) : (
            <div
              className="d-flex align-items-center gap-2 rounded-2 text-muted"
              style={{ padding: "12px 14px", border: "1.5px dashed var(--vz-border-color)" }}>
              <i className="ri-file-unknow-line fs-5" />
              <span className="fw-medium" style={{ fontSize: 12 }}>
                No file attached
              </span>
            </div>
          )
        ) : (
          <>
            {showExisting && (
              <ExistingFileCard
                path={existingFile}
                fileName={fileName}
                fileSize={fileSize}
                onRemove={handleRemoveExisting}
                onView={openExistingViewer}
                disabled={disabled}
              />
            )}
            {showNew && (
              <NewFileCard
                file={newFile}
                progress={progress}
                uploading={uploading}
                onRemove={handleRemoveNew}
                onView={openNewViewer}
                disabled={disabled}
              />
            )}
            {showDropzone && (
              <div
                {...getRootProps()}
                className="d-flex align-items-center gap-2 rounded-2"
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  border: `1.5px dashed ${isDragActive ? "#378add" : "var(--vz-border-color)"}`,
                  background: isDragActive ? "rgba(55,138,221,0.05)" : "transparent",
                  transition: "border-color 0.15s, background 0.15s",
                }}>
                <input {...getInputProps()} />
                <i className="ri-upload-cloud-2-line fs-5 flex-shrink-0" style={{ color: isDragActive ? "#378add" : "var(--vz-secondary-color)" }} />
                <span className="fw-semibold flex-shrink-0" style={{ fontSize: 12 }}>
                  {isDragActive ? "Drop file here..." : "Drag & drop or browse"}
                </span>
                <div className="d-flex gap-2 align-items-center ms-auto">
                  {[
                    { ext: "PDF", icon: "ri-file-pdf-line", color: "#993C1D", bg: "rgba(153,60,29,0.10)" },
                    { ext: "DOCX", icon: "ri-file-word-line", color: "#185FA5", bg: "rgba(24,95,165,0.10)" },
                    { ext: "XLSX", icon: "ri-file-excel-line", color: "#3B6D11", bg: "rgba(59,109,17,0.10)" },
                  ].map((t) => (
                    <span
                      key={t.ext}
                      className="d-inline-flex align-items-center gap-1 fw-semibold"
                      style={{
                        fontSize: 11,
                        padding: "3px 9px",
                        borderRadius: 20,
                        color: t.color,
                        background: t.bg,
                        border: `1px solid ${t.color}30`,
                      }}>
                      <i className={t.icon} style={{ fontSize: 12 }} />
                      {t.ext}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes sfuSpin    { to { transform: rotate(360deg); } }
        @keyframes sfuSlideIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

export default SingleFileUpload;
