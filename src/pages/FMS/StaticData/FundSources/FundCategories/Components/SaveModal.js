import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveFundCategoriesMutation } from "@/api/Endpoints/FMS/StaticData/FundCategories";

const MODULE_NAME = "Fund Category";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveFundCategory, { isLoading: isSaving }] = useSaveFundCategoriesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.fundCategoryId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    fundCategoryId: data?.fundCategoryId || 0,
    fundCategoryName: data?.fundCategoryName || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      fundCategoryName: data?.fundCategoryName || "",
    };

    try {
      const response = await saveFundCategory(payload).unwrap();

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
                name="fundCategoryName"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "FundCategoryName is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
