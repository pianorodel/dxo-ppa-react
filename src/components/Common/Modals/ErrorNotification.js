import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { CloseButton } from "../Buttons";

const ErrorNotification = ({ show, onCloseClick, header, title, message, customCloseButton }) => {
  const handleClick = (e) => {
    onCloseClick(e);
  };

  return (
    <Modal
      isOpen={show}
      toggle={() => onCloseClick(false)}
      centered={true}
      backdrop="static" // <-- prevents closing when clicking outside
      keyboard={false} // <-- prevents closing with ESC key
    >
      <ModalHeader toggle={() => onCloseClick(false)} className="p-3 bg-danger-subtle">
        {header}
      </ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="text-center">
          <lord-icon
            src="https://cdn.lordicon.com/rmkahxvq.json"
            trigger="loop"
            state="loop-roll"
            colors="primary:#ef4444,secondary:#ef4444"
            style={{ width: "60px", height: "60px" }}
          />

          <div className="pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{title}</h4>
            <p className="text-muted mb-0">{message}</p>
          </div>
        </div>
        {customCloseButton ? (
          customCloseButton
        ) : (
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <CloseButton onClick={() => handleClick(false)} />
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

ErrorNotification.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ErrorNotification;
