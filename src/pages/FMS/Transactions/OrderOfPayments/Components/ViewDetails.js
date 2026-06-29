import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Col, Row } from "reactstrap";

import "@/assets/scss/modern-modal.css";
import HistoryList from "@/components/Common/HistoryList";
import InfoRow from "@/components/Common/Inforow";
import TransactionDetailsModal from "@/components/Common/Modals/TransactionDetailsModal";
import Section from "@/components/Common/Section";
import TransactionFilesList from "@/components/Common/TransactionFilesList";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { formatDate } from "@/helpers/date_helper";
import { formatAmount } from "@/helpers/decimal_helper";

import ActionModal from "./ActionModal";

import { useGetOrderOfPaymentLogsQuery } from "@/api/Endpoints/FMS/Transactions/OrderOfPayment/OrderOfPaymentLogs";
import { useFindOrderOfPaymentsQuery, useGetFilesOrderOfPaymentsQuery } from "@/api/Endpoints/FMS/Transactions/OrderOfPayment/OrderOfPayments";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Revenue / Fee Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-hash" label="Date of Issue" value={formatDate(data?.issueDate)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar-exclamation" label="Due Date" value={formatDate(data?.dueDate)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar-check" label="Validity Date" value={formatDate(data?.validityDate)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-receipt" label="Fee Type / Nature of Collection" value={data?.feeTypeName} />
          </Col>
        </Row>
      </Section>

      <Section title="Amount Computation">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-money" label="Principal Amount" value={formatAmount(data?.principalAmount)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-error-circle" label="Surcharge / Penalty (if any)" value={formatAmount(data?.surcharge)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-calculator" label="Total Amount Due" value={formatAmount(data?.totalAmount)} />
          </Col>
        </Row>
      </Section>

      <Section title="Payor Information">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-user" label="Payor Name / Business Name" value={data?.payorName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-id-card" label="TIN" value={data?.payorTIN} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-map" label="Address" value={data?.payorAddress} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-phone" label="Contact No." value={data?.payorContactNo} />
          </Col>
        </Row>
      </Section>

      <Section title="Particulars / Basis of Assessment">
        <Row>
          <Col lg={12}>
            <InfoRow icon="bx bx-file-blank" label="Particulars / Basis of Assessment" value={data?.particulars} />
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
            transactionId={data?.orderOfPaymentId}
            useLogsQuery={useGetOrderOfPaymentLogsQuery}
            idKey="orderOfPaymentId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.orderOfPaymentId}
            useFilesQuery={useGetFilesOrderOfPaymentsQuery}
            idKey="orderOfPaymentId"
            title="Files"
          />
      },
    ],
    [data?.orderOfPaymentId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindOrderOfPaymentsQuery(
    { orderOfPaymentId: data?.orderOfPaymentId },
    { skip: !data?.orderOfPaymentId, refetchOnMountOrArgChange: show },
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
        orderOfPaymentId={findData?.orderOfPaymentId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Order Of Payment"
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
