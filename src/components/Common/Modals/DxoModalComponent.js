import { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const DxoModalComponent = ({
  title = "",
  isOpen = false,
  onClose = () => {},
  children,
  modalId = "dxo-modal",
  defaultExpanded = true,
  defaultSize = "xl",
  bgColor = "success",
  disabledExpandButton = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <Modal
      fullscreen={isExpanded}
      modalClassName="flip"
      id={modalId}
      size={isExpanded ? undefined : defaultSize}
      isOpen={isOpen}
      toggle={onClose}
      centered
      backdrop="static">
      <ModalHeader
        toggle={onClose}
        className={`p-3 bg-${bgColor}-subtle d-flex align-items-center justify-content-between position-relative`}
        close={
          <div className="d-flex align-items-center gap-2">
            {!disabledExpandButton && (
              <button type="button" className="btn btn-sm" onClick={toggleExpand} title={isExpanded ? "Collapse" : "Expand"}>
                {isExpanded ? (
                  <i className="ri-fullscreen-exit-line text-bold" style={{ fontSize: "14px" }}></i>
                ) : (
                  <i className="ri-fullscreen-line text-bold" style={{ fontSize: "14px" }}></i>
                )}
              </button>
            )}
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
        }>
        {title}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};

export default DxoModalComponent;
