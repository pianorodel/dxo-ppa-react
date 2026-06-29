import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CloseButton } from "../Buttons";

const DeleteModal = ({ show, onDeleteClick, onCloseClick, title,titleBody = 'Are you sure?' }) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick} className="p-3 bg-danger-subtle">{title}</ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="text-center">

          <lord-icon
            src="https://cdn.lordicon.com/wpyrrmcq.json"
            trigger="loop"
            state="loop-roll"
            colors="primary:#e83a30"
            style={{ width: "60px", height: "60px" }}
          >
          </lord-icon>

          <div className="pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{titleBody}</h4>
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to remove this record ?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <CloseButton onClick={onCloseClick} />
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={onDeleteClick}
          >
            Yes, Delete It!
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default DeleteModal;