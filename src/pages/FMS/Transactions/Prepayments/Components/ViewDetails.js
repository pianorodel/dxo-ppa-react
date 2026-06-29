import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Col, Row } from "reactstrap";

import "@/assets/scss/modern-modal.css";
import InfoRow from "@/components/Common/Inforow";
import TransactionDetailsModal from "@/components/Common/Modals/TransactionDetailsModal";
import Section from "@/components/Common/Section";
import TransactionFilesList from "@/components/Common/TransactionFilesList";
import HistoryList from "@/components/Common/HistoryList";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { formatDate } from "@/helpers/date_helper";
import { formatAmount } from "@/helpers/decimal_helper";

import ActionModal from "./ActionModal";

import { useGetPrepaymentLogsQuery } from "@/api/Endpoints/FMS/Transactions/Prepayment/PrepaymentLogs";
import { useFindPrepaymentsQuery, useGetFilesPrepaymentsQuery } from "@/api/Endpoints/FMS/Transactions/Prepayment/Prepayments";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Contract / Document Reference">
        <Row>
          <Col lg={6}><InfoRow icon="bx bx-file" label="Contract / PE Reference No." value={data?.contractReferenceNo} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-receipt" label="Disbursement Voucher No." value={data?.disbursementVoucherNo} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-calendar" label="Date of Payment / DV Date" value={formatDate(data?.paymentDate)} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-link" label="Contract / Billing Reference No." value={data?.contractBillingReferenceNo} /></Col>
        </Row>
      </Section>

      <Section title="Payee / Supplier">
        <Row>
          <Col lg={6}><InfoRow icon="bx bx-user" label="Payee / Supplier" value={data?.payeeName} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-id-card" label="TIN" value={data?.payeeTIN} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-map" label="Address" value={data?.payeeAddress} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-phone" label="Contact No." value={data?.payeeContactNo} /></Col>
        </Row>
      </Section>

      <Section title="Prepaid Expense Classification">
        <Row>
          <Col lg={6}><InfoRow icon="bx bx-category" label="Prepaid Type" value={data?.prepaidTypeName} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-credit-card" label="Payment Mode" value={data?.paymentModeName} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-wallet" label="Fund Cluster" value={data?.fundClusterName} /></Col>
          <Col lg={6}><InfoRow icon="bx bx-money" label="Financing Source" value={data?.financingSourceName} /></Col>
        </Row>
      </Section>

      <Section title="Coverage Period">
        <Row>
          <Col lg={4}><InfoRow icon="bx bx-calendar-check" label="Start Date" value={formatDate(data?.startDate)} /></Col>
          <Col lg={4}><InfoRow icon="bx bx-calendar-x" label="End Date" value={formatDate(data?.endDate)} /></Col>
          <Col lg={4}><InfoRow icon="bx bx-time" label="No. of Months" value={String(data?.totalMonths)} /></Col>
        </Row>
      </Section>

      <Section title="Amount">
        <Row>
          <Col lg={4}><InfoRow icon="bx bx-money-withdraw" label="Total Prepaid Amount" value={formatAmount(data?.totalPrepaidAmount)} /></Col>
          <Col lg={4}><InfoRow icon="bx bx-calculator" label="Monthly Amortization" value={formatAmount(data?.monthlyAmortization)} /></Col>
          <Col lg={4}><InfoRow icon="bx bx-minus-circle" label="EWT Withheld" value={formatAmount(data?.taxWithheld)} /></Col>
        </Row>
      </Section>

      <Section title="Particulars">
        <Row>
          <Col lg={12}><InfoRow icon="bx bx-message-square-detail" label="Particulars" value={data?.particulars} /></Col>
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
    </div>
  );
}

export default function ViewDetails({ show, onCloseClick, data, parentKey, onUpdateParentKey }) {
  if (!show) return null;

  const TABS = useMemo(
    () => [
      { key: "requestInfo", label: "Request Details", icon: "ri-user-line", component: TransactionDetailsTab },
      {
        key: "history", label: "History", icon: "ri-shield-flash-line", component: () =>
          <HistoryList
            transactionId={data?.prepaymentId}
            useLogsQuery={useGetPrepaymentLogsQuery}
            idKey="prepaymentId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.prepaymentId}
            useFilesQuery={useGetFilesPrepaymentsQuery}
            idKey="prepaymentId"
            title="Files"
          />
      },
    ],
    [data?.prepaymentId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindPrepaymentsQuery(
    { prepaymentId: data?.prepaymentId },
    { skip: !data?.prepaymentId, refetchOnMountOrArgChange: show },
  );
  const findData = transactionData?.returnData;

  const { reset, control } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset({
      ...data,
      ...findData,
    });
    customFunction.updateState({
      data: {
        ...data,
        ...findData,
      },
    });
  }, [show, data, findData, refetch, reset]);

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
        prepaymentId={findData?.prepaymentId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Prepayment"
        show={show}
        data={state.data}
        tabs={TABS}
        buttons={BUTTONS}
        onCloseClick={onCloseClick}
        tabRefreshKey={state.tabRefreshKey}
      />
    </React.Fragment>
  );
};
