import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField, NumericInputField } from "@/components/Common/Inputs";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";
import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveGAAsMutation } from "@/api/Endpoints/FMS/Budget/GAAs";

const MODULE_NAME = "GAA";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveGAA, { isLoading: isSaving }] = useSaveGAAsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.gaaId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    gaaId: data?.gaaId || 0,
    year: data?.year || null,
    legalBasis: data?.legalBasis || "",
    type: data?.type || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      type: data?.type ? { value: data?.type, label: data?.type } : null,
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      year: data?.year || "",
      legalBasis: data?.legalBasis || "",
      type: data?.type.value || "",
    };

    try {
      const response = await saveGAA(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <DxoModalComponent title={modalName} isOpen={show} onClose={onCloseClick} defaultExpanded={false} defaultSize="md">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <NumericInputField
                name="year"
                control={control}
                label="Year"
                placeholder="Enter year..."
                maxLength={4}
                disabled={isReadOnly}
                rules={{ required: "Year is required." }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                max={new Date().getFullYear()}
              />
            </Col>
            <Col lg={12}>
              <NormalSelect
                options={[
                  { value: "Current ", label: "Current " },
                  { value: "Ongoing", label: "Ongoing" },
                ]}
                control={control}
                name="type"
                label="Type"
                placeholder="Select type..."
                rules={{ required: "Type is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="legalBasis"
                control={control}
                label="Legal Basis"
                type="textarea"
                rows={2}
                placeholder="Enter legal basis..."
                disabled={isReadOnly}
                rules={{ required: "Legal basis is required." }}
              />
            </Col>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <CloseButton onClick={onCloseClick} />
                {hasWriteAccess(accessRights) && <SaveButton isSaving={isSaving} />}
              </div>
            </Col>
          </Row>
        </Form>
      </DxoModalComponent>
    </React.Fragment>
  );
};

export default SaveModal;
