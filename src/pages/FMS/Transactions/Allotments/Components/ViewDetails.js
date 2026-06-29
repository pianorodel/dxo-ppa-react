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

import { useGetAllotmentLogsQuery } from "@/api/Endpoints/FMS/Transactions/Allotment/AllotmentLogs";
import { useFindAllotmentsQuery, useGetFilesAllotmentsQuery } from "@/api/Endpoints/FMS/Transactions/Allotment/Allotments";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Appropriation Details">
        <Row>
          <Col lg={12}>
            <InfoRow icon="bx bx-file" label="Appropriation No." value={data?.appropriationNo} />
          </Col>
        </Row>

        <Row style={{ marginBottom: "8px", paddingLeft: "12px", paddingRight: "12px" }}>
          <Col lg={3}>
            <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
              <div className="text-muted small mb-1">PS</div>
              <div className="text-primary fw-semibold">{formatAmount(data?.psAmount || 0)}</div>
            </div>
          </Col>

          <Col lg={3}>
            <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
              <div className="text-muted small mb-1">MOOE</div>
              <div className="text-warning fw-semibold">{formatAmount(data?.mooeAmount || 0)}</div>
            </div>
          </Col>

          <Col lg={3}>
            <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
              <div className="text-muted small mb-1">CO</div>
              <div className="text-success fw-semibold">{formatAmount(data?.coAmount || 0)}</div>
            </div>
          </Col>

          <Col lg={3}>
            <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
              <div className="text-muted small mb-1">FUND TYPE</div>
              <div className="text-info fw-semibold">{data?.fundingType || "SARO"}</div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={5}>
            <InfoRow icon="bx bx-layer" label="Fund Cluster" value={data?.fundClusterName} />
          </Col>
          <Col lg={3}>
            <InfoRow icon="bx bx-wallet" label="Financing Source" value={data?.financingSourceName} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-code-alt" label="Authorization Code" value={data?.authorizationCodeName} />
          </Col>
        </Row>
      </Section>

      <Section title="Allotment Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar" label="Date of Release" value={formatDate(data?.dateReleased)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-spreadsheet" label="Allotment and Budget Matrix (ABM) No." value={data?.abmNo} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-category" label="Expense Classification" value={data?.expenseClassName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-list-ul" label="UACS Object Code" value={data?.objectCodeName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-money" label="Allotment Amount" value={formatAmount(data?.allotmentAmount || 0)} />
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
            transactionId={data?.allotmentId}
            useLogsQuery={useGetAllotmentLogsQuery}
            idKey="allotmentId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.allotmentId}
            useFilesQuery={useGetFilesAllotmentsQuery}
            idKey="allotmentId"
            title="Files"
          />
      },
    ],
    [data?.allotmentId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindAllotmentsQuery(
    { allotmentId: data?.allotmentId },
    { skip: !data?.allotmentId, refetchOnMountOrArgChange: show },
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
        allotmentId={findData?.allotmentId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Allotment"
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
