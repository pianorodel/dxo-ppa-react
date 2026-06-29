import React, { useEffect, useMemo } from "react";
import { Col, Row } from "reactstrap";

import "@/assets/scss/modern-modal.css";
import HistoryList from "@/components/Common/HistoryList";
import InfoRow from "@/components/Common/Inforow";
import TransactionDetailsModal from "@/components/Common/Modals/TransactionDetailsModal";
import Section from "@/components/Common/Section";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { formatDate } from "@/helpers/date_helper";
import { formatAmount } from "@/helpers/decimal_helper";

import ActionModal from "./ActionModal";
import DisbursementVoucherPDF from "./DisbursementVoucherPDF";

import { useGetDisbursementVoucherLogsQuery } from "@/api/Endpoints/FMS/Transactions/DisbursementVoucher/DisbursementVoucherLogs";
import { useFindDisbursementVouchersQuery } from "@/api/Endpoints/FMS/Transactions/DisbursementVoucher/DisbursementVouchers";

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

function TransactionDetailsTab({ data }) {
  return (
    <div className="h-100" style={{ paddingTop: 4 }}>
      <Row className="h-100">
        <Col lg={6} md="6" xs="6">
          <Section title="Request Details">
            <Row>
              <Col lg={6}>
                <InfoRow icon="bx bx-calendar" label="Voucher Date" value={formatDate(data?.voucherDate)} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-receipt" label="Fund Cluster." value={data?.fundClusterName} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-transfer-alt" label="Transaction Type" value={data?.transactionTypeName} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-money" label="Voucher Amount" value={formatAmount(data?.amount)} />
              </Col>
            </Row>
          </Section>

          <Section title="Remarks">
            <Row>
              <Col lg={12}>
                <InfoRow icon="bx bx-message-square-detail" label="Remarks" value={data?.remarks} />
              </Col>
            </Row>
          </Section>

          <Section title="Status Details">
            <Row>
              <Col lg={6}>
                <InfoRow label="Date Submitted" value={formatDate(data?.dateSubmitted)} icon="ri-calendar-2-line" />
              </Col>
              <Col lg={6}>
                <InfoRow label="Submitted By" value={data?.submittedByName} icon="ri-user-3-line" />
              </Col>
              <Col lg={6}>
                <InfoRow label="Date Approved" value={formatDate(data?.dateApproved)} icon="ri-calendar-2-line" />
              </Col>
              <Col lg={6}>
                <InfoRow label="Approved By" value={data?.approvedByName} icon="ri-user-3-line" />
              </Col>
            </Row>
          </Section>
        </Col>
        <Col lg={6} md="6" xs="6">
          <div className="h-100" style={{ marginBottom: "10px" }}>
            <DisbursementVoucherPDF pdfTitle="Disbursement Voucher" headerData={headerData} particularsEntries={particularsEntries} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default function ViewDetails({ show, onCloseClick, data, parentKey, onUpdateParentKey }) {
  if (!show) return null;

  const TABS = useMemo(
    () => [
      { key: "requestInfo", label: "Request Details", icon: "ri-user-line", component: TransactionDetailsTab },
      {
        key: "history",
        label: "History",
        icon: "ri-shield-flash-line",
        component: () => (
          <HistoryList
            transactionId={data?.disbursementVoucherId}
            useLogsQuery={useGetDisbursementVoucherLogsQuery}
            idKey="disbursementVoucherId"
            title="History"
          />
        ),
      },
      // {
      //   key: "files", label: "Files", icon: "ri-folder-line", component: () =>
      //     <TransactionFilesList
      //       transactionId={data?.disbursementVoucherId}
      //       useFilesQuery={useGetFilesDoctorEnrollmentsQuery}
      //       idKey="disbursementVoucherId"
      //       title="Files"
      //     />
      // },
    ],
    [data?.disbursementVoucherId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindDisbursementVouchersQuery(
    { disbursementVoucherId: data?.disbursementVoucherId },
    { skip: !data?.disbursementVoucherId, refetchOnMountOrArgChange: show },
  );
  const findData = transactionData?.returnData;

  useEffect(() => {
    customFunction.updateState({
      data: {
        ...data,
        ...findData,
      },
    });
  }, [show, data, findData]);

  const handleActions = (bool, data) => {
    if (bool) {
      refetch();
      customFunction.updateToggle("toggleAction");
      customFunction.updateState({
        tabRefreshKey: state?.tabRefreshKey + 1,
      });
      onUpdateParentKey(parentKey + 1);
    } else {
      customFunction.updateToggle("toggleAction", { ...findData, actionName: data });
    }
  };

  const BUTTONS = useMemo(
    () => [
      {
        label: "Return",
        icon: "ri-arrow-go-back-line",
        className: "emd-btn-warning",
        show: state?.data?.actions?.return,
        onClick: () => handleActions(false, "Return"),
      },
      {
        label: "Approve",
        icon: "ri-check-double-line",
        className: "emd-btn-success",
        show: state?.data?.actions?.approve,
        onClick: () => handleActions(false, "Approve"),
      },
      {
        label: "Reject",
        icon: "ri-thumb-down-line",
        className: "emd-btn-danger",
        show: state?.data?.actions?.reject,
        onClick: () => handleActions(false, "Reject"),
      },
      {
        label: "Cancel",
        icon: "ri-close-line",
        className: "emd-btn-danger",
        show: state?.data?.actions?.cancel,
        onClick: () => handleActions(false, "Cancel"),
      },
    ],
    [state?.data?.actions],
  );

  return (
    <React.Fragment>
      <ActionModal
        state={state}
        customFunction={customFunction}
        disbursementVoucherId={findData?.disbursementVoucherId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        fullscreen
        title={"Disbursement Voucher Request"}
        show={show}
        data={state.data}
        tabs={TABS}
        buttons={BUTTONS}
        onCloseClick={onCloseClick}
        tabRefreshKey={state.tabRefreshKey}
      />
    </React.Fragment>
  );
}
