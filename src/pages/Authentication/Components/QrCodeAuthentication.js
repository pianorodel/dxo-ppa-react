import { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useNotificationModal } from "@/context/notificationContext";
import "./QrCodeAuthentication.css";

const OTP_LENGTH = 6;

const STEP = 62; // 52px box + 10px gap
const TOTAL_W = OTP_LENGTH * 52 + (OTP_LENGTH - 1) * 10; // 362px

const boxCenterOffsets = Array.from({ length: OTP_LENGTH }, (_, i) =>
  i * STEP + 26 - TOTAL_W / 2
);

const QrCodeAuthentication = ({ qrValue, loginValue, isOpen, toggle }) => {
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [activeBox, setActiveBox] = useState(0);
  const [phase, setPhase] = useState("idle");
  // phases: idle | chasing | gathering | ringing | success | error
  const [secretKey, setSecretKey] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const inputRefs = useRef([]);
  const { notification } = useNotificationModal();

  const otpValue = otpDigits.join("");
  const isOtpComplete = otpValue.length === OTP_LENGTH;

  const isIdle      = phase === "idle";
  const isChasing   = phase === "chasing";
  const isGathering = phase === "gathering";
  const isRinging   = phase === "ringing";
  const isSuccess   = phase === "success";
  const isError     = phase === "error";
  const isVerifying = isChasing || isGathering || isRinging;
  const isMerged    = isGathering || isRinging || isSuccess || isError;

  const focusBox = (i) => {
    const idx = Math.max(0, Math.min(i, OTP_LENGTH - 1));
    setActiveBox(idx);
    inputRefs.current[idx]?.focus();
  };

  useEffect(() => {
    if (isOpen) {
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setActiveBox(0);
      setPhase("idle");
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (loginValue?.otpEnabled) setStep(2);
    else {
      setSecretKey(qrValue?.secretKey);
      setQrCode(qrValue?.qrCode);
    }
  }, [loginValue]);

  const onSubmit = async () => {
    if (!isOtpComplete || !isIdle) return;

    setPhase("chasing");
    await new Promise(r => setTimeout(r, 900));

    setPhase("gathering");
    await new Promise(r => setTimeout(r, 800));

    setPhase("ringing");

    const payload = { otp: otpValue, userId: loginValue.userId };
    try {
      const res = await fetch(process.env.REACT_APP_CORE_API + "/otp/validate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginValue.token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      await new Promise(r => setTimeout(r, 900));

      if (data?.success) {
        setPhase("success");
        setTimeout(() => {
          sessionStorage.setItem("currentUser", JSON.stringify(loginValue));
          window.location.href = "/";
        }, 2200);
      } else {
        setPhase("error");
        setTimeout(() => {
          setPhase("idle");
          setOtpDigits(Array(OTP_LENGTH).fill(""));
          setActiveBox(0);
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }, 1500);
      }
    } catch {
      setPhase("error");
      setTimeout(() => {
        setPhase("idle");
        notification({ type: "error", title: "Error", message: "Something went wrong." });
      }, 1500);
    }
  };

  const handleSetUp = async () => {
    const payload = { systemName: "DXO-Globo", userId: loginValue.userId };
    const res = await fetch(process.env.REACT_APP_CORE_API + "/otp/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginValue.token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.success) {
      setStep(1);
      setSecretKey(data?.returnData?.secretKey);
      setQrCode(data?.returnData?.qrCode);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(secretKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otpDigits[i]) { const n = [...otpDigits]; n[i] = ""; setOtpDigits(n); }
      else focusBox(i - 1);
    } else if (e.key === "ArrowLeft")  { focusBox(i - 1); }
    else if (e.key === "ArrowRight")   { focusBox(i + 1); }
    else if (e.key === "Enter" && isOtpComplete) { onSubmit(); }
  };

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val) return;
    const next = [...otpDigits]; next[i] = val; setOtpDigits(next);
    if (i < OTP_LENGTH - 1) focusBox(i + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setOtpDigits(next);
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={!isVerifying && !isError ? toggle : undefined}
      centered size="md"
      backdrop="static"
    >
      <ModalBody className="p-4">

        {step === 1 ? (
          <>
            <p className="text-muted fs-13 mb-1">
              <strong className="text-body">Step 1:</strong> Scan the QR Code using your
              third-party authenticator app or enter the key manually.
            </p>
            <br />
            <div className="d-flex justify-content-center mb-3">
              <div className="border border-2 rounded-3 p-3 text-body shadow-sm bg-body">
                <img src={qrCode} alt="QR Code" className="img-fluid" />
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-3 fs-13">
              <span className="text-muted">Or enter the key manually:</span>
              <span
                onClick={handleCopyKey}
                title="Click to copy"
                className="fw-bold text-body bg-light border rounded px-2 py-1 font-monospace fs-12"
                style={{ cursor: "pointer", letterSpacing: "0.05em" }}
              >
                {secretKey}
                <i
                  className={`ms-2 ${copied ? "ri-check-line text-success" : "ri-file-copy-line text-muted"}`}
                  style={{ fontSize: "14px", verticalAlign: "middle" }}
                />
              </span>
            </div>
            <p className="text-muted fs-13 mb-2">
              <strong className="text-body">Step 2:</strong> Verify the configuration by
              entering the 6-digit code generated by your authenticator app.
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otpValue}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
                const arr = val.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
                setOtpDigits(arr);
              }}
              className="form-control text-center fw-semibold fs-15"
              style={{ letterSpacing: "0.3em" }}
              maxLength={6}
              autoComplete="one-time-code"
            />
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center mb-3">
              <div style={{
                width: 52, height: 60, borderRadius: 10,
                backgroundColor: "rgba(10,179,156,.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0ab39c", fontSize: 22,
              }}>
                <i className="ri-lock-password-line" />
              </div>
            </div>

            <div className={`otp-header-area${isVerifying ? " faded" : ""}`}>
              <h5
                className="text-center fw-semibold mb-1"
                style={{
                  color: isSuccess ? "#0ab39c" : isError ? "#f06548" : "inherit",
                  transition: "color .35s ease",
                }}
              >
                {isSuccess ? "Verified!" : isError ? "Invalid Code" : "Verify OTP"}
              </h5>
              <p className="text-center text-muted fs-13 mb-4">
                {isSuccess
                  ? "You have been authenticated successfully."
                  : isError
                    ? "The code you entered is incorrect. Please try again."
                    : "Enter the verification code shown from your authenticator app."}
              </p>
            </div>

            <div className="rounded-3 p-3" style={{ minHeight: 90, position: "relative" }}>
              <div className="otp-box-wrap">

                {otpDigits.map((digit, i) => {
                  let cls = "otp-single-box";
                  if (isIdle) {
                    if (activeBox === i && !digit) cls += " otp-active";
                    if (digit) cls += " otp-filled";
                  }
                  if (isMerged) cls += " otp-orbiting";

                  const twist = `${(i % 2 === 0 ? 1 : -1) * (180 + i * 28)}deg`;

                  return (
                    <div
                      key={i}
                      className={`otp-chasing-wrap${isChasing ? " chasing" : ""}`}
                      style={{ "--spin-dur": `${0.58 + i * 0.04}s` }}
                    >
                      <input
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoComplete="one-time-code"
                        className={cls}
                        style={isMerged ? {
                          "--tx": `${-boxCenterOffsets[i]}px`,
                          "--ty": "0px",
                          "--twist": twist,
                          "--dur": `${0.42 + i * 0.045}s`,
                          "--del": `${i * 0.03}s`,
                        } : {}}
                        onFocus={() => setActiveBox(i)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={handlePaste}
                        readOnly={!isIdle}
                      />
                    </div>
                  );
                })}

                <MergedBox
                  isGathering={isGathering}
                  isRinging={isRinging}
                  isSuccess={isSuccess}
                  isError={isError}
                />

                <span className={[
                  "otp-result-label",
                  isSuccess ? "green show" : "",
                  isError   ? "red show"   : "",
                ].filter(Boolean).join(" ")}>
                  {isSuccess ? "Verified successfully" : isError ? "Invalid code" : ""}
                </span>

              </div>
            </div>

            <p className="text-center text-muted fs-13 mt-5 mb-0">
              Need to set up again?{" "}
              <a
                href="#!"
                className="text-success fw-semibold text-decoration-underline"
                onClick={handleSetUp}
              >
                Set Up Authenticator
              </a>
            </p>
          </>
        )}
      </ModalBody>

      <ModalFooter className="border-top bg-light px-4 py-3 gap-2">
        <Button
          color="light"
          onClick={toggle}
          className="border"
          disabled={isVerifying || isError}
        >
          <i className="ri-close-line me-1 align-middle" />
          Cancel
        </Button>
        <Button
          color="success"
          onClick={onSubmit}
          disabled={!isOtpComplete || isVerifying || isSuccess || isError}
        >
          {isVerifying ? (
            <>
              <span className="spinner-border spinner-border-sm me-1 align-middle" role="status" aria-hidden="true" />
              Verifying…
            </>
          ) : (
            <>
              <i className="ri-check-line me-1 align-middle" />
              Verify &amp; Continue
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

/* ── MergedBox sub-component ── */
const MergedBox = ({ isGathering, isRinging, isSuccess, isError }) => {
  const isMerged = isGathering || isRinging || isSuccess || isError;
  if (!isMerged) return null;

  const boxCls = [
    "otp-merged-box",
    isGathering ? "entering"  : "",
    isRinging   ? "ringing"   : "",
    isSuccess   ? "success"   : "",
    isError     ? "error"     : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={boxCls}>
      <div className={`otp-merged-spinner${isRinging ? " show" : ""}`}>
        <div
          className="spinner-border"
          role="status"
          style={{ width: 26, height: 26, borderWidth: 2.5, color: "#0ab39c" }}
        >
          <span className="visually-hidden">Verifying…</span>
        </div>
      </div>

      <div className={`otp-result-icon${isSuccess ? " show" : ""}`}>
        <svg viewBox="0 0 36 36" width="34" height="34" overflow="visible">
          <path className="otp-check-path" d="M8 19 L15 26 L28 11" />
        </svg>
      </div>

      <div className={`otp-result-icon${isError ? " show" : ""}`}>
        <svg viewBox="0 0 36 36" width="30" height="30" overflow="visible">
          <path className="otp-x-path" d="M10 10 L26 26" />
          <path className="otp-x-path" d="M26 10 L10 26" />
        </svg>
      </div>
    </div>
  );
};

export default QrCodeAuthentication;