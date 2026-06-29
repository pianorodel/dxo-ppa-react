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

import { useGetAppropriationLogsQuery } from "@/api/Endpoints/FMS/Transactions/Appropriation/AppropriationLogs";
import { useFindAppropriationsQuery, useGetFilesAppropriationsQuery } from "@/api/Endpoints/FMS/Transactions/Appropriation/Appropriations";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Funding Type">
        <Row style={{ marginBottom: "16px" }}>
          <Col lg={6}>
            {(() => {
              const fundingType = data?.fundingType || "SARO";
              const opt = fundingType === "SARO"
                ? { value: "SARO", label: "Special Allotment Release Order (SARO)", sub: "Auth Code 01/02/03/05 — DBM issues SARO first", icon: "bx bx-file" }
                : { value: "GAA", label: "GAA Direct Appropriation", sub: "Auth Code 04/06/07/08 — No SARO required", icon: "bx bx-checkbox-square" };
              return (
                <div
                  key={opt.value}
                  className={`funding-type-card active`}
                  style={{ pointerEvents: "none" }}
                >
                  <i className={`${opt.icon} me-2`} />
                  <span className="fw-semibold">{opt.label}</span>
                  <div className="text-muted small mt-1">{opt.sub}</div>
                </div>
              );
            })()}
          </Col>
        </Row>
      </Section>

      {(data?.fundingType || "SARO") === "SARO" && (
        <Section title="SARO Reference Details">
          <Row>
            <Col lg={6}>
              <InfoRow icon="bx bx-hash" label="SARO No." value={data?.saroNo} />
            </Col>
            <Col lg={6}>
              <InfoRow icon="bx bx-book" label="GAA Year / RA" value={data?.gaaDescription} />
            </Col>
            <Col lg={6}>
              <InfoRow icon="bx bx-calendar" label="Date of SARO" value={formatDate(data?.saroDate)} />
            </Col>
            <Col lg={6}>
              <InfoRow icon="bx bx-calendar-check" label="Date Received" value={formatDate(data?.dateReceived)} />
            </Col>
            <Col lg={6}>
              <InfoRow icon="bx bx-tag" label="Type" value={data?.appropriationType} />
            </Col>
          </Row>
        </Section>
      )}

      {(data?.fundingType || "GAA") === "GAA" && (
        <Section title="GAA / Authorization Details">
          <Row>
            <Col lg={4}>
              <InfoRow icon="bx bx-book" label="GAA / RA No." value={data?.gaaDescription} />
            </Col>
            <Col lg={4}>
              <InfoRow icon="bx bx-calendar" label="Fiscal Year" value={data?.fiscalYear} />
            </Col>
            <Col lg={4}>
              <InfoRow icon="bx bx-list-ol" label="GAA Page / Item No." value={data?.gaaPageItemNo} />
            </Col>
          </Row>
        </Section>
      )}

      <Section title="Funding Source">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-layer" label="Fund Cluster" value={data?.fundClusterName} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-wallet" label="Financing Source" value={data?.financingSourceName} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-code-alt" label="Authorization Code" value={data?.authorizationCodeName} />
          </Col>
        </Row>
      </Section>

      <Section title="Amount Breakdown by Allotment Class">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-money" label="PS - Personnel Services" value={formatAmount(data?.psAmount || 0)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-money" label="MOOE - Maint. & Other Oper. Exp." value={formatAmount(data?.mooeAmount || 0)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-money" label="CO - Capital Outlay" value={formatAmount(data?.coAmount || 0)} />
          </Col>
        </Row>
      </Section>

      <Section title="Particulars / Purpose">
        <Row>
          <Col lg={12}>
            <InfoRow icon="bx bx-note" label="Particulars / Purpose" value={data?.remarks} />
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
            transactionId={data?.appropriationId}
            useLogsQuery={useGetAppropriationLogsQuery}
            idKey="appropriationId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.appropriationId}
            useFilesQuery={useGetFilesAppropriationsQuery}
            idKey="appropriationId"
            title="Files"
          />
      },
    ],
    [data?.appropriationId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindAppropriationsQuery(
    { appropriationId: data?.appropriationId },
    { skip: !data?.appropriationId, refetchOnMountOrArgChange: show },
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
        appropriationId={findData?.appropriationId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Appropriation"
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
