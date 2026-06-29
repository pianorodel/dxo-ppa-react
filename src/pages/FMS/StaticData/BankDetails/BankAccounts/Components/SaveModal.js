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

import { useSaveBankAccountsMutation } from "@/api/Endpoints/FMS/StaticData/BankAccounts";
import { useLookUpBankBranchesMutation } from "@/api/Endpoints/FMS/StaticData/BankBranches";
import { useLookUpBanksMutation } from "@/api/Endpoints/FMS/StaticData/Banks";

const MODULE_NAME = "Bank Account";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveBankAccount, { isLoading: isSaving }] = useSaveBankAccountsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.bankAccountId;
  const [bankBranchesLookup] = useLookUpBankBranchesMutation();
  const [bankLookup] = useLookUpBanksMutation();
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    bankAccountId: data?.bankAccountId || 0,
    bankAccountName: data?.bankAccountName || "",
    bankAccountNo: data?.bankAccountNo || "",
    ...buildSelectPairs(["bankId", "branchId"], data),
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (formData) => {
    const payload = {
      ...defaultValues,
      bankAccountName: formData?.bankAccountName || "",
      bankAccountNo: formData?.bankAccountNo || "",
      ...flattenSelectPairs(["bankId", "branchId"], formData),
    };

    try {
      const response = await saveBankAccount(payload).unwrap();

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
            <Col lg={6}>
              <InputField
                name="bankAccountName"
                control={control}
                label="Bank Account Name"
                type="text"
                placeholder="Enter bank account name..."
                disabled={isReadOnly}
                rules={{ required: "Bank account name is required." }}
              />
            </Col>
            <Col lg={6}>
              <InputField
                name="bankAccountNo"
                control={control}
                label="Bank Account No."
                type="text"
                placeholder="Enter bank account no..."
                disabled={isReadOnly}
                rules={{ required: "Bank account no. is required." }}
              />
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <AsyncSelect
                  name="bankId"
                  control={control}
                  label="Bank Name"
                  loadOptions={formatLoadOptions(bankLookup)}
                  rules={{ required: "Bank name is required." }}
                  placeholder="Select a bank"
                  getOptionValue={(opt) => opt.bankId || opt.value}
                  getOptionLabel={(opt) => opt.bankName || opt.label}
                  isDisabled={isReadOnly}
                />
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <AsyncSelect
                  name="branchId"
                  control={control}
                  label="Bank Branch"
                  loadOptions={formatLoadOptions(bankBranchesLookup)}
                  rules={{ required: "Bank branch is required." }}
                  placeholder="Select a bank branch"
                  getOptionValue={(opt) => opt.branchId || opt.value}
                  getOptionLabel={(opt) => opt.branchName || opt.label}
                  isDisabled={isReadOnly}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
