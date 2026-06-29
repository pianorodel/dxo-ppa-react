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

import ActionModal from "./ActionModal";

import { useGetLDDAPLogsQuery } from "@/api/Endpoints/FMS/Transactions/LDDAP/LDDAPLogs";
import { useFindLDDAPsQuery, useGetFilesLDDAPsQuery } from "@/api/Endpoints/FMS/Transactions/LDDAP/LDDAPs";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Request Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar" label="Date Prepared" value={formatDate(data?.datePrepared)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-credit-card" label="MDS Account No." value={data?.mdsAccountNo} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-layer" label="Fund Cluster" value={data?.fundClusterName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-wallet" label="Financing Source" value={data?.financingSourceName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar-check" label="Period Covered — From" value={formatDate(data?.periodDateFrom)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar-x" label="Period Covered — To" value={formatDate(data?.periodDateTo)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-buildings" label="Servicing Bank / Branch" value={data?.bankBranchName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-file" label="DBM Reference / NCA No." value={data?.dbmReferenceNo} />
          </Col>
        </Row>
      </Section>

      <Section title="Certification / Signatories">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-user" label="Prepared By" value={data?.createdByName} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-user-check" label="Certified By" value={data?.certifiedBy} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-shield-check" label="Approved / Authorized By" value={data?.approvedAuthorizedBy} />
          </Col>
        </Row>
      </Section>

      <Section title="Remarks / Special Instructions">
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
            transactionId={data?.lddapId}
            useLogsQuery={useGetLDDAPLogsQuery}
            idKey="lddapId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.lddapId}
            useFilesQuery={useGetFilesLDDAPsQuery}
            idKey="lddapId"
            title="Files"
          />
      },
    ],
    [data?.lddapId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindLDDAPsQuery(
    { lddapId: data?.lddapId },
    { skip: !data?.lddapId, refetchOnMountOrArgChange: show },
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
        lddapId={findData?.lddapId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="LDDAP-ADA"
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
