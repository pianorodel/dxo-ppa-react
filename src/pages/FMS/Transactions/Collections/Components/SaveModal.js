import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import InfoRow from "@/components/Common/Inforow";
import { AsyncSelect, DatePickerField, InputField, MobileInputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { formatAmount } from "@/helpers/decimal_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpBanksMutation } from "@/api/Endpoints/FMS/StaticData/Banks";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import { useLookUpObjectCodesMutation } from "@/api/Endpoints/FMS/StaticData/ObjectCodes";
import {
  useCancelCollectionsMutation,
  useFilesDeleteCollectionsMutation,
  useFilesUploadCollectionsMutation,
  useFindCollectionsQuery,
  useSaveCollectionsMutation,
  useSubmitCollectionsMutation,
} from "@/api/Endpoints/FMS/Transactions/Collection/Collections";
import { useLookUpOrderOfPaymentsMutation } from "@/api/Endpoints/FMS/Transactions/OrderOfPayment/OrderOfPayments";

const MODULE_NAME = "Collection";

const PAYMENT_MODES = [
  { value: "Cash", label: "Cash" },
  { value: "Check", label: "Check" },
  { value: "Bank Transfer / LBP Online", label: "Bank Transfer / LBP Online" },
  { value: "e-Payment / GCash / Maya", label: "e-Payment / GCash / Maya" },
  { value: "PESONet / InstaPay", label: "PESONet / InstaPay" },
];

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveCollectionsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitCollectionsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelCollectionsMutation();
  const [lookupOrderOfPayment] = useLookUpOrderOfPaymentsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const [lookupObjectCode] = useLookUpObjectCodesMutation();
  const [lookupBank] = useLookUpBanksMutation();

  const { data: transactionData, refetch } = useFindCollectionsQuery(
    { collectionId: data?.collectionId },
    { skip: !data?.collectionId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadCollectionsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteCollectionsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_COLLECTIONS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    collectionId: data?.collectionId || 0,
    referenceNo: data?.referenceNo || "",
    collectionMode: data?.collectionMode || "OOP",
    orderOfPaymentId: data?.orderOfPaymentId || 0,
    orderOfPaymentNo: data?.orderOfPaymentNo || "",
    feeTypeName: data?.feeTypeName || "",
    payorId: data?.payorId || 0,
    payorName: data?.payorName || "",
    payorTIN: data?.payorTIN || "",
    payorAddress: data?.payorAddress || "",
    payorContactNo: data?.payorContactNo || "",
    principalAmount: data?.principalAmount || 0,
    surcharge: data?.surcharge || 0,
    totalOOPAmount: data?.totalOOPAmount || 0,
    grossAmount: data?.grossAmount || 0,
    taxWithheld: data?.taxWithheld || 0,
    netAmount: data?.netAmount || 0,
    paymentMode: data?.paymentMode || "Cash",
    paymentReferenceNo: data?.paymentReferenceNo || "",
    checkNo: data?.checkNo || "",
    bankId: data?.bankId || 0,
    bankName: data?.bankName || "",
    checkDate: data?.checkDate || null,
    objectCodeId: data?.objectCodeId || 0,
    objectCodeName: data?.objectCodeName || "",
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    particulars: data?.particulars || "",
    files: data?.files || [],
  };

  const { handleSubmit, setValue, reset, control, watch } = useForm({ ...defaultValues });

  const orderOfPaymentData = watch("orderOfPaymentId");
  const collectionMode = watch("collectionMode");
  const paymentMode = watch("paymentMode")?.value;

  const grossAmount = watch("grossAmount");
  const taxWithheld = watch("taxWithheld");

  useEffect(() => {
    const gross = parseFloat(grossAmount) || 0;
    const tax = parseFloat(taxWithheld) || 0;
    setValue("netAmount", (gross + tax).toFixed(2));
  }, [grossAmount, taxWithheld, setValue]);

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      orderOfPaymentId: findData?.orderOfPaymentId
        ? {
          value: findData.orderOfPaymentId,
          label: findData.orderOfPaymentNo,
          orderOfPaymentNo: findData.orderOfPaymentNo,
          referenceNo: findData.orderOfPaymentNo,
          feeTypeName: findData.feeTypeName,
          payorName: findData.payorName,
          payorTIN: findData.payorTIN,
          payorAddress: findData.payorAddress,
          payorContactNo: findData.payorContactNo,
          principalAmount: findData.principalAmount,
          surcharge: findData.surcharge,
          totalOOPAmount: findData.totalOOPAmount,
          totalAmount: findData.totalOOPAmount,
        } : null,
      paymentMode: data?.paymentMode ? { value: data.paymentMode, label: data.paymentMode } : null,
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,
      financingSourceId: findData?.financingSourceId ? { value: findData.financingSourceId, label: findData.financingSourceName, displayName: findData.financingSourceName } : null,
      objectCodeId: findData?.objectCodeId
        ? {
          value: findData.objectCodeId,
          label: findData.objectCodeName,
          objectCodeName: findData.objectCodeName,
          displayName: findData.objectCodeName
        } : null,
      ...buildSelectPairs(["bankId"], findData),

    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["bankId"], formData),
      orderOfPaymentId: formData?.orderOfPaymentId?.value,
      orderOfPaymentNo: formData?.orderOfPaymentId?.referenceNo,
      feeTypeName: formData?.orderOfPaymentId?.feeTypeName,
      payorId: formData?.orderOfPaymentId?.payorId,
      payorName: formData?.collectionMode === "OOP" ? formData?.orderOfPaymentId?.payorName : formData?.payorName,
      payorTIN: formData?.collectionMode === "OOP" ? formData?.orderOfPaymentId?.payorTIN : formData?.payorTIN,
      payorAddress: formData?.collectionMode === "OOP" ? formData?.orderOfPaymentId?.payorAddress : formData?.payorAddress,
      payorContactNo: formData?.collectionMode === "OOP" ? formData?.orderOfPaymentId?.payorContactNo : formData?.payorContactNo,
      principalAmount: formData?.orderOfPaymentId?.principalAmount,
      surcharge: formData?.orderOfPaymentId?.surcharge,
      totalOOPAmount: formData?.orderOfPaymentId?.totalAmount,
      paymentMode: formData?.paymentMode?.value,
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
      financingSourceId: formData?.financingSourceId?.value,
      financingSourceName: formData?.financingSourceId?.displayName,
      objectCodeId: formData?.objectCodeId?.value,
      objectCodeName: formData?.objectCodeId?.displayName,
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
        title={data?.collectionId ? "Update Collection" : "New Collection"}
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

          <Section title="Collection Mode">
            <Row style={{ marginBottom: "16px" }}>
              <Col lg={12}>
                <Controller
                  name="collectionMode"
                  control={control}
                  rules={{ required: "Collection Mode is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="d-flex gap-3">
                        {[
                          {
                            value: "OOP",
                            label: "Via Order of Payment (OOP)",
                            sub: "OP issued first — payor presents OP to cashier",
                            icon: "bx bx-file",
                          },
                          {
                            value: "DIRECT",
                            label: "Direct / Over the Counter",
                            sub: "Walk-in / Bank Deposit / e-Payment — no OP required",
                            icon: "bx bx-checkbox-square",
                          },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            onClick={() => field.onChange(opt.value)}
                            className={`collection-mode-card ${field.value === opt.value ? "active" : ""}`}
                          >
                            <i className={`${opt.icon} me-2`} />
                            <span className="fw-semibold">{opt.label}</span>
                            <div className="text-muted small mt-1">{opt.sub}</div>
                          </div>
                        ))}
                      </div>
                      {fieldState.error && (
                        <div className="text-danger small mt-1">{fieldState.error.message}</div>
                      )}
                    </>
                  )}
                />
              </Col>
            </Row>
          </Section>

          {collectionMode === "OOP" && (
            <>
              <Row>
                <Col lg="12">
                  <AsyncSelect
                    name="orderOfPaymentId"
                    control={control}
                    label="Order of Payment"
                    loadOptions={formatLoadOptions(lookupOrderOfPayment)}
                    getOptionValue={(opt) => opt.orderOfPaymentId || opt.value}
                    getOptionLabel={(opt) => opt.referenceNo || opt.label}
                    formatOptionLabel={(opt) => (
                      <div>
                        <div>{opt.label}</div>
                        <div className="d-flex justify-content-between">
                          <small>{"["}{opt.feeTypeName}{"]"} {"-"} {opt.payorName}</small>
                          <small style={{ fontWeight: "bold", color: "#0ab39c" }}>
                            ₱{Number((opt.totalAmount) || 0).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    )}
                    placeholder="Select order of payment..."
                  />
                </Col>
              </Row>
              <Section title="Payor Information">
                <Row>
                  <Col lg={6}>
                    <InfoRow icon="bx bx-user" label="Payor Name / Business Name" value={orderOfPaymentData?.payorName || findData?.payorName} />
                  </Col>
                  <Col lg={6}>
                    <InfoRow icon="bx bx-id-card" label="TIN" value={orderOfPaymentData?.payorTIN || findData?.payorTIN} />
                  </Col>
                  <Col lg={6}>
                    <InfoRow icon="bx bx-map" label="Address" value={orderOfPaymentData?.payorAddress || findData?.payorAddress} />
                  </Col>
                  <Col lg={6}>
                    <InfoRow icon="bx bx-phone" label="Contact No." value={orderOfPaymentData?.payorContactNo || findData?.payorContactNo} />
                  </Col>
                </Row>
              </Section>

              <Section title="Amount">
                <Row>
                  <Col lg={4}>
                    <InfoRow icon="bx bx-money" label="Principal Amount" value={formatAmount(orderOfPaymentData?.principalAmount || findData?.principalAmount || 0)} />
                  </Col>
                  <Col lg={4}>
                    <InfoRow icon="bx bx-error-circle" label="Surcharge / Penalty (if any)" value={formatAmount(orderOfPaymentData?.surcharge || findData?.surcharge || 0)} />
                  </Col>
                  <Col lg={4}>
                    <InfoRow icon="bx bx-calculator" label="Total Amount Due" value={formatAmount(orderOfPaymentData?.totalOOPAmount || findData?.totalAmount || 0)} />
                  </Col>
                </Row>

                <Row style={{ paddingLeft: "14px", paddingRight: "14px" }}>
                  <Col lg={4}>
                    <CurrencyInputField
                      name="grossAmount"
                      control={control}
                      label="Gross Amount Collected"
                      placeholder="0.00"
                      rules={{
                        required: "Gross Amount Collected is required.",
                        validate: (value) => parseFloat(value) > 0 || "Gross Amount Collected should be greater than zero.",
                      }}
                    />
                  </Col>
                  <Col lg={4}>
                    <CurrencyInputField
                      name="taxWithheld"
                      control={control}
                      label="Tax Withheld (if applicable)"
                      placeholder="0.00"
                      rules={{
                        validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                      }}
                    />
                  </Col>
                  <Col lg={4}>
                    <CurrencyInputField
                      disabled
                      control={control}
                      label="Net Amount"
                      name="netAmount"
                      placeholder="0.00"
                      rules={{
                        required: "Net amount is required.",
                        validate: (value) => parseFloat(value) > 0 || "Net amount should be greater than zero.",
                      }}
                    />
                  </Col>
                </Row>
              </Section>
            </>
          )}

          {collectionMode === "DIRECT" && (
            <>
              <Section title="Payor Information">
                <Row>
                  <Col lg={6}>
                    <InputField
                      control={control}
                      name="payorName"
                      label="Payor Name / Business Name"
                      placeholder="Payor Name / Business Name"
                    />
                  </Col>
                  <Col lg={6}>
                    <InputField
                      control={control}
                      name="payorTIN"
                      label="TIN"
                      placeholder="XXX-XXX-XXX-XXX"
                    />
                  </Col>
                  <Col lg={6}>
                    <InputField
                      label="Address"
                      name="payorAddress"
                      control={control}
                      placeholder="Business or residential address"
                    />
                  </Col>
                  <Col lg={6}>
                    <MobileInputField
                      label="Contact No."
                      name="payorContactNo"
                      control={control}
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </Col>
                </Row>
              </Section>

              <Section title="Amount">
                <Row >
                  <Col lg={4}>
                    <CurrencyInputField
                      name="grossAmount"
                      control={control}
                      label="Gross Amount Collected"
                      placeholder="0.00"
                      rules={{
                        required: "Gross Amount Collected is required.",
                        validate: (value) => parseFloat(value) > 0 || "Gross Amount Collected should be greater than zero.",
                      }}
                    />
                  </Col>
                  <Col lg={4}>
                    <CurrencyInputField
                      name="taxWithheld"
                      control={control}
                      label="Tax Withheld (if applicable)"
                      placeholder="0.00"
                      rules={{
                        validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                      }}
                    />
                  </Col>
                  <Col lg={4}>
                    <CurrencyInputField
                      disabled
                      control={control}
                      label="Net Amount"
                      name="netAmount"
                      placeholder="0.00"
                      rules={{
                        required: "Net amount is required.",
                        validate: (value) => parseFloat(value) > 0 || "Net amount should be greater than zero.",
                      }}
                    />
                  </Col>
                </Row>
              </Section>
            </>
          )}

          <Section title="Payment Details">
            <Row>
              <Col lg={6}>
                <NormalSelect
                  options={PAYMENT_MODES}
                  control={control}
                  name="paymentMode"
                  label="Mode of Payment"
                  placeholder="Select mode pf payment..."
                />
              </Col>
              {paymentMode !== "Cash" && paymentMode !== "Check" &&
                <Col lg={6}>
                  <InputField
                    control={control}
                    name="paymentReferenceNo"
                    label="Payment Reference / Transaction No."
                    placeholder="Reference number from bank / e-wallet"
                  />
                </Col>
              }
              {paymentMode === "Check" &&
                <>
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
                    <InputField
                      control={control}
                      name="checkNo"
                      label="Check Number"
                      placeholder="e.g. 0001234567"
                    />
                  </Col>
                  <Col lg={6}>
                    <DatePickerField
                      name="checkDate"
                      control={control}
                      label="Check Date"
                    />
                  </Col>
                </>
              }
            </Row>
          </Section>

          <Section title="Revenue Classification">
            <Row>
              <Col lg={12}>
                <AsyncSelect
                  isClearable
                  name="objectCodeId"
                  control={control}
                  label="Revenue Object Code"
                  loadOptions={formatLoadOptions(lookupObjectCode, { parentUACS: ["40", "30"] })}
                  rules={{ required: "Object Code is required." }}
                  placeholder="Select Object Code..."
                  getOptionValue={(opt) => opt.objectCodeId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                  isDisabled={isViewerOnly}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  name="fundClusterId"
                  control={control}
                  label="Fund Cluster"
                  loadOptions={formatLoadOptions(lookupFundCluster)}
                  rules={{ required: "Fund Cluster is required." }}
                  placeholder="Select fund cluster..."
                  getOptionValue={(opt) => opt.fundClusterId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>

              <Col lg={6}>
                <AsyncSelect
                  name="financingSourceId"
                  control={control}
                  label="Financing Source"
                  loadOptions={formatLoadOptions(lookupFinancingSource)}
                  rules={{ required: "Financing Source is required." }}
                  placeholder="Select financing source..."
                  getOptionValue={(opt) => opt.financingSourceId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Particulars">
            <Row>
              <Col lg={12}>
                <InputField
                  name="particulars"
                  control={control}
                  type="textarea"
                  rows={3}
                  maxLength={500}
                  showCharCounter
                  placeholder="Enter particulars..."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.collectionId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ collectionId: data?.collectionId || 0 }}
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
