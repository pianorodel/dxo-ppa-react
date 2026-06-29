import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { CloseButton, ExportButton } from "../Buttons";

const ExportModal = ({ show, onCloseClick, title, isExporting }) => {
  const [selectedFormat, setSelectedFormat] = useState("excel");

  const handleClick = (e) => {
    onCloseClick(e, selectedFormat);
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  return (
    <Modal isOpen={show} toggle={() => onCloseClick(false)} centered={true}>
      <ModalHeader toggle={() => onCloseClick(false)} className="p-3 bg-info-subtle">
        {title}
      </ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="text-center">
          <lord-icon
            src="https://cdn.lordicon.com/wzwygmng.json"
            trigger="loop"
            stroke="bold"
            state="loop-roll"
            colors="primary:#0ab39c,secondary:#0ab39c"
            style={{ width: "60px", height: "60px" }}
          />

          <div className="pt-2 fs-15 mx-sm-5">
            <h4>Export to Excel?</h4>
            <p className="text-muted mb-0">This will download the current list in an excel format.</p>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <CloseButton onClick={() => handleClick(false)} />
          <ExportButton isExporting={isExporting} onClick={() => handleClick(true)} text={`Export as ${selectedFormat.toUpperCase()}`} />
        </div>
      </ModalBody>
    </Modal>
  );
};

ExportModal.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
  title: PropTypes.string,
  isExporting: PropTypes.bool,
};

export default ExportModal;
