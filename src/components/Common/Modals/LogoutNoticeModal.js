import React from "react";
import { useNavigate } from "react-router-dom";

import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";

const LogoutNoticeModal = ({ show, onCloseClick }) => {
  let navigate = useNavigate();

  // useEffect(() => {
  //   if (show) {
  //     sessionStorage.clear();
  //   }
  // }, [show]);

  const logOut = () => {
    navigate("/logout");
    onCloseClick();
  };

  return (
    <React.Fragment>
      <DxoModalComponent bgColor='danger' onClose={logOut} title={""} isOpen={show} defaultExpanded={false} defaultSize="lg">
        <div className="text-center py-5 px-4 position-relative overflow-hidden "  >
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
                <div className="avatar-title bg-danger-subtle text-danger rounded-circle shadow-lg position-relative"
                  style={{ animation: 'iconPulse 2s ease-in-out infinite' }}>
                  <i className="ri-alert-line" style={{ fontSize: "48px" }}></i>

                  {/* Ripple Effect */}
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
                </div>
              </div>
            </div>

            {/* Title with fade-in effect */}
            <h4 className="mb-3 fw-semibold text-success"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
              Your Account is Active on Another Device
            </h4>

            {/* Description */}
            <p className="mb-4 px-3"
              style={{
                animation: 'fadeInUp 0.6s ease-out 0.3s backwards',
                lineHeight: '1.6'
              }}>
              Your account has been used to login from another device. For security compliance, this session will be terminated immediately.
            </p>

            {/* Enhanced Security Alert */}
            <div className="alert alert-warning border-0 mb-4 mx-auto shadow-sm"
              style={{
                maxWidth: "500px",
                animation: 'fadeInUp 0.6s ease-out 0.4s backwards',
                background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                borderLeft: '4px solid #ffc107'
              }}>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="ri-shield-check-line text-danger"
                    style={{
                      fontSize: "24px",
                      animation: 'iconBounce 1s ease-in-out infinite'
                    }}></i>
                </div>
                <div className="flex-grow-1 ms-3 text-start">
                  <strong className="d-block mb-1 text-danger-emphasis">Security Tip</strong>
                  <small className="text-black">
                    If this wasn't you, please log in and change your password immediately.
                  </small>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="d-flex gap-3 justify-content-center flex-wrap"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.5s backwards' }}>
              <button
                type="button"
                className="btn btn-danger px-4 py-2 shadow-sm position-relative overflow-hidden btn-hover-effect"
                onClick={logOut}
                style={{
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}>
                <i className="ri-logout-box-line me-2"></i>
                Back to Login

                {/* Button shine effect */}
                <span className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shine 3s ease-in-out infinite'
                  }}></span>
              </button>
            </div>


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
                box-shadow: 0 0 0 0 rgba(255, 218, 7, 0.4);
              }
              50% {
                box-shadow: 0 0 20px 10px rgba(255, 7, 7, 0);
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

            @keyframes iconBounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-3px);
              }
            }

            .btn-hover-effect:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
            }

            .link-hover:hover {
              color: #6c757d !important;
            }
          `}</style>
        </div>
      </DxoModalComponent>
    </React.Fragment>
  );
};

export default LogoutNoticeModal;