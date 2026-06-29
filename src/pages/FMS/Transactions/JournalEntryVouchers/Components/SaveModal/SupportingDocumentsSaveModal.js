import { useEffect } from "react";
import { Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { SaveButton } from "@/components/Common/Buttons";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { DatePickerField } from "@/components/Common/Inputs";

const SupportingDocumentsSaveModal = ({ data, show, onCloseClick }) => {
  const { state, customFunction } = useCustomHook();
  const isUpdate = !!data?.supportingDocumentId;

  useEffect(() => {
    if (isUpdate) {
      customFunction.updateState({
        data: {
          supportingDocumentId: data?.supportingDocumentId,
          codeDescription: data?.codeDescription || "",
          documentNo: data?.documentNo || "",
          date: data?.date || "",
        },
      });
    } else {
      customFunction.updateState({
        data: {
          codeDescription: "",
          documentNo: "",
          date: "",
        },
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    customFunction.updateState({
      data: { ...state.data, [id]: value },
    });
  };

  const handleSave = () => {
    onCloseClick(true, state.data);
  };

  return (
    <Modal modalClassName="flip" id="saveRole" size="lg" isOpen={show} toggle={() => onCloseClick(false)} centered>
      <ModalHeader toggle={() => onCloseClick(false)} className="p-3 bg-success-subtle">
        <div className="text-center w-100 pe-5">{isUpdate ? "Edit Document" : "Add Document Type"}</div>
      </ModalHeader>

      <ModalBody>
        <div className="mb-3">
          <Label for="codeDescription" className="form-label">
            Code and Description
          </Label>
          <Input
            onChange={handleInputChange}
            id="codeDescription"
            type="text"
            className="form-control"
            placeholder="Enter code and description here"
            value={state?.data?.codeDescription || ""}
          />
        </div>

        <div className="mb-3">
          <Label for="documentNo" className="form-label">
            Document No.
          </Label>
          <Input
            onChange={handleInputChange}
            id="documentNo"
            type="text"
            className="form-control"
            placeholder="Enter document no."
            value={state?.data?.documentNo || ""}
          />
        </div>

        <div className="mb-3">
          <Label for="date" className="form-label">
            Date
          </Label>
          <Input onChange={handleInputChange} id="date" type="date" className="form-control form-control-icon custom-input" value={state?.data?.date || ""} />
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="mt-2 d-flex align-content-center justify-content-end">
          <SaveButton onClick={handleSave} /> &nbsp;
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default SupportingDocumentsSaveModal;
