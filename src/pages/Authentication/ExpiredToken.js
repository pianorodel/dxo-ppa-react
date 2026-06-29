import React, { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

import companyLogo from "@/assets/images/dxo/logo-3d.png";

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

const ExpiredToken = () => {
  useEffect(() => {
    document.title = `Link Expired | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME} Enterprise Application Suite`;
  }, []);

  return (
    <React.Fragment>
      <style>{styles}</style>

      <div className="dxo-auth-wrapper">
        <CyberMesh />

        <div className="dxo-auth-content">
          <div className={`dxo-expired-shell${isMobile ? " is-mobile" : ""}`}>
            <div className="dxo-expired-anim">
              {/* ── Icon ── */}
              <div className="dxo-expired-icon">
                <i className="ri-time-line" />
                <span className="dxo-expired-ring" />
                <span className="dxo-expired-ring delay" />
              </div>

              {/* ── Heading ── */}
              <h2 className="dxo-expired-title">Link Expired</h2>

              <p className="dxo-expired-lead">
                This password reset link is no longer valid. 😭
              </p>

              <p className="dxo-expired-sub">
                Password reset links expire after 60 mins to keep your account secure.
              </p>

              <div className="dxo-expired-note">
                <i className="ri-information-line me-2" />
                This link may have expired, already been used, or been replaced by a newer request.
              </div>

              {/* ── Actions ── */}
              <div className="dxo-expired-actions">
                <Link to="/forgot-password" className="w-100">
                  <Button color="success" className="w-100 dxo-submit">
                    <i className="ri-refresh-line me-2" />
                    Request a New Link
                  </Button>
                </Link>

                <Link to="/login" className="dxo-back-link">
                  <i className="ri-arrow-left-line me-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="dxo-footer-wrap">
          <p className="mb-0 text-muted">
            &copy; 2026 Enterprise Application Suite. Crafted with{" "}
            <i className="mdi mdi-heart text-danger heart-beat" title="Made with love" />{" "}
            by DXO IT &amp; CyberSecurity Services
          </p>
        </footer>
      </div>
    </React.Fragment>
  );
};

// ════════════════════════════════════════════════════════════
//  Inlined styles — single-file, no external css needed
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

.heart-beat { display: inline-block; animation: heartbeat 1.3s ease-in-out infinite; }
@keyframes heartbeat {
  0%   { transform: scale(1); }
  14%  { transform: scale(1.3); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.3); }
  70%  { transform: scale(1); }
}

/* ─── Shell ─── */
.dxo-expired-shell {
  width: 100%;
  max-width: 460px;
  max-height: calc(100vh - 20px);
  border-radius: 22px;
  overflow: hidden;
  background: rgba(10,21,35,0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 50px 100px -30px rgba(0,0,0,0.8);
  animation: dxoRise 0.7s cubic-bezier(0.2,0.8,0.2,1);
  padding: 44px 40px 40px;
}
@keyframes dxoRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

.dxo-expired-anim { width: 100%; text-align: center; animation: dxoFade 0.45s ease; }
@keyframes dxoFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ─── Icon with pulse rings ─── */
.dxo-expired-icon {
  position: relative;
  width: 92px;
  height: 92px;
  margin: 0 auto 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(240,101,72,0.18), rgba(240,101,72,0.06));
  border: 1px solid rgba(240,101,72,0.35);
}
.dxo-expired-icon i {
  font-size: 44px;
  color: #f0936b;
  filter: drop-shadow(0 0 14px rgba(240,101,72,0.45));
  z-index: 2;
}
.dxo-expired-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(240,101,72,0.45);
  animation: dxoPulseRing 2.6s ease-out infinite;
}
.dxo-expired-ring.delay { animation-delay: 1.3s; }
@keyframes dxoPulseRing {
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.7); opacity: 0; }
}

/* ─── Text ─── */
.dxo-expired-title {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 14px;
  background: linear-gradient(135deg, #f0936b, #f06548);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dxo-expired-lead {
  color: #eaf2f9;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
}
.dxo-expired-sub {
  color: #9fb2c5;
  font-size: 13.5px;
  line-height: 1.55;
  margin: 0 0 20px;
}
.dxo-expired-note {
  display: flex;
  align-items: flex-start;
  text-align: left;
  gap: 2px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px 14px;
  color: #b6c5d6;
  font-size: 12.5px;
  line-height: 1.5;
  margin-bottom: 26px;
}
.dxo-expired-note i { color: #5eead4; font-size: 16px; flex-shrink: 0; margin-top: 1px; }

/* ─── Actions ─── */
.dxo-expired-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.dxo-expired-actions a.w-100 { text-decoration: none; }
.dxo-submit {
  position: relative;
  overflow: hidden;
  border: none !important;
  padding: 12px !important;
  font-weight: 600;
}
.dxo-back-link {
  color: #9fb2c5;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}
.dxo-back-link:hover { color: #5eead4; }

/* ─── Mobile ─── */
.dxo-expired-shell.is-mobile {
  max-width: 420px;
  border-radius: 18px;
  padding: 36px 26px 30px;
}
.dxo-expired-shell.is-mobile .dxo-expired-title { font-size: 23px; }
.dxo-expired-shell.is-mobile .dxo-expired-icon { width: 82px; height: 82px; }
.dxo-expired-shell.is-mobile .dxo-expired-icon i { font-size: 38px; }

@media (max-width: 480px) {
  .dxo-expired-shell { padding: 34px 24px 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .dxo-expired-ring { animation: none; }
}
`;

export default ExpiredToken;