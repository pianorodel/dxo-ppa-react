import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpBankBranchesMutation } from "@/api/Endpoints/FMS/StaticData/BankBranches";
import { useLookUpBanksMutation } from "@/api/Endpoints/FMS/StaticData/Banks";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import {
  useCancelDepositsMutation,
  useFilesDeleteDepositsMutation,
  useFilesUploadDepositsMutation,
  useFindDepositsQuery,
  useSaveDepositsMutation,
  useSubmitDepositsMutation,
} from "@/api/Endpoints/FMS/Transactions/Deposit/Deposits";

const MODULE_NAME = "Deposit";

const DEPOSIT_MODES = [
  { value: "BTr Regular – Land Bank of the Philippines", label: "BTr Regular – Land Bank of the Philippines" },
  { value: "BTr Special Account – LBP", label: "BTr Special Account – LBP" },
  { value: "BTr Trust Fund – LBP", label: "BTr Trust Fund – LBP" },
  { value: "AGDB – Development Bank of the Philippines", label: "AGDB – Development Bank of the Philippines" },
  { value: "AGDB – Bureau of Treasury Regional Office", label: "AGDB – Bureau of Treasury Regional Office" },
  { value: "Intra-Government Transfer", label: "Intra-Government Transfer" },
];

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveDepositsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitDepositsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelDepositsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const [lookupBank] = useLookUpBanksMutation();
  const [lookupBankBranch] = useLookUpBankBranchesMutation();

  const { data: transactionData, refetch } = useFindDepositsQuery(
    { depositId: data?.depositId },
    { skip: !data?.depositId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadDepositsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteDepositsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_DEPOSITS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    depositId: data?.depositId || 0,
    referenceNo: data?.referenceNo || "",
    depositSlipNo: data?.depositSlipNo || "",
    depositDate: data?.depositDate || null,
    depositMode: data?.depositMode || "",
    bankId: data?.bankId || 0,
    bankName: data?.bankName || "",
    bankBranchId: data?.bankBranchId || 0,
    bankBranchName: data?.bankBranchName || "",
    agencyDepositAccountNo: data?.agencyDepositAccountNo || "",
    validationReferenceNo: data?.validationReferenceNo || "",
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    cashDeposited: data?.cashDeposited || 0,
    checksDeposited: data?.checksDeposited || 0,
    totalDepositAmount: data?.totalDepositAmount || 0,
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, setValue, reset, control, watch } = useForm({ ...defaultValues });

  const cashDeposited = watch("cashDeposited");
  const checksDeposited = watch("checksDeposited");

  useEffect(() => {
    const cash = parseFloat(cashDeposited) || 0;
    const check = parseFloat(checksDeposited) || 0;
    setValue("totalDepositAmount", (cash + check).toFixed(2));
  }, [cashDeposited, checksDeposited, setValue]);

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      ...buildSelectPairs(["bankId"], findData),
      depositMode: data?.depositMode ? { value: data.depositMode, label: data.depositMode } : null,
      bankBranchId: findData?.bankBranchId ? { value: findData.bankBranchId, label: findData.bankBranchName } : null,
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,
      financingSourceId: findData?.financingSourceId ? { value: findData.financingSourceId, label: findData.financingSourceName, displayName: findData.financingSourceName } : null,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["bankId"], formData),
      depositMode: formData?.depositMode?.value,
      bankBranchId: formData?.bankBranchId?.value,
      bankBranchName: formData?.bankBranchId?.label,
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
      financingSourceId: formData?.financingSourceId?.value,
      financingSourceName: formData?.financingSourceId?.displayName,
      files: fileObj || [],
    };

    try {
      const response = actionType.current === "save"
        ? await save(payload).unwrap()
        : actionType.current === "cancel"
          ? await cancel(payload).unwrap()
          : await submit(payload).unwrap();

      assertApiSuccess(response);

      notification({
        type: "success",
        title: response.returnData.referenceNo,
        header: `${actionType.current === "save" ? "Save" : actionType.current === "cancel" ? "Cancel" : "Submit"} ${MODULE_NAME}`,
        message: `${MODULE_NAME} was successfully ${actionType.current === "save" ? "saved" : actionType.current === "cancel" ? "cancelled" : "submitted"}.`,
      });

      setTimeout(() => {
        hideModal();
        onCloseClick();
      }, 2000);
    } catch (error) {
      notification({
        type: "error",
        title: MODULE_NAME,
        message: `${error?.message || "Unknown error"}`,
      });
    }
  };

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        title={data?.depositId ? "Update Deposit" : "New Deposit"}
        isOpen={show}
        width="980px"
        modifiedDate={data?.modifiedDate}

        isSaving={isSaving}
        canSave={data?.actions?.save || true}
        onSave={() => {
          actionType.current = "save";
          handleSubmit(onSubmit)();
        }}

        isSubmitting={isSubmitting}
        canSubmit={data?.actions?.submit || true}
        onSubmit={() => {
          actionType.current = "submit";
          handleSubmit(onSubmit)();
        }}

        isCancelling={isCancelling}
        canCancel={data?.actions?.cancel || false}
        onCancel={() => {
          actionType.current = "cancel";
          handleSubmit(onSubmit)();
        }}

        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Section title="Deposit Details">
            <Row>
              <Col lg={6}>
                <InputField
                  name="depositSlipNo"
                  control={control}
                  label="Deposit Slip No."
                  placeholder="e.g. DS-2025-07-000001"
                  rules={{ required: "Deposit Slip No. is required." }}
                />
              </Col>
              <Col lg={6}>
                <DatePickerField
                  name="depositDate"
                  control={control}
                  label="Date of Deposit"
                  rules={{ required: "Date of Deposit is required." }}
                />
              </Col>
              <Col lg={6}>
                <NormalSelect
                  name="depositMode"
                  control={control}
                  label="Deposit Mode / Bank Account Type"
                  placeholder="Select deposit mode..."
                  options={DEPOSIT_MODES}
                  rules={{ required: "Deposit Mode is required." }}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  isClearable
                  name="bankId"
                  control={control}
                  label="Bank"
                  loadOptions={formatLoadOptions(lookupBank)}
                  rules={{ required: "Bank is required." }}
                  placeholder="Select Bank..."
                  getOptionValue={(opt) => opt.bankId || opt.value}
                  getOptionLabel={(opt) => opt.bankName || opt.label}
                  isDisabled={isViewerOnly}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  isClearable
                  name="bankBranchId"
                  control={control}
                  label="Bank Branch"
                  loadOptions={formatLoadOptions(lookupBankBranch)}
                  rules={{ required: "Bank branch is required." }}
                  placeholder="Select bank branch..."
                  getOptionValue={(opt) => opt.branchId || opt.value}
                  getOptionLabel={(opt) => opt.branchName || opt.label}
                  isDisabled={isViewerOnly}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  name="agencyDepositAccountNo"
                  control={control}
                  label="Agency Deposit Account No."
                  placeholder="e.g. 1234-5678-90 (MDS / LCCA)"
                  rules={{ required: "Agency Deposit Account No. is required." }}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  name="validationReferenceNo"
                  control={control}
                  label="Bank Teller / Validation Reference"
                  placeholder="Bank teller stamp / validation no."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Funding Classification (UACS)">
            <Row>
              <Col lg={6}>
                <AsyncSelect
                  name="fundClusterId"
                  control={control}
                  label="Fund Cluster"
                  placeholder="Select fund cluster..."
                  loadOptions={formatLoadOptions(lookupFundCluster)}
                  getOptionValue={(opt) => opt.fundClusterId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                  rules={{ required: "Fund Cluster is required." }}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  name="financingSourceId"
                  control={control}
                  label="Financing Source"
                  placeholder="Select financing source..."
                  loadOptions={formatLoadOptions(lookupFinancingSource)}
                  getOptionValue={(opt) => opt.financingSourceId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Amount">
            <Row>
              <Col lg={4}>
                <CurrencyInputField
                  name="cashDeposited"
                  control={control}
                  label="Cash Deposited"
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  name="checksDeposited"
                  control={control}
                  label="Checks Deposited"
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  disabled
                  name="totalDepositAmount"
                  control={control}
                  label="Total Deposit Amount"
                  placeholder="0.00"
                  rules={{
                    required: "Total Deposit Amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Total Deposit Amount must be greater than zero.",
                  }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Remarks">
            <Row>
              <Col lg={12}>
                <InputField
                  name="remarks"
                  control={control}
                  type="textarea"
                  rows={3}
                  maxLength={500}
                  showCharCounter
                  placeholder="Enter remarks..."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.depositId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ depositId: data?.depositId || 0 }}
                      uploadService={uploadFiles}
                      isUploading={isUploading}
                      deleteService={deleteFiles}
                      isDeleting={isDeleting}
                      onUploadSuccess={() => {
                        toast("File was successfully uploaded.", {
                          position: "top-right",
                          hideProgressBar: false,
                          closeOnClick: true,
                          className: `bg-success text-white`,
                        });
                        refetchParentList();
                      }}
                      onDeleteSuccess={() => {
                        toast("File was successfully deleted.", {
                          position: "top-right",
                          hideProgressBar: false,
                          closeOnClick: true,
                          className: `bg-danger text-white`,
                        });
                        refetchParentList();
                      }}
                      onUploadError={(err) => console.log(err)}
                      onDeleteError={(err) => console.log(err)}
                    />
                  ) : (
                    <FileUpload onFilesChange={setFiles} />
                  )}
                </div>
              </Col>
            </Row>
          </Section>

        </Form>
      </ModernModal>
    </React.Fragment >
  );
};

export default SaveModal;
