import { useCallback, useEffect, useState } from "react";

import defaultTrxImg from "@/assets/images/default_transaction.png";

import { DateTimeLabel } from "../DateTimeLabel";

const ModernModalWithStepper = ({
  isOpen = false,
  fullscreen: initialFullscreen = false,
  isUpdate = false,
  title,
  width = "980px",
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
  steps = [],
  validateStep,
  cancelLabel = "✕ Cancel",
  validateOnBack = false,
}) => {
  const [fullscreen, setFullscreen] = useState(initialFullscreen);
  const [current, setCurrent] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [stepStatus, setStepStatus] = useState(() => Array(steps.length).fill(null));

  useEffect(() => {
    if (!isOpen) setFullscreen(false);
  }, [isOpen]);

  const markStepAndMoveTo = useCallback((index, passed, targetIndex) => {
    setStepStatus((prev) => {
      const next = [...prev];
      next[index] = passed;
      return next;
    });
    setCurrent(targetIndex);
  }, []);

  const validate = async (stepIndex) => {
    if (validateStep) return validateStep(stepIndex);
    return true;
  };

  const next = async () => {
    setIsValidating(true);
    const valid = await validate(current);
    setIsValidating(false);
    markStepAndMoveTo(current, valid, Math.min(current + 1, steps.length - 1));
  };

  const prev = async () => {
    if (validateOnBack) {
      setIsValidating(true);
      const valid = await validate(current);
      setIsValidating(false);
      markStepAndMoveTo(current, valid, Math.max(current - 1, 0));
    } else {
      setCurrent(Math.max(current - 1, 0));
    }
  };

  const handleStepClick = async (i) => {
    if (i === current || isValidating) return;

    if (i > current) {
      setIsValidating(true);
      const valid = await validate(current);
      setIsValidating(false);
      markStepAndMoveTo(current, valid, i);
    } else {
      if (validateOnBack) {
        setIsValidating(true);
        const valid = await validate(current);
        setIsValidating(false);
        markStepAndMoveTo(current, valid, i);
      } else {
        setCurrent(i);
      }
    }
  };

  const validateAllSteps = async () => {
    setIsValidating(true);
    const results = await Promise.all(steps.map((_, i) => validate(i)));
    setIsValidating(false);

    const newStatus = results.map(Boolean);
    setStepStatus(newStatus);

    const firstFailIndex = steps.findIndex((step, i) => step?.hasRequired && !newStatus[i]);
    const hasIncomplete = firstFailIndex !== -1;

    if (hasIncomplete) {
      setCurrent(firstFailIndex);
    }

    return { valid: newStatus[current], hasIncomplete };
  };

  const handleSave = async () => {
    const { valid, hasIncomplete } = await validateAllSteps();
    if (!valid || hasIncomplete) return;
    onSave();
  };

  const handleSubmit = async () => {
    const { valid, hasIncomplete } = await validateAllSteps();
    if (!valid || hasIncomplete) return;
    onSubmit();
  };

  const getStepState = (i) => {
    if (i === current) return "active";
    const status = stepStatus[i];
    if (status === true) return "done";
    if (status === false) return steps[i]?.hasRequired ? "warning" : "visited";
    return "pending";
  };

  const stateIcon = (state, index) => {
    if (state === "done") return <i className="ri-check-line" />;
    if (state === "warning") return <i className="ri-error-warning-line" />;
    return index + 1;
  };

  if (!isOpen) return null;

  return (
    <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`}>
      <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`} style={{ width: fullscreen ? "" : width }}>
        <div className="emd-hdr">
          <div className="d-flex align-items-start gap-2 mb-3">
            <div className="emd-avatar-wrap">
              <img src={defaultTrxImg} style={{ height: "55px" }} />
            </div>
            <div className="flex-fill min-w-0">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span className="fs-5 fw-bold text-white">{title}</span>
              </div>
              <div className="d-flex gap-1 flex-wrap align-items-center">
                <i className="ri-edit-box-line text-warning" style={{ fontSize: 16 }} />
                {isUpdate ? (
                  <span className="text-white">
                    You are in <strong className="text-warning">Edit Mode</strong> — modify fields and click{" "}
                    <strong style={{ color: "#5de8d4" }}>Save</strong> to apply.
                  </span>
                ) : (
                  <span className="text-white">
                    Input all required <strong className="text-danger">*</strong> fields and click <strong style={{ color: "#5de8d4" }}>Save</strong>{" "}
                    to apply.
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center flex-shrink-0">
              <button className="emd-icon-btn" onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
              </button>
              <button className="emd-icon-btn emd-close" onClick={onClose} title="Close">
                <i className="ri-close-line" style={{ fontSize: 17 }} />
              </button>
            </div>
          </div>
        </div>

        <div className="emd-body">
          <div style={{ height: "640px" }}>
            <div className="vz-stepper w-100">
              {/* Stepper Header */}
              <div className="d-flex border-bottom" style={{ borderColor: "var(--vz-border-color)" }}>
                {steps.map((step, i) => {
                  const state = getStepState(i);
                  return (
                    <div
                      key={i}
                      onClick={() => handleStepClick(i)}
                      className={`vz-stepper-item ${state}${i !== current && !isValidating ? " vz-stepper-item--clickable" : ""}`}
                      title={i > current ? "Click to jump forward (current step will be validated)" : i < current ? "Click to go back" : undefined}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "14px 16px",
                        borderRight: i < steps.length - 1 ? `1px solid var(--vz-border-color)` : "none",
                        transition: "all 0.2s ease",
                        cursor: i !== current && !isValidating ? "pointer" : "default",
                      }}>
                      {/* Step Icon */}
                      <div
                        className={`
                          d-flex align-items-center justify-content-center rounded-circle flex-shrink-0
                          ${state === "active" ? "bg-primary text-white border-primary" : ""}
                          ${state === "done" ? "bg-success text-white border-success" : ""}
                          ${state === "warning" ? "bg-warning text-white border-warning" : ""}
                          ${state === "visited" || state === "pending" ? "bg-light text-body-secondary" : ""}
                        `}
                        style={{
                          width: 32,
                          height: 32,
                          fontSize: 12,
                          fontWeight: 600,
                          border: `1.5px solid var(--vz-border-color)`,
                          transition: "all 0.2s ease",
                          boxShadow: state === "active" ? `0 0 0 4px rgba(var(--vz-primary-rgb), 0.15)` : "none",
                        }}>
                        {isValidating && i === current ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : (
                          stateIcon(state, i)
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="min-w-0">
                        <div
                          className={`
                            text-uppercase fw-semibold text-truncate
                            ${state === "active" ? "text-primary" : ""}
                            ${state === "done" ? "text-success" : ""}
                            ${state === "warning" ? "text-warning" : ""}
                            ${state === "visited" || state === "pending" ? "text-body-secondary" : ""}
                          `}
                          style={{ fontSize: 12, letterSpacing: "0.5px" }}>
                          {step.title}
                        </div>
                        {state === "warning" && (
                          <div className="text-warning text-truncate" style={{ fontSize: 10, marginTop: 1 }}>
                            Required fields missing
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="progress rounded-0" style={{ height: 2 }}>
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: `${steps.length > 0 ? ((current + 1) / steps.length) * 100 : 0}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Step Content */}
              <div className="pt-4 pb-3">
                {steps.map((step, i) => (
                  <div key={i} style={{ display: i === current ? "block" : "none" }}>
                    {step.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="emd-ftr">
          <span className="fs-12 fw-medium flex-fill">
            {modifiedDate && (
              <>
                Last updated: <DateTimeLabel value={modifiedDate} />
              </>
            )}
          </span>

          <div className="d-flex gap-2">
            {current === 0 && (
              <button type="button" className="emd-btn emd-btn-light emd-btn-sm me-auto" onClick={onClose} disabled={isValidating}>
                {cancelLabel}
              </button>
            )}

            {current > 0 && (
              <button type="button" className="emd-btn emd-btn-light emd-btn-sm" onClick={prev} disabled={isValidating}>
                <i className="ri-arrow-left-s-line" />
                Back
              </button>
            )}

            {current < steps.length - 1 ? (
              <button type="button" className="emd-btn emd-btn-primary emd-btn-sm" onClick={next} disabled={isValidating}>
                {isValidating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                    Validating…
                  </>
                ) : (
                  "Next"
                )}
              </button>
            ) : (
              <>
                {canSave && !isSubmitting && (
                  <button
                    className="emd-btn emd-btn-success emd-btn-sm"
                    onClick={handleSave}
                    disabled={isSaving || isSubmitting || isCancelling || isValidating}>
                    <i className={isSaving || isValidating ? "ri-loader-4-line" : "ri-save-line"} />
                    {isSaving ? "Saving..." : isValidating ? "Validating…" : "Save"}
                  </button>
                )}
                {canSubmit && !isSaving && (
                  <button
                    className="emd-btn emd-btn-success emd-btn-sm"
                    onClick={handleSubmit}
                    disabled={isSaving || isSubmitting || isCancelling || isValidating}>
                    <i className={isSubmitting || isValidating ? "ri-loader-4-line" : "ri-send-plane-fill"} />
                    {isSubmitting ? "Submitting..." : isValidating ? "Validating…" : "Submit"}
                  </button>
                )}
                {canCancel && !isSaving && !isSubmitting && (
                  <button
                    className="emd-btn emd-btn-danger emd-btn-sm"
                    onClick={onCancel}
                    disabled={isSaving || isSubmitting || isCancelling || isValidating}>
                    <i className={isCancelling ? "ri-loader-4-line" : "ri-forbid-2-fill"} />
                    {isCancelling ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernModalWithStepper;
