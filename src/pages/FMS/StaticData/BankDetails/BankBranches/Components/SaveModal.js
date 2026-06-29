import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, EmailInputField, InputField, MobileInputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveBankBranchesMutation } from "@/api/Endpoints/FMS/StaticData/BankBranches";
import { useLookUpBanksMutation } from "@/api/Endpoints/FMS/StaticData/Banks";

const MODULE_NAME = "Bank Branch";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveBankBranch, { isLoading: isSaving }] = useSaveBankBranchesMutation();
  const [lookupBanks] = useLookUpBanksMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.branchId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    branchId: data?.branchId || 0,
    branchName: data?.branchName || "",
    branchCode: data?.branchCode || "",
    bankId: data?.bankId || 0,
    bankName: data?.bankName || "",
    contactNo: data?.contactNo || "",
    emailAddress: data?.emailAddress || "",
    address: data?.address || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...buildSelectPairs(["bankId"], data),
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      branchName: data?.branchName || "",
      branchCode: data?.branchCode || "",
      contactNo: data?.contactNo || "",
      emailAddress: data?.emailAddress || "",
      address: data?.address || "",
      ...flattenSelectPairs(["bankId"], data),
    };

    try {
      const response = await saveBankBranch(payload).unwrap();

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
                name="branchName"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "Branch name is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="branchCode"
                control={control}
                label="Branch Code"
                type="text"
                placeholder="Enter branch code..."
                disabled={isReadOnly}
                rules={{ required: "Branch code is required." }}
              />
            </Col>
            <Col lg={12}>
              <AsyncSelect
                isDisabled={isReadOnly}
                name="bankId"
                control={control}
                label="Bank"
                loadOptions={formatLoadOptions(lookupBanks)}
                rules={{ required: "Bank is required." }}
                placeholder="Select a bank"
                getOptionValue={(opt) => opt.vehicleTypeId || opt.value}
                getOptionLabel={(opt) => opt.vehicleTypeName || opt.label}
              />
            </Col>
            <Col lg={12}>
              <MobileInputField
                name="contactNo"
                control={control}
                label="Contact No"
                type="text"
                placeholder="Enter contact no..."
                disabled={isReadOnly}
                rules={{ required: "Contact No is required." }}
              />
            </Col>
            <Col lg={12}>
              <EmailInputField
                name="emailAddress"
                control={control}
                label="Email Address"
                type="email"
                rules={{ required: "email address is required." }}
                placeholder="Enter email address..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="address"
                control={control}
                label="Address"
                type="text"
                placeholder="Enter address..."
                disabled={isReadOnly}
                rules={{ required: "Address is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
