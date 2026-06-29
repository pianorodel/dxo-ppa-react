import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField, MobileInputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { formatAmount } from "@/helpers/decimal_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpClientsMutation } from "@/api/Endpoints/FMS/StaticData/Clients";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import { useLookUpPaymentModesMutation } from "@/api/Endpoints/FMS/StaticData/PaymentModes";
import { useLookUpPrepaidTypesMutation } from "@/api/Endpoints/FMS/StaticData/PrepaidTypes";
import {
  useCancelPrepaymentsMutation,
  useFilesDeletePrepaymentsMutation,
  useFilesUploadPrepaymentsMutation,
  useFindPrepaymentsQuery,
  useSavePrepaymentsMutation,
  useSubmitPrepaymentsMutation,
} from "@/api/Endpoints/FMS/Transactions/Prepayment/Prepayments";

const MODULE_NAME = "Prepayment";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSavePrepaymentsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitPrepaymentsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelPrepaymentsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const [lookupClient] = useLookUpClientsMutation();
  const [lookupPrepaidType] = useLookUpPrepaidTypesMutation();
  const [lookupPaymentMode] = useLookUpPaymentModesMutation();

  const { data: transactionData, refetch } = useFindPrepaymentsQuery(
    { prepaymentId: data?.prepaymentId },
    { skip: !data?.prepaymentId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadPrepaymentsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeletePrepaymentsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_PREPAYMENTS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    prepaymentId: data?.prepaymentId || 0,
    referenceNo: data?.referenceNo || "",
    contractReferenceNo: data?.contractReferenceNo || "",
    disbursementVoucherNo: data?.disbursementVoucherNo || "",
    paymentDate: data?.paymentDate || null,
    contractBillingReferenceNo: data?.contractBillingReferenceNo || "",
    payeeId: data?.payeeId || 0,
    payeeName: data?.payeeName || "",
    payeeTIN: data?.payeeTIN || "",
    payeeAddress: data?.payeeAddress || "",
    payeeContactNo: data?.payeeContactNo || "",
    prepaidTypeId: data?.prepaidTypeId || 0,
    prepaidTypeName: data?.prepaidTypeName || "",
    paymentModeId: data?.paymentModeId || 0,
    paymentModeName: data?.paymentModeName || "",
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    startDate: data?.startDate || null,
    endDate: data?.endDate || null,
    totalMonths: data?.totalMonths || 0,
    totalPrepaidAmount: data?.totalPrepaidAmount || 0,
    monthlyAmortization: data?.monthlyAmortization || 0,
    taxWithheld: data?.taxWithheld || 0,
    particulars: data?.particulars || "",
    files: data?.files || [],
  };

  const { handleSubmit, reset, control, watch, setValue } = useForm({ ...defaultValues });

  const totalPrepaidAmount = watch("totalPrepaidAmount");
  const totalMonths = watch("totalMonths");
  const taxWithheld = watch("taxWithheld");
  const netAmount = watch("netAmount");
  const monthlyAmortization = watch("monthlyAmortization");

  useEffect(() => {
    setValue("monthlyAmortization", totalMonths > 0 ? totalPrepaidAmount / totalMonths : 0);
    setValue("netAmount", totalPrepaidAmount - taxWithheld);
  }, [totalPrepaidAmount, totalMonths, taxWithheld]);

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      ...buildSelectPairs(["paymentModeId", "prepaidTypeId"], findData),
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,
      financingSourceId: findData?.financingSourceId ? { value: findData.financingSourceId, label: findData.financingSourceName, displayName: findData.financingSourceName } : null,
      payeeId: findData?.payeeId
        ? {
          value: findData?.payeeId,
          label: findData?.payeeName,
          clientId: findData?.payeeId,
          clientName: findData?.payeeName,
        }
        : null,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["paymentModeId", "prepaidTypeId"], formData),
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
      financingSourceId: formData?.financingSourceId?.value,
      financingSourceName: formData?.financingSourceId?.displayName,
      payeeId: formData?.payeeId?.clientId,
      payeeName: formData?.payeeId?.clientName,
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
        title={data?.prepaymentId ? "Update Prepayment" : "New Prepayment"}
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

          <Section title="Contract / Document Reference">
            <Row>
              <Col lg={6}>
                <InputField
                  name="contractReferenceNo"
                  control={control}
                  label="Contract / PE Reference No."
                  placeholder="e.g. PE-2025-07-001"
                  rules={{ required: "Contract / PE Reference No. is required." }}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  name="disbursementVoucherNo"
                  control={control}
                  label="Disbursement Voucher No."
                  placeholder="e.g. DV-2025-07-000001"
                  rules={{ required: "Disbursement Voucher No. is required." }}
                />
              </Col>
              <Col lg={6}>
                <DatePickerField
                  name="paymentDate"
                  control={control}
                  label="Date of Payment / DV Date"
                  rules={{ required: "Date of Payment / DV Date is required." }}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  name="contractBillingReferenceNo"
                  control={control}
                  label="Contract / Billing Reference No."
                  placeholder="e.g. Contract No. 2025-LGU-001"
                />
              </Col>
            </Row>
          </Section>

          <Section title="Payee / Supplier">
            <Row>
              <Col lg={6}>
                <AsyncSelect
                  name="payeeId"
                  control={control}
                  label="Payee / Supplier"
                  loadOptions={formatLoadOptions(lookupClient)}
                  rules={{ required: "Payee / Supplier is required." }}
                  placeholder="Select payee / supplier..."
                  getOptionValue={(opt) => opt.clientId || opt.value}
                  getOptionLabel={(opt) => opt.clientName || opt.label}
                  onChange={(selected) => {
                    setValue("payeeId", selected);
                    setValue("payeeTIN", selected?.tin);
                  }}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  control={control}
                  name="payeeTIN"
                  label="TIN"
                  placeholder="XXX-XXX-XXX-XXX"
                />
              </Col>
              <Col lg={6}>
                <InputField
                  label="Address"
                  name="payeeAddress"
                  control={control}
                  placeholder="Business Address"
                />
              </Col>
              <Col lg={6}>
                <MobileInputField
                  label="Contact No."
                  name="payeeContactNo"
                  control={control}
                  placeholder="+63 XXX XXX XXXX"
                />
              </Col>
            </Row>
          </Section>

          <Section title="Prepaid Expense Classification">
            <Row>
              <Col lg={6}>
                <AsyncSelect
                  name="prepaidTypeId"
                  control={control}
                  label="Prepaid Type"
                  placeholder="Select Prepaid Type..."
                  loadOptions={formatLoadOptions(lookupPrepaidType)}
                  getOptionValue={(opt) => opt.prepaidTypeId || opt.value}
                  getOptionLabel={(opt) => opt.prepaidTypeName || opt.label}
                  rules={{ required: "Prepaid Type is required." }}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  name="paymentModeId"
                  control={control}
                  label="Payment Mode"
                  placeholder="Select Payment Mode..."
                  loadOptions={formatLoadOptions(lookupPaymentMode)}
                  getOptionValue={(opt) => opt.paymentModeId || opt.value}
                  getOptionLabel={(opt) => opt.paymentModeName || opt.label}
                  rules={{ required: "Payment Mode is required." }}
                />
              </Col>
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

          <Section title="Coverage Period">
            <Row>
              <Col lg={4}>
                <DatePickerField
                  name="startDate"
                  control={control}
                  label="Start Date"
                  rules={{ required: "Start Date is required." }}
                />
              </Col>
              <Col lg={4}>
                <DatePickerField
                  name="endDate"
                  control={control}
                  label="End Date"
                  rules={{ required: "End Date is required." }}
                />
              </Col>
              <Col lg={4}>
                <InputField
                  name="totalMonths"
                  control={control}
                  label="No. of Months"
                  type="number"
                  placeholder="0"
                  rules={{ required: "No. of Months is required." }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Amount">
            <Row>
              <Col lg={4}>
                <CurrencyInputField
                  name="totalPrepaidAmount"
                  control={control}
                  label="Total Prepaid Amount"
                  placeholder="0.00"
                  note="Full amount paid upfront to be amortized"
                  rules={{
                    required: "Total Prepaid Amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Total Prepaid Amount must be greater than zero.",
                  }}
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  disabled
                  name="monthlyAmortization"
                  control={control}
                  label="Monthly Amortization"
                  placeholder="0.00"
                  note="Auto-computed: Total ÷ Months"
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  name="taxWithheld"
                  control={control}
                  label="EWT Withheld (if applicable)"
                  placeholder="0.00"
                  note="5% EWT on rent; creditable"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>
            </Row>

            {/* Stat Cards */}
            <Row className="mb-3">
              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Total Prepaid</div>
                  <div className="text-info fw-semibold">{formatAmount(totalPrepaidAmount || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Monthly Expense</div>
                  <div className="text-warning fw-semibold">{formatAmount(monthlyAmortization || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Tax Withheld</div>
                  <div className="text-warning fw-semibold">{formatAmount(taxWithheld || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Net Amount</div>
                  <div className="text-success fw-semibold">{formatAmount(netAmount || 0)}</div>
                </div>
              </Col>
            </Row>
          </Section>

          <Section title="Particulars">
            <Row>
              <Col lg={12}>
                <InputField
                  name="particulars"
                  control={control}
                  label="Particulars"
                  type="textarea"
                  rows={3}
                  maxLength={500}
                  showCharCounter
                  placeholder="e.g. Prepaid office rent — 3rd Floor Ayala Tower, Makati City per Lease Agreement dated Jan 1, 2025, covering Jan 1 – Dec 31, 2025..."
                  rules={{ required: "Particulars is required." }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.prepaymentId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ prepaymentId: data?.prepaymentId || 0 }}
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
    </React.Fragment>
  );
};

export default SaveModal;
