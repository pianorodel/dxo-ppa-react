import maintenanceImg from "@/assets/images/maintenance.png";
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

const Maintenance = () => {
  document.title = `Maintenance | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`;

  return (
    <React.Fragment>
      <style>{styles}</style>

      <div className="dxo-auth-wrapper">
        <CyberMesh />

        <div className="dxo-auth-content">
          <div className="dxo-mt-card">
            <div className="dxo-brand-grid" />

            <div className="dxo-mt-body">
              {/* Illustration with rotating gear accent */}
              <div className="dxo-mt-img-wrap floating">
                <i className="ri-settings-3-line dxo-mt-gear" />
                <img src={maintenanceImg} alt="Under maintenance" className="dxo-mt-img" />
              </div>

              {/* Badge */}
              <span className="dxo-badge">
                <i className="ri-tools-line me-1" /> Scheduled Maintenance
              </span>

              {/* Headline */}
              <h1 className="dxo-mt-headline">Under Maintenance</h1>
              <p className="dxo-mt-desc">
                We're performing some upgrades right now.
                <br />
                Please check back shortly.
              </p>

              <div className="dxo-mt-divider" />

              <Link to="/" className="dxo-mt-btn">
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
.dxo-mt-card {
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

.dxo-mt-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f7b84b, #0ab39c, #185fa5, #f7b84b);
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

.dxo-mt-body {
  position: relative;
  z-index: 1;
  padding: 40px 40px 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dxo-mt-img-wrap { position: relative; margin-bottom: 16px; }
.dxo-mt-img {
  height: 150px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 12px 30px rgba(30,130,220,0.45));
}
.dxo-mt-gear {
  position: absolute;
  top: -6px;
  right: 14px;
  font-size: 30px;
  color: #5eead4;
  opacity: 0.85;
  filter: drop-shadow(0 0 10px rgba(94,234,212,0.5));
  animation: dxoSpin 6s linear infinite;
}
@keyframes dxoSpin { to { transform: rotate(360deg); } }

/* badge */
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
  margin-bottom: 14px;
  padding: 5px 14px;
  text-transform: uppercase;
}
.dxo-badge i { color: #5eead4; }

.dxo-mt-headline {
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
.dxo-mt-desc {
  font-size: 14px;
  color: #9fb2c5;
  line-height: 1.7;
  margin-bottom: 0;
  max-width: 340px;
}
.dxo-mt-divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 24px 0;
}

/* CTA button — gradient like login submit */
.dxo-mt-btn {
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
.dxo-mt-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 14px 30px -8px rgba(10,179,156,0.7);
  color: #fff !important;
}

/* ─── Responsive ─── */
@media (max-width: 540px) {
  .dxo-mt-body { padding: 32px 24px 34px; }
  .dxo-mt-img { height: 120px; }
  .dxo-mt-headline { font-size: 24px; }
}
@media (max-height: 720px) {
  .dxo-mt-img { height: 116px; }
  .dxo-mt-body { padding: 30px 36px 32px; }
  .dxo-mt-divider { margin: 18px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dxo-cyber-bg::before, .dxo-cyber-bg::after,
  .dxo-mt-card, .floating, .dxo-mt-card::before, .dxo-mt-gear { animation: none !important; }
}
`;

export default Maintenance;