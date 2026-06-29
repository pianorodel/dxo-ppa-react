import error from "@/assets/images/error.svg";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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

const Basic404 = () => {
  document.title = `404 Error | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`;

  return (
    <React.Fragment>
      <style>{styles}</style>

      <div className="dxo-auth-wrapper">
        <CyberMesh />

        <div className="dxo-auth-content">
          <div className="dxo-404-card">
            <div className="dxo-brand-grid" />

            <div className="dxo-404-body">
              {/* Illustration */}
              <div className="dxo-404-img-wrap floating">
                <img src={error} alt="Page not found" className="dxo-404-img" />
              </div>

              {/* Badge */}
              <span className="dxo-badge dxo-badge-danger">
                <i className="ri-error-warning-line me-1" /> Error 404
              </span>

              {/* Glitch headline */}
              <h1 className="dxo-404-code" data-text="404">404</h1>
              <h3 className="dxo-404-title">Page Not Found</h3>
              <p className="dxo-404-desc">
                The page you're looking for doesn't exist or has been moved.
              </p>

              <div className="dxo-404-divider" />

              <Link to="/dashboard" className="dxo-404-btn">
                <i className="mdi mdi-home me-1" /> Back to Home
              </Link>
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

/* ─── Card ─── */
.dxo-404-card {
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

.dxo-404-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f06548, #ee6a4d, #185fa5, #f06548);
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

.dxo-404-body {
  position: relative;
  z-index: 1;
  padding: 40px 40px 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dxo-404-img-wrap { margin-bottom: 12px; }
.dxo-404-img {
  height: 130px;
  object-fit: contain;
  filter: drop-shadow(0 12px 30px rgba(240,101,72,0.35));
}

/* badge */
.dxo-badge {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  gap: 6px;
  letter-spacing: .08em;
  margin-bottom: 14px;
  padding: 5px 14px;
  text-transform: uppercase;
}
.dxo-badge-danger {
  background: linear-gradient(135deg, #f065482e, #f0654814);
  border: 1px solid #f065484d;
  color: #ff8a72;
}
.dxo-badge-danger i { color: #ff8a72; }

/* glitch 404 */
.dxo-404-code {
  position: relative;
  font-size: 76px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.02em;
  margin: 0 0 4px;
  background: linear-gradient(135deg, #eaf2f9, #5eead4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dxo-404-code::before,
.dxo-404-code::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0.6;
}
.dxo-404-code::before {
  background: linear-gradient(135deg, #f06548, #ff8a72);
  animation: dxoGlitch1 2.6s infinite steps(2);
}
.dxo-404-code::after {
  background: linear-gradient(135deg, #185fa5, #4dabf7);
  animation: dxoGlitch2 2.2s infinite steps(2);
}
@keyframes dxoGlitch1 {
  0%,92%,100% { transform: translate(0,0); opacity: 0; }
  93% { transform: translate(-3px,1px); opacity: 0.55; }
  96% { transform: translate(2px,-1px); opacity: 0.55; }
}
@keyframes dxoGlitch2 {
  0%,90%,100% { transform: translate(0,0); opacity: 0; }
  91% { transform: translate(3px,-1px); opacity: 0.5; }
  95% { transform: translate(-2px,1px); opacity: 0.5; }
}

.dxo-404-title {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #eaf2f9;
  margin: 0 0 8px;
}
.dxo-404-desc {
  font-size: 14px;
  color: #9fb2c5;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 320px;
}
.dxo-404-divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 24px 0;
}

/* CTA button — gradient like login submit */
.dxo-404-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 26px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #fff !important;
  text-decoration: none;
  background: linear-gradient(135deg, #0ab39c, #1e5f8a);
  box-shadow: 0 10px 24px -8px rgba(10,179,156,0.6);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.dxo-404-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 14px 30px -8px rgba(10,179,156,0.7);
  color: #fff !important;
}

/* ─── Responsive ─── */
@media (max-width: 540px) {
  .dxo-404-body { padding: 32px 24px 34px; }
  .dxo-404-code { font-size: 60px; }
  .dxo-404-img { height: 104px; }
}
@media (max-height: 720px) {
  .dxo-404-img { height: 100px; }
  .dxo-404-body { padding: 30px 36px 32px; }
  .dxo-404-divider { margin: 18px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dxo-cyber-bg::before, .dxo-cyber-bg::after,
  .dxo-404-card, .floating, .dxo-404-card::before,
  .dxo-404-code::before, .dxo-404-code::after { animation: none !important; }
}
`;

export default Basic404;