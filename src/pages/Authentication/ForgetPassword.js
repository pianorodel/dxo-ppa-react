import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Form } from "reactstrap";

import { EmailInputField } from "@/components/Common/Inputs";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";

import { EasterEgg } from "./EasterEgg";

import { useResetPasswordMutation } from "@/api/Endpoints/Core/Security/Users";

const companyLogo = require(`@/${process.env.REACT_APP_CUSTOMER_AUTH_LOGO}`);
const backgroundImage = require(`@/${process.env.REACT_APP_CUSTOMER_AUTH_BG}`);

// ── Animated cyber-mesh particle network (pure canvas, no deps) ──
const CyberMesh = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h, raf;
    let particles = [];
    const COUNT = 64;
    const LINK_DIST = 150;
    const SPEED = 1;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const init = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(94, 234, 212, 0.9)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.32;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(45, 160, 220, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(step);
    };

    resize();
    init();
    step();

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className="dxo-cyber-bg" aria-hidden="true" />
      <canvas ref={canvasRef} className="dxo-cyber-canvas" aria-hidden="true" />
    </>
  );
};

const ForgetPassword = () => {
  const { notification, hideModal } = useNotificationModal();

  const [resetPassword, { isLoading: isSending }] = useResetPasswordMutation();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [invalidCaptcha, setInvalidCaptcha] = useState(false);
  const [isEasterEggVisible, setIsEasterEggVisible] = useState(false);

  const { handleSubmit, control } = useForm({ defaultValues: { emailAddress: "" } });

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  document.title = `Reset Password | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`;

  const onSubmit = async (data) => {
    const payload = { emailAddress: data?.emailAddress || "" };
    try {
      if (!captchaValue) {
        setInvalidCaptcha(true);
        return;
      }

      const response = await resetPassword(payload).unwrap();
      assertApiSuccess(response);
      notification({
        type: "success",
        title: "Reset Password",
        message: "Reset Password was successfully sent.",
        customCloseButton: (
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <Button
              color="danger"
              onClick={() => {
                hideModal();
                window.location.href = "/login";
              }}>
              Back to Login
            </Button>
          </div>
        ),
      });
    } catch (error) {
      notification({ type: "error", title: "Reset Password", message: `${error.message || "Unknown error"}` });
    }
  };

  const handleLogoClick = (e) => {
    e.stopPropagation();
    setIsEasterEggVisible(true);
  };

  const closeEasterEgg = () => setIsEasterEggVisible(false);

  return (
    <React.Fragment>
      <style>{styles}</style>

      <div className="dxo-auth-wrapper">
        <CyberMesh />

        <div className="dxo-auth-content">
          {isEasterEggVisible ? (
            <EasterEgg handleClose={closeEasterEgg} />
          ) : (
            <div className={`dxo-auth-shell${isMobile ? " is-mobile" : ""}`}>
              {/* ── Brand panel ── */}
              <div className="dxo-brand" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="dxo-brand-overlay" />
                <div className="dxo-brand-grid" />

                <div className="dxo-brand-inner">
                  <div className="dxo-logo floating">
                    <img src={companyLogo} alt="Logo" className="logo-glow cursor-pointer" onClick={handleLogoClick} />
                  </div>

                  <h3 className="dxo-brand-title">
                    Recover access to your {process.env.REACT_APP_CUSTOMER_SHORT_NAME} Enterprise Application Suite.
                  </h3>

                  <ul className="dxo-feature-list">
                    <li>
                      <i className="ri-mail-send-line" />
                      <div>
                        <strong>Reset link by email</strong>
                        <span>We'll send a secure link to your registered address.</span>
                      </div>
                    </li>
                    <li>
                      <i className="ri-time-line" />
                      <div>
                        <strong>Time-limited &amp; single-use</strong>
                        <span>Links expire automatically to keep your account safe.</span>
                      </div>
                    </li>
                    <li>
                      <i className="ri-shield-keyhole-line" />
                      <div>
                        <strong>Enterprise-grade security</strong>
                        <span>Encrypted sessions and verified access at every step.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Form panel ── */}
              <div className="dxo-form-panel">
                <div className="dxo-form-anim">
                  <div className="dxo-form-head">
                    <span className="dxo-badge">
                      <i className="ri-lock-password-line me-1" /> Password Recovery
                    </span>
                    <h2 className="dxo-form-title">Forgot Password?</h2>
                    <p className="dxo-form-sub">
                      Reset password with <strong>{process.env.REACT_APP_CUSTOMER_SHORT_NAME}</strong>
                    </p>
                  </div>

                  <div className="dxo-hint" role="alert">
                    <i className="ri-information-line me-1" />
                    The instructions will be sent to you via email.
                  </div>

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-icon">
                      <EmailInputField
                        name="emailAddress"
                        control={control}
                        label="Email Address"
                        type="email"
                        className="form-control form-control-icon"
                        rules={{ required: "Email address is required." }}
                        placeholder="Enter email address..."
                      />
                    </div>

                    <div className="dxo-captcha-wrap">
                      <ReCAPTCHA sitekey={process.env.REACT_APP_CAPTCHA} onChange={(value) => setCaptchaValue(value)} />
                    </div>
                    {invalidCaptcha && !captchaValue && (
                      <div className="invalid-feedback d-block">Please verify CAPTCHA before continuing.</div>
                    )}

                    <Button color="success" type="submit" className="w-100 dxo-submit mt-3" disabled={isSending}>
                      <i className="ri-mail-send-line me-1" />
                      {isSending ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <div className="dxo-signup-prompt">
                      Wait, I remember my password...{" "}
                      <Link to="/login" className="text-success fw-semibold">
                        Click here
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="dxo-footer-wrap">
          <p className="mb-0 text-muted">
            &copy; 2026 Enterprise Application Suite. Crafted with{" "}
            <i
              className="mdi mdi-heart text-danger heart-beat"
              role="button"
              title="Made with love"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />{" "}
            by DXO IT &amp; CyberSecurity Services
          </p>
        </footer>
      </div>
    </React.Fragment>
  );
};

// ════════════════════════════════════════════════════════════
//  Inlined styles — single-file, no external login.css needed
// ════════════════════════════════════════════════════════════
const styles = `
.dxo-auth-wrapper {
  position: relative;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ─── Animated cyber-mesh background ─── */
.dxo-cyber-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: radial-gradient(1100px 700px at 50% -10%, #0e2a47 0%, #081a2e 50%, #050d18 100%);
}
.dxo-cyber-bg::before {
  content: "";
  position: absolute;
  inset: -50%;
  background-image:
    linear-gradient(rgba(45,130,220,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45,130,220,0.10) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse 65% 65% at 50% 45%, #000 30%, transparent 80%);
          mask-image: radial-gradient(ellipse 65% 65% at 50% 45%, #000 30%, transparent 80%);
  animation: dxoGridDrift 50s linear infinite;
}
.dxo-cyber-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(420px 420px at 18% 22%, rgba(10,179,156,0.16), transparent 60%),
    radial-gradient(460px 460px at 82% 78%, rgba(30,95,138,0.22), transparent 62%);
  filter: blur(30px);
  animation: dxoGlowPulse 12s ease-in-out infinite;
}
.dxo-cyber-canvas { position: fixed; inset: 0; z-index: 1; pointer-events: none; }

@keyframes dxoGridDrift { to { transform: translate(48px, 48px); } }
@keyframes dxoGlowPulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }

/* ─── Layout ─── */
.dxo-auth-content {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}
.dxo-footer-wrap {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 4px 16px 50px;
}
.dxo-footer-wrap .text-muted { font-size: 11px; }

.heart-beat {
  display: inline-block;
  animation: heartbeat 1.3s ease-in-out infinite;
}
@keyframes heartbeat {
  0%   { transform: scale(1); }
  14%  { transform: scale(1.3); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.3); }
  70%  { transform: scale(1); }
}

/* ─── Shell ─── */
.dxo-auth-shell {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  width: 100%;
  max-width: 1070px;
  min-height: 560px;
  max-height: calc(100vh - 20px);
  border-radius: 22px;
  overflow: hidden;
  background: rgba(10,21,35,0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 50px 100px -30px rgba(0,0,0,0.8);
  animation: dxoRise 0.7s cubic-bezier(0.2,0.8,0.2,1);
}
@keyframes dxoRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

/* ─── Brand panel ─── */
.dxo-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 38px 34px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.dxo-brand-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(3,40,107,0.82) 0%, rgba(8,22,38,0.9) 100%);
}
.dxo-brand-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 34px 34px;
  -webkit-mask-image: radial-gradient(circle at 35% 30%, #000, transparent 78%);
          mask-image: radial-gradient(circle at 35% 30%, #000, transparent 78%);
}
.dxo-brand-inner { position: relative; }
.dxo-logo { margin-bottom: 24px; }
.dxo-logo img { width: 78%; max-width: 290px; filter: drop-shadow(0 12px 30px rgba(30,130,220,0.45)); }
.logo-glow:hover { filter: drop-shadow(0 0 24px rgba(45,190,255,0.8)); }

.floating { animation: dxoFloat 5s ease-in-out infinite; }
@keyframes dxoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.dxo-brand-title {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.34;
  letter-spacing: -0.01em;
  margin-bottom: 22px;
}
.dxo-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 13px; }
.dxo-feature-list li { display: flex; gap: 13px; align-items: flex-start; }
.dxo-feature-list li i {
  flex-shrink: 0;
  width: 33px; height: 33px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 9px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  color: #5eead4;
  font-size: 16px;
}
.dxo-feature-list li strong { display: block; color: #eaf2f9; font-size: 13px; font-weight: 600; }
.dxo-feature-list li span { display: block; color: #9fb2c5; font-size: 11.5px; margin-top: 2px; }

/* ─── Form panel ─── */
.dxo-form-panel {
  background: #ffffff;
  padding: 40px 42px;
  display: flex;
  align-items: center;
  overflow-y: auto;
}
.dxo-form-panel::-webkit-scrollbar { width: 6px; }
.dxo-form-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.14); border-radius: 999px; }

.dxo-form-anim { width: 100%; animation: dxoFade 0.45s ease; }
@keyframes dxoFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.dxo-form-head { margin-bottom: 22px; }
.dxo-badge {
  align-items: center;
  background: linear-gradient(135deg, #0ab39c1f, #0ab39c0f);
  border: 1px solid #0ab39c40;
  border-radius: 999px;
  color: #0ab39c;
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  gap: 6px;
  letter-spacing: .07em;
  margin-bottom: .85rem;
  padding: 5px 14px;
  text-transform: uppercase;
}
.dxo-badge i { color: #0ab39c; }
.dxo-form-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
  background: linear-gradient(135deg, #405189, #0ab39c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dxo-form-sub { color: #878a99; font-size: 14px; margin-top: 6px; }
.dxo-form-sub strong { color: #495057; }

/* info hint banner */
.dxo-hint {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  background: #eefcfa;
  border: 1px solid #0ab39c33;
  color: #0a8c7c;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  font-size: 12.5px;
  margin-bottom: 18px;
}

/* field theming on white panel */
.dxo-form-panel .form-label, .dxo-form-panel label { color: #495057 !important; font-weight: 500; margin-bottom: 0.25rem; }
.dxo-form-panel .required-asterisk { color: #f06548; }
.dxo-form-panel .form-control {
  background: #f8f9fc !important;
  border: 1.5px solid #e4e6ef !important;
  color: #495057 !important;
  border-radius: 10px !important;
}
.dxo-form-panel .form-control::placeholder { color: #b5b5c3 !important; }
.dxo-form-panel .form-control:focus {
  background: #ffffff !important;
  border-color: rgba(10,179,156,0.65) !important;
  box-shadow: 0 0 0 3px rgba(10,179,156,0.14) !important;
  color: #495057 !important;
}
.dxo-form-panel .form-icon i { color: #b5b5c3 !important; }
.dxo-form-panel a.text-success { color: #0ab39c !important; font-size: 12.5px; }
.dxo-form-panel .invalid-feedback { color: #f06548 !important; font-size: 11.5px; }

.dxo-captcha-wrap {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  transform: scale(0.95);
  transform-origin: center top;
}

/* gradient submit + shine */
.dxo-submit {
  position: relative;
  overflow: hidden;
  border: none !important;
  padding: 12px !important;
}
@keyframes dxoSheen { 0% { background-position: 200% 0; } 60%,100% { background-position: -100% 0; } }

/* sign-in prompt below submit */
.dxo-signup-prompt {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: #878a99;
}
.dxo-form-panel .dxo-signup-prompt a.text-success {
  color: #0ab39c !important;
  font-size: 13px;
}

/* ─── Mobile ─── */
.dxo-auth-shell.is-mobile {
  grid-template-columns: 1fr;
  max-width: 440px;
  max-height: calc(100vh - 56px);
  border-radius: 18px;
}
.dxo-auth-shell.is-mobile .dxo-brand {
  min-height: 130px;
  padding: 22px;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.dxo-auth-shell.is-mobile .dxo-brand-title,
.dxo-auth-shell.is-mobile .dxo-feature-list { display: none; }
.dxo-auth-shell.is-mobile .dxo-logo { margin: 0 auto; }
.dxo-auth-shell.is-mobile .dxo-logo img { width: 190px; }
.dxo-auth-shell.is-mobile .dxo-form-panel { padding: 26px 22px; }
.dxo-auth-shell.is-mobile .dxo-form-title { font-size: 21px; }

/* responsive fallback for narrow desktop windows */
@media (max-width: 860px) {
  .dxo-auth-shell { grid-template-columns: 1fr; max-width: 440px; }
  .dxo-brand { min-height: 150px; justify-content: center; text-align: center; }
  .dxo-brand-title, .dxo-feature-list { display: none; }
  .dxo-logo { margin: 0 auto; }
  .dxo-logo img { width: 200px; }
  .dxo-form-panel { padding: 30px 26px; }
}

/* short-viewport safety net */
@media (max-height: 720px) {
  .dxo-form-head { margin-bottom: 16px; }
  .dxo-brand-title { font-size: 18px; margin-bottom: 16px; }
  .dxo-feature-list { gap: 10px; }
  .dxo-logo { margin-bottom: 18px; }
  .dxo-logo img { max-width: 250px; }
  .dxo-form-panel { padding: 28px 32px; }
}

@media (prefers-reduced-motion: reduce) {
  .dxo-cyber-bg::before, .dxo-cyber-bg::after,
  .dxo-auth-shell, .dxo-form-anim, .floating
}
`;

export default ForgetPassword;