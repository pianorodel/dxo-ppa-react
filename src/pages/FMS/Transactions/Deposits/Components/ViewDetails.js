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

import { useGetDepositLogsQuery } from "@/api/Endpoints/FMS/Transactions/Deposit/DepositLogs";
import { useFindDepositsQuery, useGetFilesDepositsQuery } from "@/api/Endpoints/FMS/Transactions/Deposit/Deposits";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Deposit Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-receipt" label="Deposit Slip No." value={data?.depositSlipNo} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-calendar" label="Date of Deposit" value={formatDate(data?.depositDate)} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-transfer" label="Deposit Mode / Bank Account Type" value={data?.depositMode} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-building" label="Bank" value={data?.bankName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-map-pin" label="Bank Branch" value={data?.bankBranchName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-credit-card" label="Agency Deposit Account No." value={data?.agencyDepositAccountNo} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-check-shield" label="Bank Teller / Validation Reference" value={data?.validationReferenceNo} />
          </Col>
        </Row>
      </Section>

      <Section title="Funding Classification (UACS)">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-folder" label="Fund Cluster" value={data?.fundClusterName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-coin-stack" label="Financing Source" value={data?.financingSourceName} />
          </Col>
        </Row>
      </Section>

      <Section title="Amount">
        <Row>
          <Col lg={4}>
            <InfoRow icon="bx bx-money" label="Cash Deposited" value={formatAmount(data?.cashDeposited || 0)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-credit-card-alt" label="Checks Deposited" value={formatAmount(data?.checksDeposited || 0)} />
          </Col>
          <Col lg={4}>
            <InfoRow icon="bx bx-calculator" label="Total Deposit Amount" value={formatAmount(data?.totalDepositAmount || 0)} />
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
            transactionId={data?.depositId}
            useLogsQuery={useGetDepositLogsQuery}
            idKey="depositId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.depositId}
            useFilesQuery={useGetFilesDepositsQuery}
            idKey="depositId"
            title="Files"
          />
      },
    ],
    [data?.depositId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindDepositsQuery(
    { depositId: data?.depositId },
    { skip: !data?.depositId, refetchOnMountOrArgChange: show },
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
        depositId={findData?.depositId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Deposit"
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
