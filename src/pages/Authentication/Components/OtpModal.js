import React from 'react';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const OtpModal = ({
  isOpen,
  toggle,
  otpValue,
  setOtpValue,
  onSubmit
}) => {
  const isOtpComplete = otpValue.length === 6;

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        style={{
          animation: 'zoomIn 0.3s ease-out'
        }}
      >
        <ModalHeader
          toggle={toggle}
          className="modal-title"
          style={{
            borderBottom: 'none',
            paddingBottom: '0'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="avatar-sm flex-shrink-0"
              style={{
                width: '40px',
                height: '40px'
              }}
            >
              <span
                className="avatar-title rounded-circle"
                style={{
                  backgroundColor: 'rgba(10, 179, 156, 0.1)',
                  color: '#0ab39c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <i className="ri-lock-password-line" style={{ fontSize: '20px' }}></i>
              </span>
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-1" style={{ fontSize: '16px', fontWeight: '600' }}>Verify OTP</h5>
              <p
                className="text-muted mb-0"
                style={{
                  fontSize: '13px',
                  color: '#878a99'
                }}
              >
                Enter the verification code sent to your device
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody
          className="p-4"
          style={{
            padding: '1.5rem'
          }}
        >
          <div className="mb-3">
            <Label
              className="form-label"
              style={{
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}
            >
              One-Time Password
            </Label>
            <Input
              type="text"
              placeholder="- - - - - -"
              value={otpValue}
              onChange={(e) => {
                setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
              }}
              className="form-control form-control-lg text-center"
              maxLength={6}
              style={{
                letterSpacing: '0.8em',
                fontSize: '1.5rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 0 0.15rem rgba(10, 179, 156, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div
            className="text-center"
            style={{
              marginTop: '1.5rem'
            }}
          >
            <p
              className="text-muted mb-0"
              style={{
                fontSize: '14px',
                color: '#878a99'
              }}
            >
              Didn't receive the code?
              <a
                href="#!"
                style={{
                  fontWeight: '600',
                  textDecoration: 'underline',
                  color: '#0ab39c',
                  marginLeft: '0.25rem'
                }}
              >
                Resend OTP
              </a>
            </p>
          </div>
        </ModalBody>

        <ModalFooter
          style={{
            backgroundColor: '#f3f6f9',
            borderTop: 'none',
            padding: '1rem 1.5rem'
          }}
        >
          <Button
            color="light"
            onClick={toggle}
            style={{
              transition: 'all 0.3s ease',
              border: '1px solid #e9ebec'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="ri-close-line" style={{ marginRight: '0.25rem', verticalAlign: 'middle' }}></i>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={onSubmit}
            disabled={!isOtpComplete}
            className="btn btn-success"
            style={{
              transition: 'all 0.3s ease',
              opacity: !isOtpComplete ? 0.6 : 1,
              cursor: !isOtpComplete ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (isOtpComplete) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(10, 179, 156, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (isOtpComplete) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <i className="ri-check-line" style={{ marginRight: '0.25rem', verticalAlign: 'middle' }}></i>
            Verify & Continue
          </Button>
        </ModalFooter>
      </Modal>

      <style>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default OtpModal;