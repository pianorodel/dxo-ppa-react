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

import { useGetObligationLogsQuery } from "@/api/Endpoints/FMS/Transactions/Obligation/ObligationLogs";
import { useFindObligationsQuery, useGetFilesObligationsQuery } from "@/api/Endpoints/FMS/Transactions/Obligation/Obligations";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Allotment Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-receipt" label="Allotment" value={data?.allotmentNo || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-building" label="Appropriation Source" value={data?.appropriationSource || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-money" label="Allotment Amount" value={formatAmount(data?.allotmentAmount || 0)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-money" label="Obligated Amount" value={formatAmount(data?.obligatedAmount || 0)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-category" label="Allotment Class" value={data?.allotmentClass || "--"} />
          </Col>

          <Col lg={6}>
            <InfoRow icon="bx bx-layer" label="Fund Cluster" value={data?.fundClusterName || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-transfer" label="Financing Source" value={data?.financingSourceName || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-key" label="Authorization Code" value={data?.authorizationCodeName || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-code-alt" label="Object Code" value={data?.objectCodeName || "--"} />
          </Col>
        </Row>
      </Section>

      <Section title="Payee / Supplier">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-user" label="Payee Name" value={data?.payeeName || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-id-card" label="TIN" value={data?.payeeTIN || "--"} />
          </Col>
          <Col lg={12}>
            <InfoRow icon="bx bx-file-blank" label="Particulars / Description" value={data?.particulars || "--"} />
          </Col>
        </Row>
      </Section>

      <Section title="Supporting Document Reference">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-purchase-tag" label="Purchase Order (PO) No." value={data?.poNo || "--"} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-notepad" label="Contract No." value={data?.contractNo || "--"} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-wrench" label="Work Order No." value={data?.workOrderNo || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar" label="PO / Contract Date" value={formatDate(data?.poContractDate) || "--"} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar-check" label="Delivery / Completion Date" value={formatDate(data?.deliveryDate) || "--"} />
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
            transactionId={data?.obligationId}
            useLogsQuery={useGetObligationLogsQuery}
            idKey="obligationId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.obligationId}
            useFilesQuery={useGetFilesObligationsQuery}
            idKey="obligationId"
            title="Files"
          />
      },
    ],
    [data?.obligationId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindObligationsQuery(
    { obligationId: data?.obligationId },
    { skip: !data?.obligationId, refetchOnMountOrArgChange: show },
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
        obligationId={findData?.obligationId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Obligation"
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
