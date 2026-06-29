import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardBody, Col, Container, Row, Spinner } from "reactstrap";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { InputField } from "@/components/Common/Inputs";

import { useUnlockAuthenticationMutation, useIdleAuthenticationMutation } from "@/api/Endpoints/Core/Authentication/Login";

const companyLogo = require(`@/${process.env.REACT_APP_CUSTOMER_AUTH_LOGO}`);
const backgroundImage = require(`@/${process.env.REACT_APP_CUSTOMER_AUTH_BG}`);

const LockScreen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ fullName: "User", avatar: "" });
  const [isAlert, setIsAlert] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const defaultValues = { password: "" };
  const { handleSubmit, control } = useForm({ defaultValues });

  const [unlockAuth, { isLoading }] = useUnlockAuthenticationMutation();
  const [idleAuthentication] = useIdleAuthenticationMutation();

  const logoRef = useRef(null);
  const posRef = useRef({ x: 60, y: 60, vx: 3.5, vy: 2.8 });
  const rafRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    idleAuthentication({});
  }, []);

  // Bouncing logo
  useEffect(() => {
    const animate = () => {
      const el = logoRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const pw = parent.clientWidth;
      const ph = parent.clientHeight;
      const lw = el.clientWidth;
      const lh = el.clientHeight;
      const p = posRef.current;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x + lw >= pw) { p.x = pw - lw; p.vx = -Math.abs(p.vx); }
      if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y + lh >= ph) { p.y = ph - lh; p.vy = -Math.abs(p.vy); }

      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    try {
      const session = sessionStorage.getItem("currentUser");
      const backup = localStorage.getItem("lockscreen_user");
      const source = session || backup;
      if (source) setUserData(JSON.parse(source));
    } catch (err) {
      console.warn("Failed to parse session user:", err);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.type === "keydown" && e.key === "Escape") { setRevealed(false); return; }
      if (e.type === "keydown" && e.key !== "Enter") return;
      setRevealed(true);
    };
    window.addEventListener("click", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const resetHideTimer = () => {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setRevealed(false), 3000);
  };

  useEffect(() => {
    if (!revealed) {
      clearTimeout(hideTimerRef.current);
      return;
    }

    resetHideTimer();

    window.addEventListener("mousemove", resetHideTimer);
    window.addEventListener("mousedown", resetHideTimer);
    window.addEventListener("keydown", resetHideTimer);
    window.addEventListener("touchstart", resetHideTimer);

    return () => {
      clearTimeout(hideTimerRef.current);
      window.removeEventListener("mousemove", resetHideTimer);
      window.removeEventListener("mousedown", resetHideTimer);
      window.removeEventListener("keydown", resetHideTimer);
      window.removeEventListener("touchstart", resetHideTimer);
    };
  }, [revealed]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        userName: userData.userName,
        password: data.password,
        principalId: userData.principalId,
        programId: userData.programId,
        programName: userData.programName,
      };
      const response = await unlockAuth(payload).unwrap();
      if (response?.success) {
        localStorage.removeItem("lockscreen_user");
        sessionStorage.removeItem("currentUser");
        sessionStorage.setItem("currentUser", JSON.stringify(response.returnData));
        navigate(-1);
      } else {
        setIsAlert(true);
        setTimeout(() => setIsAlert(false), 4000);
      }
    } catch (err) {
      console.error("Unlock error:", err);
      setIsAlert(true);
      setTimeout(() => setIsAlert(false), 4000);
    }
  };
  document.title = `Lock Screen | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`;

  return (
    <div className="lockscreen-root">
      <div
        className="lockscreen-bg"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(3, 40, 107, 0.85) 50%, rgba(64, 81, 137, 0.80) 100%), url(${backgroundImage})`,
        }}
      />
      <div className="lockscreen-gloss" />
      <div className="lockscreen-dvd-container">
        <img
          ref={logoRef}
          src={companyLogo}
          alt="DXO Logo"
          className="lockscreen-dvd-logo"
        />
      </div>
      {!revealed && (
        <div className="lockscreen-hint">
          <i className="ri-lock-line" style={{ fontSize: "3rem", opacity: 0.6 }} />
          <p className="mt-3 mb-0" style={{ opacity: 0.7, letterSpacing: "0.1em", fontSize: "0.85rem", textTransform: "uppercase" }}>
            Click anywhere or press Enter to unlock
          </p>
        </div>
      )}
      <div
        className={`auth-page-content mt-lg-5 position-relative lockscreen-content ${revealed ? "is-visible" : ""}`}
        style={{ zIndex: 10 }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4 lockscreen-card">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Lock Screen</h5>
                    <p className="text-muted">Enter your password to unlock the screen!</p>
                  </div>
                  <center>
                    <AvatarIcon name={userData.fullName} avatarImg={userData.avatar} width="6rem" height="6rem" fontSize="2rem" />
                    <h5 className="font-size-15 mt-3">{userData.fullName}</h5>
                  </center>
                  <div className="p-2 mt-4">
                    {isAlert && <Alert color="danger" isOpen={true}>Incorrect password!</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <InputField
                        name="password"
                        control={control}
                        label="Password"
                        type="password"
                        rules={{ required: "Password is required." }}
                        placeholder="Enter password..."
                      />
                      <Button color="success" className="w-100 mt-3" type="submit" disabled={isLoading}>
                        {isLoading && <Spinner size="sm" className="me-2" />}
                        Unlock
                      </Button>
                    </form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-4 text-center">
                <p className="mb-0 text-white">
                  Not you? Return to{" "}
                  <Link to="/login" className="fw-semibold text-warning text-decoration-underline">
                    Signin
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <style>{`
        .lockscreen-root {
          position: fixed;
          inset: 0;
          overflow: hidden;
        }

        .lockscreen-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .lockscreen-gloss {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0.00) 30%,
            rgba(255,255,255,0.06) 48%,
            rgba(255,255,255,0.12) 50%,
            rgba(255,255,255,0.06) 52%,
            rgba(255,255,255,0.00) 70%
          );
          animation: glossSweep 6s ease-in-out infinite;
        }

        @keyframes glossSweep {
          0%   { background-position-x: -100%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { background-position-x: 200%; opacity: 0; }
        }

        .lockscreen-dvd-container {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          pointer-events: none;
        }

        .lockscreen-dvd-logo {
          position: absolute;
          top: 0;
          left: 0;
          width: 380px;
          filter: drop-shadow(0 0 16px rgba(255,255,255,0.5));
          will-change: transform;
        }

        .lockscreen-hint {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          pointer-events: none;
          animation: hintPulse 2.5s ease-in-out infinite;
        }

        @keyframes hintPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .lockscreen-content {
          opacity: 0;
          transform: translateY(24px);
          pointer-events: none;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .lockscreen-content.is-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .lockscreen-card {
          backdrop-filter: blur(12px);
          // background: rgba(255,255,255,0.97) !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          box-shadow: 0 8px 32px rgba(3,40,107,0.25), 0 1px 0 rgba(255,255,255,0.6) inset !important;
        }
      `}</style>
    </div>
  );
};

export default LockScreen;