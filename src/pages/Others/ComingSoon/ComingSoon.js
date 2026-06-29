import comingsoon from "@/assets/images/comingsoon.png";
import React, { useEffect, useRef } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

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

const ComingSoon = ({ title }) => {
  const navigate = useNavigate();

  document.title = `Coming Soon | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="dxo-cs-complete">
          <i className="ri-checkbox-circle-fill me-2" />
          You are good to go!
        </div>
      );
    }
    const items = [
      { label: "Days", value: String(days).padStart(2, "0"), max: 365 },
      { label: "Hours", value: String(hours).padStart(2, "0"), max: 24 },
      { label: "Minutes", value: String(minutes).padStart(2, "0"), max: 60 },
      { label: "Seconds", value: String(seconds).padStart(2, "0"), max: 60 },
    ];
    return (
      <div className="dxo-cs-countdown">
        {items.map(({ label, value, max }, i) => {
          const pct = (parseInt(value, 10) / max) * 100;
          return (
            <React.Fragment key={label}>
              <div className="dxo-cs-item">
                <div className="dxo-cs-num">
                  <div
                    className="dxo-cs-fill"
                    style={{
                      height: `${pct}%`,
                      transition: label === "Seconds" ? "height 1s linear" : "height 0.6s ease",
                    }}
                  />
                  <span className="dxo-cs-val">{value}</span>
                </div>
                <div className="dxo-cs-label">{label}</div>
              </div>
              {i < 3 && <div className="dxo-cs-colon">:</div>}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <React.Fragment>
      <style>{styles}</style>

      <div className="dxo-auth-wrapper">
        <CyberMesh />

        {/* ── Back Button ── */}
        <button className="dxo-cs-back" onClick={() => navigate(-2)}>
          <i className="ri-arrow-left-s-line" style={{ fontSize: 18 }} />
          <span>Go Back</span>
        </button>

        <div className="dxo-auth-content">
          <div className="dxo-cs-card">
            <div className="dxo-brand-grid" />

            <div className="dxo-cs-body">
              {/* Illustration */}
              <div className="dxo-cs-img-wrap floating">
                <img src={comingsoon} alt="Coming Soon" className="dxo-cs-img" />
              </div>

              {/* Badge */}
              <span className="dxo-badge">
                <i className="ri-time-line me-1" /> Under Development
              </span>

              {/* Headline */}
              {title && <p className="dxo-cs-subtitle">{title}</p>}
              <h1 className="dxo-cs-headline">Going Online Soon</h1>
              <p className="dxo-cs-desc">
                We're crafting something great.
                <br />
                The wait is almost over!
              </p>

              <div className="dxo-cs-divider" />

              <Countdown date="2026/04/30" renderer={renderer} />
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
.dxo-footer-wrap .text-muted { font-size: 11px; color: #9fb2c5 !important; }

.heart-beat { display: inline-block; animation: heartbeat 1.3s ease-in-out infinite; }
@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

.floating { animation: dxoFloat 5s ease-in-out infinite; }
@keyframes dxoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* ─── Back button ─── */
.dxo-cs-back {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(10,21,35,0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #eaf2f9;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}
.dxo-cs-back:hover {
  border-color: rgba(10,179,156,0.55);
  background: rgba(10,179,156,0.12);
  color: #5eead4;
}

/* ─── Card ─── */
.dxo-cs-card {
  position: relative;
  width: 100%;
  max-width: 480px;
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

.dxo-cs-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #185fa5, #0ab39c, #5eead4, #185fa5);
  background-size: 200% 100%;
  animation: dxoSheen 3s linear infinite;
  z-index: 2;
}
@keyframes dxoSheen { to { background-position: -200% 0; } }

.dxo-brand-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 34px 34px;
  -webkit-mask-image: radial-gradient(circle at 50% 25%, #000, transparent 78%);
          mask-image: radial-gradient(circle at 50% 25%, #000, transparent 78%);
  pointer-events: none;
}

.dxo-cs-body {
  position: relative;
  z-index: 1;
  padding: 40px 40px 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dxo-cs-img-wrap { margin-bottom: 22px; }
.dxo-cs-img {
  height: 116px;
  object-fit: contain;
  filter: drop-shadow(0 12px 30px rgba(30,130,220,0.45));
}

/* badge — matches login */
.dxo-badge {
  align-items: center;
  background: linear-gradient(135deg, #0ab39c2e, #0ab39c14);
  border: 1px solid #0ab39c4d;
  border-radius: 999px;
  color: #5eead4;
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  gap: 6px;
  letter-spacing: .08em;
  margin-bottom: 16px;
  padding: 5px 14px;
  text-transform: uppercase;
}
.dxo-badge i { color: #5eead4; }

.dxo-cs-subtitle {
  font-size: 12px;
  font-weight: 600;
  color: #9fb2c5;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
}
.dxo-cs-headline {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #eaf2f9, #5eead4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dxo-cs-desc {
  font-size: 14px;
  color: #9fb2c5;
  line-height: 1.7;
  margin-bottom: 0;
}
.dxo-cs-divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 24px 0;
}

/* ─── Countdown ─── */
.dxo-cs-countdown { display: flex; align-items: center; gap: 4px; }
.dxo-cs-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
}
.dxo-cs-num {
  position: relative;
  overflow: hidden;
  min-width: 68px;
  padding: 12px 14px;
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: #5eead4;
  background: rgba(94,234,212,0.06);
  border: 1px solid rgba(94,234,212,0.2);
  border-radius: 12px;
}
.dxo-cs-fill {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  background: rgba(10,179,156,0.22);
  border-radius: 0 0 11px 11px;
}
.dxo-cs-val { position: relative; z-index: 1; }
.dxo-cs-label {
  font-size: 11px;
  font-weight: 600;
  color: #9fb2c5;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 8px;
}
.dxo-cs-colon {
  font-size: 28px;
  font-weight: 800;
  color: rgba(159,178,197,0.5);
  margin-bottom: 18px;
  line-height: 1;
  user-select: none;
}
.dxo-cs-complete {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #0ab39c;
}

/* ─── Responsive ─── */
@media (max-width: 540px) {
  .dxo-cs-body { padding: 32px 24px 34px; }
  .dxo-cs-item { min-width: 60px; }
  .dxo-cs-num { font-size: 28px; min-width: 56px; padding: 10px; }
  .dxo-cs-headline { font-size: 24px; }
}
@media (max-height: 720px) {
  .dxo-cs-img { height: 90px; }
  .dxo-cs-body { padding: 30px 36px 32px; }
  .dxo-cs-divider { margin: 18px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dxo-cyber-bg::before, .dxo-cyber-bg::after,
  .dxo-cs-card, .floating, .dxo-cs-card::before { animation: none !important; }
}
`;

export default ComingSoon;