import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveAllotmentSourceDocumentTypesMutation } from "@/api/Endpoints/FMS/StaticData/AllotmentSourceDocumentTypes";

const MODULE_NAME = "Allotment Source Document Type";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveAllotmentSourceDocumentType, { isLoading: isSaving }] = useSaveAllotmentSourceDocumentTypesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.allotmentSourceDocumentTypeId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    allotmentSourceDocumentTypeId: data?.allotmentSourceDocumentTypeId || 0,
    code: data?.code || "",
    name: data?.name || "",
    description: data?.description || "",
    category: data?.category || "",
    isForCurrentYear: data?.isForCurrentYear || false,
    requiresDBMApproval: data?.name || false,
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      code: data?.code || "",
      name: data?.name || "",
      description: data?.description || "",
      category: data?.category || "",
      isForCurrentYear: data?.isForCurrentYear || false,
      requiresDBMApproval: data?.name || false,
    };

    try {
      const response = await saveAllotmentSourceDocumentType(payload).unwrap();

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
                name="code"
                control={control}
                label="Code"
                type="text"
                placeholder="Enter code..."
                disabled={isReadOnly}
                rules={{ required: "Code is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="name"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "Name is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="category"
                control={control}
                label="Category"
                type="text"
                placeholder="Enter category..."
                disabled={isReadOnly}
                rules={{ required: "Category is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="description"
                control={control}
                label="Description"
                type="textarea"
                placeholder="Enter description..."
                disabled={isReadOnly}
                rules={{ required: "Description is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
