import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpGeneralLedgersMutation } from "@/api/Endpoints/FMS/StaticData/GeneralLedgers";
import { useSaveSubsidiaryLedgersMutation } from "@/api/Endpoints/FMS/StaticData/SubsidiaryLedgers";

const MODULE_NAME = "Subsidiary Ledger";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveSubsidiaryLedger, { isLoading: isSaving }] = useSaveSubsidiaryLedgersMutation();
  const [lookupGeneralLedger] = useLookUpGeneralLedgersMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.subsidiaryLedgerId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    subsidiaryLedgerId: data?.subsidiaryLedgerId || 0,
    accountCode: data?.accountCode || "",
    accountTitle: data?.accountTitle || "",
    generalLedgerId: data?.generalLedgerId || 0,
    generalLedgerAccountCode: data?.generalLedgerAccountCode || "",
    generalLedgerAccountTitle: data?.generalLedgerAccountTitle || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      generalLedgerId: data?.generalLedgerId
        ? {
          value: data?.generalLedgerId,
          label: data?.generalLedgerAccountTitle,
          accountCode: data?.generalLedgerAccountCode,
        }
        : null,
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      accountCode: data?.accountCode || "",
      accountTitle: data?.accountTitle || "",
      generalLedgerId: data?.generalLedgerId?.value,
      generalLedgerAccountTitle: data?.generalLedgerId?.label,
      generalLedgerAccountCode: data?.generalLedgerId?.accountCode,

    };

    try {
      const response = await saveSubsidiaryLedger(payload).unwrap();
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
                name="accountCode"
                control={control}
                label="Account Code"
                type="text"
                placeholder="Enter account code..."
                disabled={isReadOnly}
                rules={{ required: "Account code  is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="accountTitle"
                control={control}
                label="Account Title"
                type="text"
                placeholder="Enter account title..."
                disabled={isReadOnly}
                rules={{ required: "Account title is required." }}
              />
            </Col>
            <Col lg={12}>
              <AsyncSelect
                name="generalLedgerId"
                control={control}
                label="General Ledger"
                loadOptions={formatLoadOptions(lookupGeneralLedger)}
                rules={{ required: "General Ledger is required" }}
                placeholder="Select a general ledger"
                getOptionValue={(opt) => opt.generalLedgerId || opt.value}
                getOptionLabel={(opt) => opt.accountTitle || opt.label}
                formatOptionLabel={(opt) => `${opt.accountCode} - ${opt.accountTitle || opt.label}`}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
