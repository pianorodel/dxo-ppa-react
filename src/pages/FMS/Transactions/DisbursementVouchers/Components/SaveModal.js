import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { AsyncSelect, DatePickerField, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import DisbursementVoucherPDF from "./DisbursementVoucherPDF";
import "./style.css";

import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import { useLookUpTransactionTypesMutation } from "@/api/Endpoints/FMS/StaticData/TransactionTypes";
import {
  useFindDisbursementVouchersQuery,
  useSaveDisbursementVouchersMutation,
  useSubmitDisbursementVouchersMutation,
} from "@/api/Endpoints/FMS/Transactions/DisbursementVoucher/DisbursementVouchers";

const MODULE_NAME = "Disbursement Voucher";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveDisbursementVouchersMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitDisbursementVouchersMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupTramsactionType] = useLookUpTransactionTypesMutation();
  const { data: transactionData, refetch } = useFindDisbursementVouchersQuery(
    { disbursementVoucherId: data?.disbursementVoucherId },
    { skip: !data?.disbursementVoucherId, refetchOnMountOrArgChange: show },
  );

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_DISBURSEMENTVOUCHERS_VIEWER]) && !hasWriteAccess(accessRights);
  const actionType = useRef("save");

  const defaultValues = {
    disbursementVoucherId: 0,
    voucherDate: null,
    transactionTypeId: null,
    transactionTypeName: "",
    fundClusterId: null,
    fundClusterName: "",
    amount: null,
    particulars: "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      ...buildSelectPairs(["fundClusterId", "bankAccountId", "transactionTypeId"], findData),
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["fundClusterId", "bankAccountId", "transactionTypeId"], formData),
    };

    try {
      const response = actionType.current === "save" ? await save(payload).unwrap() : await submit(payload).unwrap();
      assertApiSuccess(response);
      notification({
        type: "success",
        title: response.returnData.referenceNo,
        header: `${actionType.current === "save" ? "Save" : "Submit"} ${MODULE_NAME}`,
        message: `${MODULE_NAME} was successfully ${actionType.current === "save" ? "saved" : "submitted"}.`,
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

  const headerData = {
    fundCluster: "01",
    date: "March 7, 2026",
    dvNo: "2026-03-001",

    modeOfPayment: "mds", // "mds" | "commercial" | "ada" | "others"
    othersLabel: "",

    payee: "Juan Dela Cruz",
    address: "123 Rizal Street, Ermita, Manila",

    chargesTo: "101-101-101",
    available: "Yes",
    accountingHeadName: "SANTOS, MARIA L.",
    accountingDate: "March 7, 2026",

    cashAvailable: "500,000.00",
    subjectToAda: "N/A",
    cashHeadName: "REYES, JOSE P.",
    cashDate: "March 7, 2026",

    approvedDate: "March 7, 2026",

    checkAdaNo: "CHK-2026-00123",
    checkAdaDate: "March 7, 2026",
    bankName: "Land Bank of the Philippines",
    checkAdaAmount: "45,000.00",

    jevNo: "JEV-2026-03-001",
    jevDate: "March 7, 2026",
  };

  const particularsEntries = [
    {
      particulars: "Payment for office supplies and materials for Q1 2026 operations",
      responsibilityCenter: "Office of the Mayor",
      mfoPap: "MFO 1",
      amount: 15000.0,
    },
    {
      particulars: "Reimbursement of transportation expenses for official travel",
      responsibilityCenter: "Admin Division",
      mfoPap: "MFO 2",
      amount: 8500.5,
    },
    {
      particulars: "Payment for janitorial services – February 2026",
      responsibilityCenter: "General Services",
      mfoPap: "MFO 1",
      amount: 12000.0,
    },
    {
      particulars: "Purchase of toner cartridges and printer paper",
      responsibilityCenter: "Records Section",
      mfoPap: "MFO 3",
      amount: 9500.0,
    },
  ];

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        fullscreen={true}
        title={data?.disbursementVoucherId ? "Update Disbursement Voucher Request" : "Add Disbursement Voucher Request"}
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
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Row className="h-100">
            <Col md={6}>
              <Row>
                <Col lg={6}>
                  <DatePickerField
                    disabled={isViewerOnly}
                    name="voucherDate"
                    control={control}
                    label="Voucher Date"
                    options={{
                      maxDate: new Date(),
                    }}
                    rules={{ required: "Voucher date is required." }}
                  />
                </Col>

                <Col lg={6}>
                  <AsyncSelect
                    isDisabled={isViewerOnly}
                    name="fundClusterId"
                    control={control}
                    label="Fund Cluster"
                    loadOptions={formatLoadOptions(lookupFundCluster)}
                    rules={{ required: "Fund Cluster is required" }}
                    placeholder="Select a fund cluster"
                    getOptionValue={(opt) => opt.fundClusterId || opt.value}
                    getOptionLabel={(opt) => opt.fundClusterName || opt.label}
                  />
                </Col>

                <Col lg={12}>
                  <AsyncSelect
                    isDisabled={isViewerOnly}
                    name="transactionTypeId"
                    control={control}
                    label="Transaction Type"
                    loadOptions={formatLoadOptions(lookupTramsactionType)}
                    rules={{ required: "Transaction type is required" }}
                    placeholder="Select a Transaction type"
                    getOptionValue={(opt) => opt.transactionTypeId || opt.value}
                    getOptionLabel={(opt) => opt.transactionTypeName || opt.label}
                  />
                </Col>

                <Col lg={6}>
                  <CurrencyInputField
                    name="amount"
                    control={control}
                    label="Amount"
                    type="number"
                    rules={{
                      required: "Amount is required.",
                      validate: (value) => parseFloat(value) > 0 || "Amount should be greater than zero.",
                    }}
                    placeholder="Enter amount..."
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Col>

                <Col lg={12}>
                  <InputField
                    disabled={isViewerOnly}
                    rows={4}
                    name="particulars"
                    control={control}
                    label="Particulars"
                    type="textarea"
                    maxLength={500}
                    showCharCounter
                    rules={{ required: "Particulars is required." }}
                    placeholder="Enter Particulars..."
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={6} md="6" xs="6">
              <div className="h-100" style={{ marginBottom: "10px" }}>
                <DisbursementVoucherPDF pdfTitle="Disbursement Voucher" headerData={headerData} particularsEntries={particularsEntries} />
              </div>
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
