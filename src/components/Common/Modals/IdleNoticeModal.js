import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";

const IdleNoticeModal = ({ show, onCloseClick, onStayActive, warningTime = 120, totalIdleTime = 1800 }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(warningTime);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!show) {
      setCountdown(warningTime);
      setIsExpired(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout(); // Handle timeout when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, warningTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatIdleTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) {
      return "1 minute";
    }
    return `${minutes} minutes`;
  };

  const handleTimeout = () => {
    onCloseClick();
    navigate("/lockscreen");

    // // Clear session storage
    // sessionStorage.clear();

    // // Clear local storage tokens
    // localStorage.removeItem("token");
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("authUser");

    // // Clear cookies
    // document.cookie.split(";").forEach((c) => {
    //   document.cookie = c
    //     .replace(/^ +/, "")
    //     .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    // });

    // // Change modal state to show expired message
    // setIsExpired(true);
  };

  const logOut = () => {
    navigate("/logout");
    onCloseClick();
  };

  const handleStayActive = () => {
    if (onStayActive) {
      onStayActive();
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
    onCloseClick();
  };

  // Calculate elapsed idle time (total - remaining)
  const elapsedIdleTime = totalIdleTime - warningTime;

  return (
    <React.Fragment>
      <DxoModalComponent
        bgColor={isExpired ? 'danger' : 'danger'}
        onClose={isExpired ? handleBackToLogin : logOut}
        title={""}
        isOpen={show}
        defaultExpanded={false}
        defaultSize="lg"
      >
        <div className="text-center py-4 px-4 position-relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
            <div className="position-absolute rounded-circle bg-warning"
              style={{
                width: '200px',
                height: '200px',
                top: '-100px',
                left: '-100px',
                animation: 'pulse 3s ease-in-out infinite'
              }}></div>
            <div className="position-absolute rounded-circle bg-danger"
              style={{
                width: '150px',
                height: '150px',
                bottom: '-75px',
                right: '-75px',
                animation: 'pulse 3s ease-in-out infinite 1.5s'
              }}></div>
          </div>

          {/* Content */}
          <div className="position-relative">
            {/* Animated Icon */}
            <div className="mb-4" style={{ animation: 'bounceIn 0.6s ease-out' }}>
              <div className="avatar-lg mx-auto position-relative">
                <div className={`avatar-title ${isExpired ? 'bg-danger text-white' : 'bg-danger-subtle text-danger'} rounded-circle shadow-lg position-relative`}
                  style={{ animation: isExpired ? 'none' : 'iconPulse 2s ease-in-out infinite' }}>
                  <i className={isExpired ? "ri-lock-line" : "ri-alert-line"} style={{ fontSize: "48px" }}></i>

                  {/* Ripple Effect - only show when not expired */}
                  {!isExpired && (
                    <>
                      <span className="position-absolute top-50 start-50 translate-middle rounded-circle border border-danger"
                        style={{
                          width: '100%',
                          height: '100%',
                          animation: 'ripple 2s ease-out infinite'
                        }}></span>
                      <span className="position-absolute top-50 start-50 translate-middle rounded-circle border border-danger"
                        style={{
                          width: '100%',
                          height: '100%',
                          animation: 'ripple 2s ease-out infinite 1s'
                        }}></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isExpired ? (
              // Expired State
              <>
                <h4 className="mb-3 fw-semibold text-danger"
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
                  Session Expired
                </h4>

                <p className="mb-4 px-3 text-muted"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.3s backwards',
                    lineHeight: '1.6'
                  }}>
                  Your session has expired due to inactivity. For your security, you have been logged out.
                  <br />
                  Please log in again to continue.
                </p>

                {/* Action Button */}
                <div className="d-flex gap-3 justify-content-center flex-wrap"
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.4s backwards' }}>
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 shadow-sm position-relative overflow-hidden btn-hover-effect"
                    onClick={handleBackToLogin}
                    style={{
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}>
                    <i className="ri-login-box-line me-2"></i>
                    Back to Login
                    {/* Button shine effect */}
                    <span className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shine 3s ease-in-out infinite'
                      }}></span>
                  </button>
                </div>
              </>
            ) : (
              // Active Warning State
              <>
                <h4 className="mb-3 fw-semibold text-danger"
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
                  You have been idle for {formatIdleTime(elapsedIdleTime)}.
                </h4>

                <p className="mb-2 px-3 text-muted"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.3s backwards',
                    lineHeight: '1.6'
                  }}>
                  You will be logged out in
                </p>

                {/* Countdown Timer */}
                <h1 className="mb-4 fw-bold"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out 0.4s backwards',
                    fontSize: '3.5rem',
                    color: countdown <= 10 ? '#dc3545' : '#198754',
                    transition: 'color 0.3s ease'
                  }}>
                  {formatTime(countdown)}
                </h1>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap"
                  style={{ animation: 'fadeInUp 0.6s ease-out 0.5s backwards' }}>
                  <button
                    type="button"
                    className="btn btn-success px-4 py-2 shadow-sm position-relative overflow-hidden btn-hover-effect"
                    onClick={handleStayActive}
                    style={{
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}>
                    <i className="ri-check-line me-2"></i>
                    I'm Still Here
                    {/* Button shine effect */}
                    <span className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shine 3s ease-in-out infinite'
                      }}></span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger px-4 py-2 shadow-sm position-relative overflow-hidden btn-hover-effect"
                    onClick={logOut}
                    style={{
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}>
                    <i className="ri-logout-box-line me-2"></i>
                    Logout Now
                    {/* Button shine effect */}
                    <span className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shine 3s ease-in-out infinite'
                      }}></span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes bounceIn {
              0% {
                opacity: 0;
                transform: scale(0.3);
              }
              50% {
                transform: scale(1.05);
              }
              70% {
                transform: scale(0.9);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes iconPulse {
              0%, 100% {
                box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4);
              }
              50% {
                box-shadow: 0 0 20px 10px rgba(220, 53, 69, 0);
              }
            }

            @keyframes ripple {
              0% {
                width: 100%;
                height: 100%;
                opacity: 0.6;
              }
              100% {
                width: 160%;
                height: 160%;
                opacity: 0;
              }
            }

            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.15;
              }
            }

            @keyframes shine {
              0% {
                transform: translateX(-100%);
              }
              50%, 100% {
                transform: translateX(100%);
              }
            }

            .btn-hover-effect:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            }

            .btn-success.btn-hover-effect:hover {
              box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4) !important;
            }

            .btn-danger.btn-hover-effect:hover {
              box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4) !important;
            }

            .btn-primary.btn-hover-effect:hover {
              box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4) !important;
            }
          `}</style>
        </div>
      </DxoModalComponent>
    </React.Fragment>
  );
};

IdleNoticeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onStayActive: PropTypes.func,
  warningTime: PropTypes.number,
  totalIdleTime: PropTypes.number,
};

IdleNoticeModal.defaultProps = {
  onStayActive: null,
  warningTime: 120, // 2 minutes in seconds
  totalIdleTime: 1800, // 30 minutes in seconds
};

export default IdleNoticeModal;