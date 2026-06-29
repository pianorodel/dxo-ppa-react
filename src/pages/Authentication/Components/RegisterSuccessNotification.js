import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CloseButton, CloseButtonSuccess } from "@/components/Common/Buttons";

const RegisterSuccessNotification = ({ show, onCloseClick, header, title, message,buttonMessage }) => {

  const handleClick = (e) => {
    onCloseClick(e)
  };

  return (
    <Modal isOpen={show} toggle={() => onCloseClick(false)} centered={true}
      backdrop="static"    // <-- prevents closing when clicking outside
      keyboard={false}     // <-- prevents closing with ESC key
    >
      <ModalHeader toggle={() => onCloseClick(false)} className="p-3 bg-success-subtle">
        {header}
      </ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="text-center">
          <lord-icon
            src="https://cdn.lordicon.com/oqdmuxru.json"
            trigger="loop"
            state="loop-roll"
            colors="primary:#0ab39c,secondary:#0ab39c"
            style={{ width: "60px", height: "60px" }}
          >
          </lord-icon>

          <div className="pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{title}</h4>
            <p className="mb-0">
              {message}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <CloseButtonSuccess label={buttonMessage} onClick={() => handleClick(false)} />
        </div>
      </ModalBody>
    </Modal>
  );
};

RegisterSuccessNotification.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonMessage : PropTypes.string
};

export default RegisterSuccessNotification;
