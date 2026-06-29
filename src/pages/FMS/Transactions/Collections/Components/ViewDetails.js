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

import { useGetCollectionLogsQuery } from "@/api/Endpoints/FMS/Transactions/Collection/CollectionLogs";
import { useFindCollectionsQuery, useGetFilesCollectionsQuery } from "@/api/Endpoints/FMS/Transactions/Collection/Collections";

function TransactionDetailsTab({ data }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Section title="Collection Mode">
        <Row style={{ marginBottom: "16px" }}>
          <Col lg={6}>
            {(() => {
              const collectionMode = data?.collectionMode || "OOP";
              const opt = collectionMode === "OOP"
                ? {
                  value: "OOP",
                  label: "Via Order of Payment (OOP)",
                  sub: "OP issued first — payor presents OP to cashier",
                  icon: "bx bx-file",
                }
                : {
                  value: "DIRECT",
                  label: "Direct / Over the Counter",
                  sub: "Walk-in / Bank Deposit / e-Payment — no OP required",
                  icon: "bx bx-checkbox-square",
                };
              return (
                <div
                  key={opt.value}
                  className={`collection-mode-card active`}
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

      {data?.collectionMode === "OOP" && (
        <>
          <Section title="Order of Payment Details">
            <Row>
              <Col lg={6}>
                <InfoRow icon="bx bx-file" label="Appropriation No." value={data?.orderOfPaymentNo} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-file" label="Fee Type" value={data?.feeTypeName} />
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

          <Section title="Amount">
            <Row>
              <Col lg={4}>
                <InfoRow icon="bx bx-money" label="Principal Amount" value={formatAmount(data?.principalAmount || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-error-circle" label="Surcharge / Penalty (if any)" value={formatAmount(data?.surcharge || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-calculator" label="Total Amount Due" value={formatAmount(data?.totalOOPAmount || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-money" label="Gross Amount Collected" value={formatAmount(data?.grossAmount || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-minus-circle" label="Tax Withheld (if applicable)" value={formatAmount(data?.taxWithheld || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-calculator" label="Net Amount" value={formatAmount(data?.netAmount || 0)} />
              </Col>
            </Row>
          </Section>
        </>
      )}

      {data?.collectionMode === "DIRECT" && (
        <>
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

          <Section title="Amount">
            <Row>
              <Col lg={4}>
                <InfoRow icon="bx bx-money" label="Gross Amount Collected" value={formatAmount(data?.grossAmount || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-minus-circle" label="Tax Withheld (if applicable)" value={formatAmount(data?.taxWithheld || 0)} />
              </Col>
              <Col lg={4}>
                <InfoRow icon="bx bx-calculator" label="Net Amount" value={formatAmount(data?.netAmount || 0)} />
              </Col>
            </Row>
          </Section>
        </>
      )}

      <Section title="Payment Details">
        <Row>
          <Col lg={6}>
            <InfoRow icon="bx bx-credit-card" label="Mode of Payment" value={data?.paymentMode} />
          </Col>
          {data?.paymentMode !== "Cash" && data?.paymentMode !== "Check" && (
            <Col lg={6}>
              <InfoRow icon="bx bx-receipt" label="Payment Reference / Transaction No." value={data?.paymentReferenceNo} />
            </Col>
          )}
          {data?.paymentMode === "Check" && (
            <>
              <Col lg={6}>
                <InfoRow icon="bx bx-building-house" label="Bank" value={data?.bankName} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-detail" label="Check Number" value={data?.checkNo} />
              </Col>
              <Col lg={6}>
                <InfoRow icon="bx bx-calendar" label="Check Date" value={data?.checkDate} />
              </Col>
            </>
          )}
        </Row>
      </Section>

      <Section title="Revenue Classification">
        <Row>
          <Col lg={12}>
            <InfoRow icon="bx bx-code-block" label="Revenue Object Code" value={data?.objectCodeName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-folder" label="Fund Cluster" value={data?.fundClusterName} />
          </Col>
          <Col lg={6}>
            <InfoRow icon="bx bx-transfer" label="Financing Source" value={data?.financingSourceName} />
          </Col>
        </Row>
      </Section>

      <Section title="Particulars">
        <Row>
          <Col lg={12}>
            <InfoRow icon="bx bx-note" label="Particulars" value={data?.particulars} />
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
            transactionId={data?.collectionId}
            useLogsQuery={useGetCollectionLogsQuery}
            idKey="collectionId"
            title="History"
          />
      },
      {
        key: "files", label: "Files", icon: "ri-folder-line", component: () =>
          <TransactionFilesList
            transactionId={data?.collectionId}
            useFilesQuery={useGetFilesCollectionsQuery}
            idKey="collectionId"
            title="Files"
          />
      },
    ],
    [data?.collectionId],
  );

  const { state, customFunction } = useCustomHook({
    tabRefreshKey: 0,
  });

  const { data: transactionData, refetch } = useFindCollectionsQuery(
    { collectionId: data?.collectionId },
    { skip: !data?.collectionId, refetchOnMountOrArgChange: show },
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
        collectionId={findData?.collectionId}
        data={state?.trxValue}
        show={state.toggle.toggleAction}
        onCloseClick={handleActions}
      />

      <TransactionDetailsModal
        title="Collection"
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
