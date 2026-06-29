import { useEffect, useState } from "react";

import defaultTrxImg from "@/assets/images/default_transaction.png";
import defaultSettingsImg from "@/assets/images/gear.webp";
import "@/assets/scss/modern-modal.css";

import { DateTimeLabel } from "../DateTimeLabel";

const ModernModal = ({
  isOpen = false,
  fullscreen: initialFullscreen = false,
  isUpdate = false,
  isProcess = false,
  title,
  width = "980px",
  children,
  modifiedDate = null,
  isSaving = false,
  canSave = false,
  onSave = () => {},
  isSubmitting = false,
  canSubmit = false,
  onSubmit = () => {},
  isCancelling = false,
  canCancel = false,
  onCancel = () => {},
  onClose = () => {},
  isDisabledFooter = false,
  footerContent = null,
  customHeaderSubLabel = null,
}) => {
  const [fullscreen, setFullscreen] = useState(initialFullscreen);

  // Reset fullscreen when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullscreen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`}>
      <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`} style={{ width: fullscreen ? "" : width }}>
        {/* HEADER */}
        <div className="emd-hdr">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
            <div className="emd-avatar-wrap">
              {isProcess ? <img src={defaultTrxImg} style={{ height: "55px" }} /> : <img src={defaultSettingsImg} style={{ height: "55px" }} />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{title}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {customHeaderSubLabel ? (
                  customHeaderSubLabel
                ) : (
                  <>
                    <i className="ri-edit-box-line text-warning" style={{ fontSize: 16 }} />
                    {isUpdate ? (
                      <span className="text-white">
                        You are in <strong style={{ color: "#f7b84b" }}>Edit Mode</strong> — modify fields and click{" "}
                        <strong style={{ color: "#5de8d4" }}>Save</strong> to apply.
                      </span>
                    ) : (
                      <span className="text-white">
                        Input all required <strong className="text-danger">*</strong> fields and click{" "}
                        <strong style={{ color: "#5de8d4" }}>Save</strong> to apply.
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <button className="emd-icon-btn" onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
              </button>
              <button className="emd-icon-btn emd-close" onClick={onClose} title="Close">
                <i className="ri-close-line" style={{ fontSize: 17 }} />
              </button>
            </div>
          </div>
        </div>

        {/* BODY — dynamic content injected here */}
        <div className="emd-body">{children}</div>

        {/* FOOTER */}
        {!isDisabledFooter && (
          <div className="emd-ftr">
            <span style={{ fontSize: 12, fontWeight: 500 }}>
              {modifiedDate && (
                <>
                  Last updated: <DateTimeLabel value={modifiedDate} />
                </>
              )}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {footerContent ?? (
                <>
                  {!isSaving && !isSubmitting && !isCancelling && (
                    <button className="emd-btn emd-btn-light emd-btn-sm" onClick={onClose}>
                      <i className="ri-close-line me-1 align-middle"></i>
                      Close
                    </button>
                  )}
                  {canSave && !isSubmitting && !isCancelling && (
                    <button className="emd-btn emd-btn-success emd-btn-sm" onClick={onSave} disabled={isSaving || isSubmitting || isCancelling}>
                      <i className={isSaving ? "ri-loader-4-line" : "ri-save-line"} />
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  )}
                  {canSubmit && !isSaving && !isCancelling && (
                    <button className="emd-btn emd-btn-success emd-btn-sm" onClick={onSubmit} disabled={isSaving || isSubmitting || isCancelling}>
                      <i className={isSubmitting ? "ri-loader-4-line" : "ri-send-plane-fill"} />
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                  {canCancel && !isSaving && !isSubmitting && (
                    <button className="emd-btn emd-btn-danger emd-btn-sm" onClick={onCancel} disabled={isSaving || isSubmitting || isCancelling}>
                      <i className={isCancelling ? "ri-loader-4-line" : "ri-forbid-2-fill"} />
                      {isCancelling ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernModal;
