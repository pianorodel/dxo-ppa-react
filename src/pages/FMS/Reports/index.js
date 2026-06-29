import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";

import PDFPreviewModal from "@/components/Common/PDFs/PDFPreviewModal";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { hasAccess } from "@/helpers/session_helper";

import GenerateGeneralLedgerReport from "./Accounting/GeneralLedgerReport/GenerateGeneralLedgerReport";
import GenerateStatementOfFinancialPerformanceReport from "./Accounting/StatementOfFinancialPerformanceReport/GenerateStatementOfFinancialPerformanceReport";
import GenerateStatementOfFinancialPositionReport from "./Accounting/StatementOfFinancialPositionReport/GenerateStatementOfFinancialPositionReport";
import GenerateSubsidiaryLedgerReport from "./Accounting/SubsidiaryLedgerReport/GenerateSubsidiaryLedgerReport";
import GenerateTrialBalanceReport from "./Accounting/TrialBalanceReport/GenerateTrialBalanceReport";

import Far1 from "./Budget/Far1";
import Far2 from "./Budget/Far2";
import Far3 from "./Budget/Far3";
import Rao from "./Budget/Rao";
import Raod from "./Budget/Raod";
import Rbu from "./Budget/Rbu";
import Rbud from "./Budget/Rbud";

import AcountabliltyReport from "./Disbursement/AcountabliltyReport";
import CashDisbursement from "./Disbursement/CashDisbursement";
import CheckIssued from "./Disbursement/CheckIssued";
import IndexOfPayment from "./Disbursement/IndexOfPayment";
import ScheduleDeduction from "./Disbursement/ScheduleDeduction";

// ─── Toggle & PDF maps (unchanged from original) ──────────────────────────────
const TOGGLE_MAP = {
  "Trial Balance Report": "isToggleGenerateTrialBalanceReport",
  "General Ledger Report": "isToggleGenerateGeneralLedgerReport",
  "Subsidiary Ledger Report": "isToggleSubsidiaryLedgerReport",
  "Statement of Financial Position Report": "isToggleStatementOfFinancialPositionReport",
  "Statement of Financial Performance Report": "isToggleStatementOfFinancialPerformanceReport",
};

const PDF_MAP = {
  far1: Far1, far2: Far2, far3: Far3,
  rao: Rao, rbu: Rbu, raod: Raod, rbud: Rbud,
  AcountabliltyReport, CashDisbursement, CheckIssued,
  IndexOfPayment, ScheduleDeduction,
};

// ─── Reports grouped by category ─────────────────────────────────────────────
const REPORTS = [
  {
    category: "Accounting",
    items: [
      {
        title: "Trial Balance Report",
        description: "Statement showing all accounts' debit and credit balances per COA rules to verify equality of the accounting equation.",
        icon: "ri-scales-3-line",
        color: "primary",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "General Ledger Report",
        description: "Detailed record of all account transactions and running balances in government accounting per eNGAS standards.",
        icon: "ri-book-2-line",
        color: "info",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "Subsidiary Ledger Report",
        description: "Detailed breakdown of individual components supporting and reconciling with general ledger control accounts.",
        icon: "ri-file-list-3-line",
        color: "secondary",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "Statement of Financial Position Report",
        description: "Summary of assets, liabilities, and net equity of the government agency at a specific reporting date.",
        icon: "ri-layout-column-line",
        color: "success",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "Statement of Financial Performance Report",
        description: "Summary of revenues, expenses, and net surplus or deficit for a given reporting period.",
        icon: "ri-line-chart-line",
        color: "warning",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "Statement of Cash Flow Report",
        description: "Financial report showing cash inflows and outflows from operating, investing, and financing activities.",
        icon: "ri-arrow-left-right-line",
        color: "info",
        link: "#",
        permissionTypeId: [],
      },
      {
        title: "Statement of Changes in Net Assets / Equity",
        description: "Report showing changes in owners' equity arising from net income, investments, restatements, and distributions.",
        icon: "ri-exchange-funds-line",
        color: "secondary",
        link: "#",
        permissionTypeId: [],
      },
    ],
  },
  {
    category: "Budget Execution",
    items: [
      {
        title: "FAR No. 1 — Financial Accountability Report",
        description: "Statement of Appropriations, Allotments, Obligations, Disbursements and Balances per DBM Budget Execution Documents.",
        icon: "ri-government-line",
        color: "primary",
        link: "#",
        report: "far1",
        reportName: "Financial Accountability Report (FAR No. 1)",
        permissionTypeId: [],
      },
      {
        title: "FAR No. 2 — Financial Accountability Report",
        description: "Aging of Due and Demandable Obligations — summary of unpaid obligations by age bracket.",
        icon: "ri-government-line",
        color: "primary",
        link: "#",
        report: "far2",
        reportName: "Financial Accountability Report (FAR No. 2)",
        permissionTypeId: [],
      },
      {
        title: "FAR No. 3 — Financial Accountability Report",
        description: "Monthly Statement of Disbursements — summary of all disbursements made within the reporting month.",
        icon: "ri-government-line",
        color: "primary",
        link: "#",
        report: "far3",
        reportName: "Financial Accountability Report (FAR No. 3)",
        permissionTypeId: [],
      },
      {
        title: "FAR No. 4 — Financial Accountability Report",
        description: "Summary of Obligations and Disbursements by Object of Expenditure — tracking actual spending against allotted amounts per object code.",
        icon: "ri-government-line",
        color: "primary",
        link: "#",
        report: "far4",
        reportName: "Financial Accountability Report (FAR No. 4)",
        permissionTypeId: [],
      },
      {
        title: "FAR No. 5 — Financial Accountability Report",
        description: "Quarterly Physical Report of Operations — progress of agency programs, activities, and projects against targets per DBM guidelines.",
        icon: "ri-government-line",
        color: "primary",
        link: "#",
        report: "far5",
        reportName: "Financial Accountability Report (FAR No. 5)",
        permissionTypeId: [],
      },
      {
        title: "RAO — Registry of Allotments and Obligations",
        description: "Record of government agency's budget allocation and corresponding financial commitments or obligations.",
        icon: "ri-file-paper-2-line",
        color: "warning",
        link: "#",
        report: "rao",
        reportName: "Registry of Allotments and Obligations (RAO)",
        permissionTypeId: [],
      },
      {
        title: "RBU — Registry of Budgets and Utilizations",
        description: "Record tracking a government agency's budget use, utilizations, and remaining available balances.",
        icon: "ri-file-paper-2-line",
        color: "warning",
        link: "#",
        report: "rbu",
        reportName: "Registry of Budgets and Utilizations (RBU)",
        permissionTypeId: [],
      },
      {
        title: "RAOD — Registry of Allotments, Obligations and Disbursements",
        description: "Consolidated record of budget allocations, obligations incurred, and actual disbursements made.",
        icon: "ri-file-paper-line",
        color: "info",
        link: "#",
        report: "raod",
        reportName: "Registry of Allotments, Obligations and Disbursements (RAOD)",
        permissionTypeId: [],
      },
      {
        title: "RBUD — Registry of Budget, Utilization and Disbursements",
        description: "Record tracking budget allocation, utilization, and actual disbursements for budget accountability reporting.",
        icon: "ri-file-paper-line",
        color: "info",
        link: "#",
        report: "rbud",
        reportName: "Registry of Budget, Utilization and Disbursements (RBUD)",
        permissionTypeId: [],
      },
    ],
  },
  {
    category: "Collections",
    items: [
      {
        title: "Report of Collections and Deposits",
        description: "Daily summary of all collections received and deposited to the government depository bank per COA-DBM-DOF Joint Circular 2013-1.",
        icon: "ri-safe-line",
        color: "success",
        link: "#",
        report: "ReportOfCollectionsAndDeposits",
        permissionTypeId: [],
      },
      {
        title: "Report of Accountability for Accountable Forms (RAAF)",
        description: "Tracks receipt, issuance, and remaining balance of official receipts and other accountable forms per COA Circular 2004-006.",
        icon: "ri-newspaper-line",
        color: "info",
        link: "#",
        report: "RAAF",
        permissionTypeId: [],
      },
      {
        title: "Summary of Collections by Revenue Classification",
        description: "Breakdown of collections grouped by UACS revenue code — tax, non-tax, grants — for agency income reporting and reconciliation.",
        icon: "ri-pie-chart-line",
        color: "primary",
        link: "#",
        report: "SummaryCollectionsByRevenue",
        permissionTypeId: [],
      },
      {
        title: "Subsidiary Ledger — Revenue",
        description: "Detailed per-account record of revenue collections reconciling with the general ledger revenue control accounts per eNGAS.",
        icon: "ri-file-list-3-line",
        color: "secondary",
        link: "#",
        report: "SubsidiaryLedgerRevenue",
        permissionTypeId: [],
      },
      {
        title: "Collector's Official Receipt Register",
        description: "Sequential listing of all official receipts issued by authorized collecting officers, for audit trail and shortage detection.",
        icon: "ri-receipt-line",
        color: "warning",
        link: "#",
        report: "OfficialReceiptRegister",
        permissionTypeId: [],
      },
      {
        title: "Remittance Advice",
        description: "Document evidencing remittance of collected funds to the National Treasury or depository bank per DBM and BTr guidelines.",
        icon: "ri-send-plane-2-line",
        color: "info",
        link: "#",
        report: "RemittanceAdvice",
        permissionTypeId: [],
      },
      {
        title: "Aging of Accounts Receivable",
        description: "Summary of outstanding receivables grouped by age bracket — 30, 60, 90, 120+ days — for collectibility assessment and provisioning.",
        icon: "ri-timer-flash-line",
        color: "danger",
        link: "#",
        report: "AgingAccountsReceivable",
        permissionTypeId: [],
      },
    ],
  },
  {
    category: "Disbursements",
    items: [
      {
        title: "Checks Issued",
        description: "Summary report of all checks issued within a period — payee, amount, check number, and bank account details.",
        icon: "ri-bank-card-line",
        color: "success",
        link: "#",
        report: "CheckIssued",
        permissionTypeId: [],
      },
      {
        title: "Cash Disbursements",
        description: "Record of all cash disbursements made — amount, payee, purpose, and supporting document references.",
        icon: "bx bx-money",
        color: "warning",
        link: "#",
        report: "CashDisbursement",
        permissionTypeId: [],
      },
      {
        title: "Schedule of Deductions",
        description: "Summary of all deductions withheld from payments including withholding taxes, GSIS, PhilHealth, and Pag-IBIG.",
        icon: "ri-subtract-line",
        color: "danger",
        link: "#",
        report: "ScheduleDeduction",
        permissionTypeId: [],
      },
      {
        title: "Index of Payments",
        description: "Comprehensive listing of all payments made, organized by payee or creditor, for audit trail and COA reconciliation.",
        icon: "ri-list-ordered-2",
        color: "info",
        link: "#",
        report: "IndexOfPayment",
        permissionTypeId: [],
      },
      {
        title: "Accountability for Accountable Forms",
        description: "Report tracking the receipt, issuance, and accountability of pre-numbered accountable forms per COA rules.",
        icon: "ri-newspaper-line",
        color: "secondary",
        link: "#",
        report: "AcountabliltyReport",
        permissionTypeId: [],
      },
      {
        title: "Due and Demandable Accounts Payable",
        description: "List of accounts payable obligations that are already due and legally demandable for payment.",
        icon: "ri-timer-flash-line",
        color: "danger",
        link: "#",
        permissionTypeId: [],
      },
    ],
  },
];

const ALL_TAGS = ["All", ...REPORTS.map(g => g.category)];

const COLOR_MAP = {
  primary: { bg: "var(--vz-primary-bg-subtle)", text: "var(--vz-primary)", border: "var(--vz-primary)" },
  success: { bg: "var(--vz-success-bg-subtle)", text: "var(--vz-success)", border: "var(--vz-success)" },
  info: { bg: "var(--vz-info-bg-subtle)", text: "var(--vz-info)", border: "var(--vz-info)" },
  warning: { bg: "var(--vz-warning-bg-subtle)", text: "var(--vz-warning)", border: "var(--vz-warning)" },
  danger: { bg: "var(--vz-danger-bg-subtle)", text: "var(--vz-danger)", border: "var(--vz-danger)" },
  secondary: { bg: "var(--vz-secondary-bg-subtle)", text: "var(--vz-secondary)", border: "var(--vz-secondary)" },
};

const stripHtml = s => s.replace(/<[^>]+>/g, "");

const DesktopView = () => {
  const { state, customFunction } = useCustomHook();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const togglePreviewReport = useCallback((item) => {
    customFunction.updateToggle("isTogglePreviewReport", item);
  }, [customFunction.updateToggle]);

  const handleGenerateReport = useCallback((reportTitle) => {
    const toggleKey = TOGGLE_MAP[reportTitle];
    if (toggleKey) customFunction.updateToggle(toggleKey);
  }, [customFunction.updateToggle]);

  const handleClick = useCallback((item) => {
    if (item.report) togglePreviewReport(item);
    else handleGenerateReport(item.title);
  }, [togglePreviewReport, handleGenerateReport]);

  const getModalTitle = (item) =>
    item?.reportName ?? stripHtml(item?.title ?? "");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return REPORTS.map(group => ({
      ...group,
      items: group.items
        .filter(item => !item.permissionTypeId || hasAccess(item.permissionTypeId))
        .filter(item => activeTag === "All" || group.category === activeTag)
        .filter(item => !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)),
    })).filter(group => group.items.length > 0);
  }, [search, activeTag]);

  const totalVisible = filtered.reduce((s, g) => s + g.items.length, 0);
  const totalAll = REPORTS.reduce((s, g) => s + g.items.filter(i => !i.permissionTypeId || hasAccess(i.permissionTypeId)).length, 0);

  return (
    <React.Fragment>
      {/* ── Modals (all logic preserved from original) ─────────────────── */}
      {state.toggle.isTogglePreviewReport && (
        <PDFPreviewModal
          modalTitle={getModalTitle(state?.trxValue)}
          show={true}
          DocumentComponent={PDF_MAP[state?.trxValue?.report]}
          onCloseClick={togglePreviewReport}
        />
      )}
      {state.toggle.isToggleGenerateTrialBalanceReport && (
        <GenerateTrialBalanceReport show={true} onCloseClick={() => handleGenerateReport("Trial Balance Report")} />
      )}
      {state.toggle.isToggleSubsidiaryLedgerReport && (
        <GenerateSubsidiaryLedgerReport show={true} onCloseClick={() => handleGenerateReport("Subsidiary Ledger Report")} />
      )}
      {state.toggle.isToggleStatementOfFinancialPositionReport && (
        <GenerateStatementOfFinancialPositionReport show={true} onCloseClick={() => handleGenerateReport("Statement of Financial Position Report")} />
      )}
      {state.toggle.isToggleGenerateGeneralLedgerReport && (
        <GenerateGeneralLedgerReport show={true} onCloseClick={() => handleGenerateReport("General Ledger Report")} />
      )}
      {state.toggle.isToggleStatementOfFinancialPerformanceReport && (
        <GenerateStatementOfFinancialPerformanceReport show={true} onCloseClick={() => handleGenerateReport("Statement of Financial Performance Report")} />
      )}

      <div className="page-content">
        <Container fluid>

          {/* ── Hero header ─────────────────────────────────────────── */}
          <Card className="border-0 overflow-hidden mb-4"
            style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 45%, #0ab39c 100%)", minHeight: 110 }}>
            <CardBody className="p-4">
              <Row className="align-items-center">
                <Col md={7}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                      <i className="ri-file-chart-line text-white" style={{ fontSize: "1.4rem" }}></i>
                    </div>
                    <div>
                      <h4 className="text-white fw-bold mb-1" style={{ fontSize: "1.2rem" }}>FMS Reports</h4>
                      <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>
                        {totalAll} report templates available · Select and generate any report below
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={5} className="mt-3 mt-md-0">
                  <div className="search-box" style={{ position: "relative" }}>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Search reports…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        color: "#212529",
                        fontSize: "0.85rem",
                        paddingLeft: 36,
                      }}
                    />
                    <i className="ri-search-line search-icon" style={{ color: "#6c757d" }}></i>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ── Category filter chips ────────────────────────────────── */}
          <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
            <span className="text-muted fw-semibold me-1" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Filter:</span>
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`btn btn-sm rounded-pill ${activeTag === tag ? "btn-primary" : "btn-soft-secondary"}`}
                style={{ fontSize: "0.75rem" }}>
                {tag}
              </button>
            ))}
            <span className="ms-auto text-muted" style={{ fontSize: "0.78rem" }}>
              Showing <strong>{totalVisible}</strong> of <strong>{totalAll}</strong> reports
            </span>
          </div>

          {/* ── Report groups ────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardBody className="text-center py-5">
                <i className="ri-file-search-line d-block mb-3 opacity-25" style={{ fontSize: "3rem" }}></i>
                <h5 className="fw-semibold text-muted">No reports found</h5>
                <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>Try adjusting your search or filter.</p>
                <button className="btn btn-sm btn-soft-primary" onClick={() => { setSearch(""); setActiveTag("All"); }}>
                  <i className="ri-refresh-line me-1"></i>Clear Filters
                </button>
              </CardBody>
            </Card>
          ) : (
            filtered.map(group => (
              <div key={group.category} className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: "var(--vz-primary)" }}></div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {group.category}
                  </h6>
                  <span className="badge bg-primary-subtle text-primary rounded-pill ms-1" style={{ fontSize: "0.68rem" }}>
                    {group.items.length}
                  </span>
                </div>

                <Row className="g-3">
                  {group.items.map((item, idx) => {
                    const clr = COLOR_MAP[item.color] ?? COLOR_MAP.primary;
                    return (
                      <Col key={idx} xl={3} lg={4} md={6}>
                        <Card className="border-0 shadow-sm mb-0 h-100 card-animate"
                          style={{ overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>

                          <div style={{ height: 3, background: clr.border, width: "100%" }}></div>

                          <CardBody className="p-4 d-flex flex-column">
                            <div className="d-flex align-items-start justify-content-between mb-3">
                              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 46, height: 46, background: clr.bg }}>
                                <i className={item.icon} style={{ color: clr.text, fontSize: "1.3rem" }}></i>
                              </div>
                              <span className="rounded-pill px-2 py-1 fw-semibold"
                                style={{ fontSize: "0.65rem", background: clr.bg, color: clr.text, letterSpacing: "0.04em" }}>
                                {group.category}
                              </span>
                            </div>

                            <h6 className="fw-bold mb-2" style={{ fontSize: "0.88rem", lineHeight: 1.35 }}>
                              {item.title}
                            </h6>
                            <p className="text-muted mb-0 flex-grow-1" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                              {item.description}
                            </p>

                            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--vz-border-color)" }}>
                              <Link
                                to={item.link}
                                onClick={() => handleClick(item)}
                                className={`btn btn-sm w-100 btn-${item.color}`}
                                style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                                <i className="ri-file-download-line me-1"></i>
                                Generate Report
                              </Link>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DesktopView;