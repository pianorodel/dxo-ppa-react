import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpAccountClassificationsMutation } from "@/api/Endpoints/FMS/StaticData/AccountClassifications";
import { useSaveGeneralLedgersMutation } from "@/api/Endpoints/FMS/StaticData/GeneralLedgers";

const SaveModal = ({ data = null, show, onCloseClick, moduleName, selectedTreeId, listName, accessRights }) => {
  const [saveGeneralLedgers, { isLoading: isSaving }] = useSaveGeneralLedgersMutation();
  const [lookupAccountClassifications] = useLookUpAccountClassificationsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.generalLedgerId;
  const modalName = `${isUpdate ? "Update" : "New"} ${moduleName}`;

  const defaultValues = {
    generalLedgerId: data?.generalLedgerId || 0,
    accountClassificationId: data?.accountClassificationId || selectedTreeId || 0,
    accountClassificationName: data?.accountClassificationName || (selectedTreeId && selectedTreeId != 0 ? listName : "") || "",
    accountCode: data?.accountCode || "",
    accountTitle: data?.accountTitle || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...buildSelectPairs(["accountClassificationId"], data),
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      generalLedgerId: data?.generalLedgerId || 0,
      accountCode: data?.accountCode || "",
      accountTitle: data?.accountTitle || "",
      ...flattenSelectPairs(["accountClassificationId"], data),
    };

    try {
      const response = await saveGeneralLedgers(payload).unwrap();
      assertApiSuccess(response);
      notification({ type: "success", title: moduleName, message: `${moduleName} was successfully ${isUpdate ? "updated" : "added"}.` });
      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: moduleName, message: `Error saving data: ${error.message || "Unknown error"}` });
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
              <AsyncSelect
                isClearable
                name="accountClassificationId"
                control={control}
                label="Account Classification"
                loadOptions={formatLoadOptions(lookupAccountClassifications)}
                placeholder="Select a account classification..."
                getOptionValue={(opt) => opt.accountClassificationId || opt.value}
                getOptionLabel={(opt) => opt.accountClassificationName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="accountCode"
                control={control}
                label="Account Code"
                type="text"
                rules={{
                  required: "Account Code is required",
                }}
                placeholder="Enter account Code..."
                disabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="accountTitle"
                control={control}
                label="Account Title"
                type="text"
                rules={{
                  required: "Account Title is required",
                }}
                placeholder="Enter account Title..."
                disabled={isReadOnly}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
