import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveAuthorizationCodesMutation } from "@/api/Endpoints/FMS/StaticData/AuthorizationCodes";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";

const MODULE_NAME = "Authorization Code";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveAuthorizationCode, { isLoading: isSaving }] = useSaveAuthorizationCodesMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.authorizationCodeId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    authorizationCodeId: data?.authorizationCodeId || 0,
    authorizationCodeName: data?.authorizationCodeName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    uacs: data?.uacs || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...buildSelectPairs(["financingSourceId"], data),
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      authorizationCodeName: data?.authorizationCodeName || "",
      uacs: data?.uacs || "",
      ...flattenSelectPairs(["financingSourceId"], data),
    };

    try {
      const response = await saveAuthorizationCode(payload).unwrap();

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
                name="authorizationCodeName"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "AuthorizationCodeName is required." }}
              />
            </Col>

            <Col lg={12}>
              <AsyncSelect
                name="financingSourceId"
                control={control}
                label="Financing Source"
                loadOptions={formatLoadOptions(lookupFinancingSource)}
                rules={{ required: "Financing Source is required." }}
                placeholder="Select financing source..."
                getOptionValue={(opt) => opt.financingSourceId || opt.value}
                getOptionLabel={(opt) => opt.financingSourceName || opt.label}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="uacs"
                control={control}
                label="UACS"
                type="text"
                placeholder="Enter uacs..."
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
