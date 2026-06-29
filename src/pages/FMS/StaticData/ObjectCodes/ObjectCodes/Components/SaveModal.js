import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpAccountClassificationsMutation } from "@/api/Endpoints/FMS/StaticData/AccountClassifications";
import { useSaveObjectCodesMutation } from "@/api/Endpoints/FMS/StaticData/ObjectCodes";

const MODULE_NAME = "Object Code";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveObjectCode, { isLoading: isSaving }] = useSaveObjectCodesMutation();
  const [lookUpAccountClassification] = useLookUpAccountClassificationsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.objectCodeId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    objectCodeId: 0,
    objectCodeName: "",
    accountClassificationId: 0,
    accountClassificationName: "",
    uacs: "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...data,
      ...buildSelectPairs(["accountClassificationId"], data),
    });
  }, [show]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["accountClassificationId"], formData),
    };

    try {
      const response = await saveObjectCode(payload).unwrap();
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
                name="objectCodeName"
                control={control}
                label="Description"
                type="text"
                placeholder="Enter description..."
                disabled={isReadOnly}
                rules={{ required: "Description is required." }}
              />
            </Col>

            <Col lg="12">
              <AsyncSelect
                name="accountClassificationId"
                control={control}
                label="Account Classification"
                loadOptions={formatLoadOptions(lookUpAccountClassification)}
                rules={{ required: "Account classification is required." }}
                getOptionValue={(opt) => opt.accountClassificationId || opt.value}
                getOptionLabel={(opt) => opt.accountClassificationName || opt.label}
                placeholder="Select account classification..."
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="uacs"
                control={control}
                label="UACS"
                type="text"
                placeholder="Enter UACS..."
                disabled={isReadOnly}
                rules={{ required: "UACS is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
