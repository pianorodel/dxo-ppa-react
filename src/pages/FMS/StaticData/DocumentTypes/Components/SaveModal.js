import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveDocumentTypesMutation } from "@/api/Endpoints/Master/StaticData/DocumentTypes";

const MODULE_NAME = "Document Type";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveDocumentType, { isLoading: isSaving }] = useSaveDocumentTypesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.documentTypeId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    documentTypeId: data?.documentTypeId || 0,
    documentTypeCode: data?.documentTypeCode || "",
    documentTypeName: data?.documentTypeName || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      documentTypeCode: data?.documentTypeCode || "",
      documentTypeName: data?.documentTypeName || "",
    };

    try {
      const response = await saveDocumentType(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <ModernModal
        title={modalName}
        isOpen={show}
        width="680px"
        modifiedDate={data?.modifiedDate}
        isSaving={isSaving}
        canSave={hasWriteAccess(accessRights)}
        onSave={handleSubmit(onSubmit)}
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <InputField
                name="documentTypeCode"
                control={control}
                label="Code"
                type="text"
                placeholder="Enter code..."
                disabled={isReadOnly}
                rules={{ required: "Document type code  is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="documentTypeName"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "Document type name is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
