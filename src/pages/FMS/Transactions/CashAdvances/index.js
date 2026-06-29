import BreadCrumb from "@/components/Common/BreadCrumb";
import ModernModal from "@/components/Common/Modals/ModernModal";
import PDFPreviewModal from "@/components/Common/PDFs/PDFPreviewModal";
import Section from "@/components/Common/Section";
import CashAdvanceRCAPDF from "./CashAdvanceRCAPDF";
import * as moment from "moment";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import {
    Badge, Button,
    Card, CardBody, CardHeader,
    Col,
    Collapse,
    Container,
    Input,
    Progress,
    Row,
} from "reactstrap";

import auditlogsImage from "@/assets/images/auditlogs.png";
import avatar2 from "@/assets/images/users/avatar-2.jpg";
import avatar6 from "@/assets/images/users/avatar-6.jpg";
import avatar8 from "@/assets/images/users/avatar-8.jpg";

// ─── Reference data ───────────────────────────────────────────────────────────
var FUND_CLUSTERS = {
    "01": "Regular Agency Fund",
    "02": "Foreign-Assisted Projects Fund",
    "03": "Special Account in the General Fund",
    "04": "Internally Generated Funds",
    "05": "Business-Related Funds",
};

var UACS_OBJECTS = {
    "5-02-01-010": "Traveling Expenses – Local",
    "5-02-01-020": "Traveling Expenses – Foreign",
    "5-02-02-010": "Training Expenses",
    "5-02-03-010": "Office Supplies Expense",
    "5-02-03-090": "Other Supplies and Materials Expenses",
    "5-02-12-010": "Other Maintenance and Operating Expenses",
};

var STATUS_CFG = {
    "Draft":      { color: "secondary", icon: "ri-draft-line" },
    "Submitted":  { color: "warning",   icon: "ri-send-plane-line" },
    "Approved":   { color: "info",      icon: "ri-checkbox-circle-line" },
    "Liquidated": { color: "success",   icon: "ri-verified-badge-line" },
    "Cancelled":  { color: "danger",    icon: "ri-close-circle-line" },
};

var CA_PURPOSES = ["Official Travel", "Training / Seminar", "Office Supplies", "Special Activity", "Field Operations", "Other"];

var DEPARTMENTS = ["Accounting Division", "Budget Division", "General Services", "Engineering Division", "MIS Division", "Administrative Division"];

var ACCOUNTABLE_OFFICERS = [
    { name: "Roland Acuesta",  position: "Chief Accountant",               department: "Accounting Division" },
    { name: "Maria Santos",    position: "Budget Officer II",              department: "Budget Division" },
    { name: "Juan Dela Cruz",  position: "Administrative Officer IV",      department: "General Services" },
    { name: "Bethany Johnson", position: "Engineer II",                    department: "Engineering Division" },
    { name: "Lucas Snipe",     position: "Information Systems Analyst II", department: "MIS Division" },
    { name: "Ana Reyes",       position: "Accountant II",                  department: "Accounting Division" },
];

var ACTION_COLOR = { Approved: "success", Submitted: "warning", Draft: "secondary", Liquidated: "info", Cancelled: "danger" };

// ─── Mock data ────────────────────────────────────────────────────────────────
var MOCK_DATA = [
    {
        id: 1, refNo: "CA-2025-06-00001", date: "2025-06-02",
        accountable: "Roland Acuesta", position: "Chief Accountant", department: "Accounting Division",
        purpose: "Official Travel", destination: "Cebu City – Regional COA Conference 2025",
        travelDates: "Jun 10–13, 2025", uacsObject: "5-02-01-010", fundCluster: "01",
        amount: 45000.00, liquidated: 0.00, status: "Approved",
        dvRefNo: "DV-2025-06-00045", orNo: null,
        remarks: "Approved by the Head of Agency. DV prepared.",
        modifiedDate: "2025-06-05T08:30:00.000Z", modifiedBy: "Admin User",
    },
    {
        id: 2, refNo: "CA-2025-06-00002", date: "2025-06-03",
        accountable: "Maria Santos", position: "Budget Officer II", department: "Budget Division",
        purpose: "Training / Seminar", destination: "DBM Training Center, Batasan, Quezon City",
        travelDates: "Jun 14–15, 2025", uacsObject: "5-02-02-010", fundCluster: "01",
        amount: 12500.00, liquidated: 12500.00, status: "Liquidated",
        dvRefNo: "DV-2025-06-00038", orNo: "OR-2025-00871",
        remarks: "Fully liquidated. OR issued.",
        modifiedDate: "2025-06-10T11:00:00.000Z", modifiedBy: "Maria Santos",
    },
    {
        id: 3, refNo: "CA-2025-05-00023", date: "2025-05-20",
        accountable: "Juan Dela Cruz", position: "Administrative Officer IV", department: "General Services",
        purpose: "Office Supplies", destination: "Various Suppliers – Metro Manila",
        travelDates: "May 21, 2025", uacsObject: "5-02-03-010", fundCluster: "01",
        amount: 8750.00, liquidated: 0.00, status: "Submitted",
        dvRefNo: null, orNo: null, remarks: "Awaiting approval.",
        modifiedDate: "2025-05-20T09:15:00.000Z", modifiedBy: "Juan Dela Cruz",
    },
    {
        id: 4, refNo: "CA-2025-06-00003", date: "2025-06-06",
        accountable: "Bethany Johnson", position: "Engineer II", department: "Engineering Division",
        purpose: "Field Operations", destination: "Inspection of infrastructure projects – Region IV-A",
        travelDates: "Jun 16–20, 2025", uacsObject: "5-02-12-010", fundCluster: "01",
        amount: 28000.00, liquidated: 0.00, status: "Draft",
        dvRefNo: null, orNo: null, remarks: "",
        modifiedDate: "2025-06-06T14:00:00.000Z", modifiedBy: "Bethany Johnson",
    },
    {
        id: 5, refNo: "CA-2025-04-00011", date: "2025-04-08",
        accountable: "Lucas Snipe", position: "Information Systems Analyst II", department: "MIS Division",
        purpose: "Training / Seminar", destination: "DICT Training Facility, Diliman, Quezon City",
        travelDates: "Apr 10–12, 2025", uacsObject: "5-02-02-010", fundCluster: "01",
        amount: 9500.00, liquidated: 9500.00, status: "Liquidated",
        dvRefNo: "DV-2025-04-00019", orNo: "OR-2025-00622", remarks: "Fully liquidated.",
        modifiedDate: "2025-04-18T10:30:00.000Z", modifiedBy: "Admin User",
    },
    {
        id: 6, refNo: "CA-2025-06-00004", date: "2025-06-09",
        accountable: "Ana Reyes", position: "Accountant II", department: "Accounting Division",
        purpose: "Special Activity", destination: "Annual Agency Planning Workshop – Tagaytay City",
        travelDates: "Jun 25–27, 2025", uacsObject: "5-02-12-010", fundCluster: "01",
        amount: 32000.00, liquidated: 0.00, status: "Approved",
        dvRefNo: "DV-2025-06-00061", orNo: null, remarks: "DV processed. Awaiting release.",
        modifiedDate: "2025-06-09T16:00:00.000Z", modifiedBy: "Admin User",
    },
];

var HISTORY = [
    { avatar: avatar6, name: "Roland Acuesta", action: "Approved",  date: "05 Jun 2025, 10:30 AM", note: "Cash advance approved by the Head of Agency. DV prepared for payment." },
    { avatar: avatar2, name: "Admin User",      action: "Submitted", date: "03 Jun 2025, 09:15 AM", note: "Cash advance request submitted for review." },
    { avatar: avatar8, name: "Roland Acuesta", action: "Draft",     date: "02 Jun 2025, 04:20 PM", note: "Initial cash advance request created." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPeso(n) {
    return "₱" + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
}
function fmtDate(d) { return moment(new Date(d)).format("DD MMM YYYY"); }
function fmtTime(d) { return moment(new Date(d)).format("hh:mm A"); }
function initials(name) {
    var p = name.split(" ");
    return (p[0].charAt(0) + (p[p.length - 1] || "").charAt(0)).toUpperCase();
}

// ─── Form helpers ─────────────────────────────────────────────────────────────
function FLabel({ children }) {
    return (
        <label className="form-label text-uppercase fw-semibold text-muted mb-1"
            style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>
            {children}
        </label>
    );
}
function FInput({ value, onChange, placeholder, type = "text", disabled }) {
    return (
        <input type={type} className="form-control form-control-sm" value={value ?? ""}
            onChange={e => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled} />
    );
}
function FSelect({ value, onChange, options }) {
    return (
        <select className="form-select form-select-sm" value={value ?? ""}
            onChange={e => onChange?.(e.target.value)}>
            {options.map(o =>
                typeof o === "string"
                    ? <option key={o} value={o}>{o}</option>
                    : <option key={o.value} value={o.value}>{o.label}</option>
            )}
        </select>
    );
}
function FField({ label, children, col }) {
    const inner = <div className="mb-3"><FLabel>{label}</FLabel>{children}</div>;
    return col ? <Col md={col}>{inner}</Col> : inner;
}

// ─── Audit Logs Modal ─────────────────────────────────────────────────────────
function ModernAuditLogsModal({ show, title, subTitle, statusName, statusColor, history, onClose }) {
    const [fullscreen, setFullscreen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!show) { setFullscreen(false); setSearch(""); }
    }, [show]);

    if (!show) return null;

    const filtered = history.filter(h =>
        !search.trim() ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.note.toLowerCase().includes(search.toLowerCase()) ||
        h.action.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`} style={{ zIndex: 1400 }}>
            <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`} style={{ width: fullscreen ? "" : "600px" }}>

                {/* Header */}
                <div className="emd-hdr">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
                        <div className="emd-avatar-wrap">
                            <img src={auditlogsImage} style={{ height: 55 }} alt="Audit Logs" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                                    {title || "Activity History"}
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{subTitle}</span>
                                {statusName && (
                                    <span style={{
                                        display: "inline-flex", alignItems: "center",
                                        padding: "2px 8px", borderRadius: 3,
                                        fontSize: 11, fontWeight: 700,
                                        background: "rgba(255,255,255,0.18)", color: "#fff",
                                        letterSpacing: "0.4px", textTransform: "uppercase",
                                    }}>{statusName}</span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                            <button className="emd-icon-btn"
                                onClick={() => setFullscreen(f => !f)}
                                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                                <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
                            </button>
                            <button className="emd-icon-btn emd-close" onClick={onClose} title="Close">
                                <i className="ri-close-line" style={{ fontSize: 17 }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="emd-body">
                    <div className="search-box mb-3">
                        <Input className="search bg-light border-light"
                            placeholder="Search by name, action, or note..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            style={{ fontSize: "0.82rem" }} />
                        <i className="ri-search-line search-icon"></i>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="ri-inbox-line d-block fs-1 mb-2 opacity-25"></i>
                            <p className="fw-medium mb-0" style={{ fontSize: "0.85rem" }}>No history found.</p>
                        </div>
                    ) : (
                        <div className="acitivity-timeline">
                            {filtered.map((h, i) => (
                                <div key={i} className={"acitivity-item d-flex " + (i < filtered.length - 1 ? "py-3" : "pt-3 pb-0")}>
                                    <div className="flex-shrink-0">
                                        <img src={h.avatar} alt={h.name}
                                            className="avatar-xs rounded-circle acitivity-avatar"
                                            style={{ width: 36, height: 36, objectFit: "cover" }} />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                            <span className="fw-semibold" style={{ fontSize: "0.84rem" }}>{h.name}</span>
                                            <span className={"badge bg-" + (ACTION_COLOR[h.action] || "secondary") + "-subtle text-" + (ACTION_COLOR[h.action] || "secondary") + " rounded-pill"}
                                                style={{ fontSize: "0.66rem" }}>
                                                {h.action}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-1" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{h.note}</p>
                                        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "0.72rem" }}>
                                            <i className="ri-time-line"></i>
                                            <span>{h.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="emd-ftr">
                    <span style={{ fontSize: 12, color: "var(--vz-text-muted)", fontWeight: 500 }}>
                        {filtered.length} of {history.length} entries
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="emd-btn emd-btn-light emd-btn-sm" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose, onLiquidate, onApprove }) {
    const [showAuditLogs, setShowAuditLogs] = useState(false);
    const [showPrint, setShowPrint]         = useState(false);

    // useMemo produces a stable component reference that closes over item.
    // PDFPreviewModal calls <DocumentComponent /> with no props —
    // the data is frozen into the component definition itself.
    const BoundRCAPDF = useMemo(() => {
        if (!item) return null;
        const snapshot = { ...item }; // freeze current values
        const Component = () => (
            <CashAdvanceRCAPDF
                pdfTitle={`RCA \u2014 ${snapshot.refNo}`}
                data={snapshot}
            />
        );
        Component.displayName = "BoundRCAPDF";
        return Component;
    }, [item]);

    if (!item) return null;

    var balance = item.amount - item.liquidated;
    var liqPct  = item.amount > 0 ? Math.round((item.liquidated / item.amount) * 100) : 0;
    var scfg    = STATUS_CFG[item.status] || STATUS_CFG.Draft;

    return (
        <>
            {showPrint && (
                <PDFPreviewModal
                    modalTitle="Report of Cash Advance (RCA)"
                    show={true}
                    DocumentComponent={BoundRCAPDF}
                    onCloseClick={() => setShowPrint(false)}
                />
            )}

            <ModernAuditLogsModal
                show={showAuditLogs}
                title="Activity History"
                subTitle={item.refNo}
                statusName={item.status}
                statusColor={scfg.color}
                history={HISTORY}
                onClose={() => setShowAuditLogs(false)}
            />

            <ModernModal
                isProcess={true}
                title={`Cash Advance — ${item.refNo}`}
                isOpen={true}
                onClose={onClose}
                width="980px"
                isSaving={false}
                modifiedDate={item.modifiedDate}
                canSave={false}
                footerContent={
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <Badge color={scfg.color} className="rounded-pill me-1" style={{ fontSize: "0.7rem" }}>
                            <i className={scfg.icon + " me-1"}></i>{item.status}
                        </Badge>
                        {item.status === "Approved" && (
                            <Button color="success" size="sm" className="d-flex align-items-center gap-1"
                                onClick={() => onLiquidate(item)}>
                                <i className="ri-verified-badge-line"></i>
                                <span style={{ fontSize: "0.8rem" }}>Liquidate</span>
                            </Button>
                        )}
                        {(item.status === "Draft" || item.status === "Submitted") && (
                            <Button color="warning" size="sm" className="d-flex align-items-center gap-1"
                                onClick={() => onApprove(item)}>
                                <i className="ri-check-double-line"></i>
                                <span style={{ fontSize: "0.8rem" }}>Approve</span>
                            </Button>
                        )}
                        <Button color="light" size="sm" className="d-flex align-items-center gap-1"
                            onClick={() => setShowPrint(true)}>
                            <i className="ri-printer-line"></i>
                            <span style={{ fontSize: "0.8rem" }}>Print RCA</span>
                        </Button>
                        <Button color="secondary" size="sm" className="d-flex align-items-center gap-1"
                            onClick={() => setShowAuditLogs(true)}>
                            <i className="ri-history-line"></i>
                            <span style={{ fontSize: "0.8rem" }}>Audit Logs</span>
                        </Button>
                    </div>
                }
            >
                {/* Summary strip */}
                <Row className="g-3 mb-1">
                    {[
                        { label: "Amount Granted",   value: fmtPeso(item.amount),     icon: "ri-money-dollar-box-fill", color: "primary" },
                        { label: "Liquidated",        value: fmtPeso(item.liquidated), icon: "ri-verified-badge-fill",   color: "success" },
                        { label: "Unliquidated Bal.", value: fmtPeso(balance),         icon: "ri-time-fill",             color: balance > 0 ? "warning" : "success" },
                        { label: "Liquidation",       value: liqPct + "% done",        icon: "ri-pie-chart-fill",        color: "info" },
                    ].map(s => (
                        <Col key={s.label} xl={3} sm={6}>
                            <Card className="border-0 shadow-sm mb-0">
                                <CardBody className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>{s.label}</p>
                                            <h5 className="mb-0 fw-bold ff-secondary">{s.value}</h5>
                                        </div>
                                        <div className={"bg-" + s.color + "-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 42, height: 42 }}>
                                            <i className={s.icon + " text-" + s.color + " fs-3"}></i>
                                        </div>
                                    </div>
                                    {s.label === "Liquidation" && (
                                        <div className="mt-2">
                                            <Progress value={liqPct} color={liqPct === 100 ? "success" : "warning"} style={{ height: 5, borderRadius: 3 }} />
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* CA details — full width, 2-column info grid */}
                <Row className="g-3 mt-0">
                    <Col lg={12}>
                        <Section title="Cash Advance Information">
                            {/* Accountable Officer */}
                            <div className="p-3 rounded-3 mb-3"
                                style={{ background: "var(--vz-primary-bg-subtle)", border: "1px solid var(--vz-primary-border-subtle)" }}>
                                <p className="text-uppercase fw-semibold text-primary mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>
                                    <i className="ri-user-star-line me-1"></i>Accountable Officer
                                </p>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: 44, height: 44 }}>
                                        <span className="fw-bold text-primary" style={{ fontSize: "0.82rem" }}>{initials(item.accountable)}</span>
                                    </div>
                                    <div>
                                        <p className="mb-0 fw-bold" style={{ fontSize: "0.92rem" }}>{item.accountable}</p>
                                        <p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>{item.position} &middot; {item.department}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info grid — 2 columns */}
                            <Row className="g-0">
                                {[
                                    { label: "Purpose",                value: item.purpose,                                                       icon: "ri-flag-line" },
                                    { label: "Destination / Activity", value: item.destination,                                                    icon: "ri-map-pin-line" },
                                    { label: "Travel / Activity Dates",value: item.travelDates,                                                    icon: "ri-calendar-event-line" },
                                    { label: "UACS Object Code",       value: item.uacsObject + " — " + (UACS_OBJECTS[item.uacsObject] || "—"),   icon: "ri-price-tag-3-line" },
                                    { label: "Fund Cluster",           value: item.fundCluster + " — " + (FUND_CLUSTERS[item.fundCluster] || "—"), icon: "ri-bank-line" },
                                    { label: "DV Reference No.",       value: item.dvRefNo || "—",                                                icon: "ri-file-list-3-line" },
                                    { label: "OR Number",              value: item.orNo || "—",                                                   icon: "ri-receipt-line" },
                                    { label: "Remarks",                value: item.remarks || "—",                                                icon: "ri-chat-3-line" },
                                ].map(row => (
                                    <Col key={row.label} sm={6}>
                                        <div className="d-flex gap-3 mb-3 pb-3 pe-3"
                                            style={{ borderBottom: "0.5px solid var(--vz-border-color)" }}>
                                            <div className="bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: 32, height: 32, marginTop: 2 }}>
                                                <i className={row.icon + " text-muted"} style={{ fontSize: "0.85rem" }}></i>
                                            </div>
                                            <div>
                                                <p className="text-uppercase fw-semibold text-muted mb-0" style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>{row.label}</p>
                                                <p className="mb-0 fw-medium" style={{ fontSize: "0.85rem" }}>{row.value}</p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {/* Liquidation summary */}
                            {item.status !== "Draft" && (
                                <div className="p-3 rounded-3" style={{ background: "var(--vz-light)" }}>
                                    <p className="text-uppercase fw-semibold text-muted mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>
                                        <i className="ri-pie-chart-line me-1"></i>Liquidation Summary
                                    </p>
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.78rem" }}>
                                        <span className="text-muted">Granted: <strong>{fmtPeso(item.amount)}</strong></span>
                                        <span className={"fw-semibold " + (balance > 0 ? "text-warning" : "text-success")}>{liqPct}% liquidated</span>
                                    </div>
                                    <Progress value={liqPct} color={liqPct === 100 ? "success" : "warning"} style={{ height: 8, borderRadius: 4 }} />
                                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: "0.72rem" }}>
                                        <span className="text-success">Liquidated: {fmtPeso(item.liquidated)}</span>
                                        <span className="text-warning">Balance: {fmtPeso(balance)}</span>
                                    </div>
                                </div>
                            )}
                        </Section>
                    </Col>
                </Row>
            </ModernModal>
        </>
    );
}

// ─── New Request Modal ────────────────────────────────────────────────────────
var BLANK_FORM = {
    accountable: "", position: "", department: "",
    purpose: "Official Travel", destination: "", travelDates: "",
    uacsObject: "5-02-01-010", fundCluster: "01",
    amount: "", remarks: "", dateFrom: "", dateTo: "",
};

function NewRequestModal({ show, onClose, onSave }) {
    const [form, setForm] = useState({ ...BLANK_FORM });
    const [saving, setSaving] = useState(false);
    const set = k => v => setForm(f => ({ ...f, [k]: v }));

    const handleOfficerChange = name => {
        const officer = ACCOUNTABLE_OFFICERS.find(o => o.name === name);
        if (officer) setForm(f => ({ ...f, accountable: officer.name, position: officer.position, department: officer.department }));
        else setForm(f => ({ ...f, accountable: name }));
    };

    const canSave = form.accountable && form.purpose && form.destination && form.amount > 0;

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onSave({
                ...form,
                amount: parseFloat(form.amount) || 0,
                liquidated: 0, status: "Draft",
                dvRefNo: null, orNo: null,
                modifiedDate: new Date().toISOString(),
                modifiedBy: "Current User",
            });
            setSaving(false);
            setForm({ ...BLANK_FORM });
        }, 600);
    };

    return (
        <ModernModal
            isProcess={true}
            title="New Cash Advance Request"
            isOpen={show}
            onClose={() => { setForm({ ...BLANK_FORM }); onClose(); }}
            width="860px"
            isSaving={saving}
            canSave={!!canSave}
            onSave={handleSave}
        >
            <div>
                <Section title="Accountable Officer">
                    <Row>
                        <FField label="Accountable Officer *" col={6}>
                            <FSelect value={form.accountable} onChange={handleOfficerChange}
                                options={[{ value: "", label: "— Select Officer —" }, ...ACCOUNTABLE_OFFICERS.map(o => ({ value: o.name, label: o.name }))]} />
                        </FField>
                        <FField label="Position / Title" col={6}>
                            <FInput value={form.position} onChange={set("position")} placeholder="Auto-filled from officer"
                                disabled={!!ACCOUNTABLE_OFFICERS.find(o => o.name === form.accountable)} />
                        </FField>
                        <FField label="Department / Division" col={6}>
                            <FSelect value={form.department} onChange={set("department")}
                                options={[{ value: "", label: "— Select Department —" }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
                        </FField>
                        <FField label="Fund Cluster *" col={6}>
                            <FSelect value={form.fundCluster} onChange={set("fundCluster")}
                                options={Object.entries(FUND_CLUSTERS).map(([k, v]) => ({ value: k, label: k + " — " + v }))} />
                        </FField>
                    </Row>
                </Section>

                <Section title="Purpose & Activity Details">
                    <Row>
                        <FField label="Purpose *" col={4}>
                            <FSelect value={form.purpose} onChange={set("purpose")}
                                options={CA_PURPOSES.map(p => ({ value: p, label: p }))} />
                        </FField>
                        <FField label="UACS Object Code *" col={8}>
                            <FSelect value={form.uacsObject} onChange={set("uacsObject")}
                                options={Object.entries(UACS_OBJECTS).map(([k, v]) => ({ value: k, label: k + " — " + v }))} />
                        </FField>
                        <FField label="Destination / Activity Description *" col={12}>
                            <FInput value={form.destination} onChange={set("destination")}
                                placeholder="e.g. Cebu City – Regional COA Conference 2025" />
                        </FField>
                        <FField label="Date From" col={4}>
                            <FInput type="date" value={form.dateFrom} onChange={v => {
                                setForm(f => ({ ...f, dateFrom: v, travelDates: v && f.dateTo ? v + " to " + f.dateTo : v }));
                            }} />
                        </FField>
                        <FField label="Date To" col={4}>
                            <FInput type="date" value={form.dateTo} onChange={v => {
                                setForm(f => ({ ...f, dateTo: v, travelDates: f.dateFrom && v ? f.dateFrom + " to " + v : v }));
                            }} />
                        </FField>
                        <FField label="Travel / Activity Dates (Display)" col={4}>
                            <FInput value={form.travelDates} onChange={set("travelDates")} placeholder="e.g. Jun 10–13, 2025" />
                        </FField>
                    </Row>
                </Section>

                <Section title="Amount & Remarks">
                    <Row>
                        <FField label="Amount Requested (₱) *" col={4}>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text fw-semibold">₱</span>
                                <input type="number" className="form-control form-control-sm" min={0} step={0.01}
                                    value={form.amount} onChange={e => set("amount")(e.target.value)} placeholder="0.00" />
                            </div>
                        </FField>
                        <Col md={8}>
                            {form.amount > 0 && (
                                <div className="p-3 rounded-3 h-100 d-flex align-items-center"
                                    style={{ background: "var(--vz-primary-bg-subtle)", border: "1px solid var(--vz-primary-border-subtle)" }}>
                                    <div>
                                        <p className="text-uppercase fw-semibold text-primary mb-0" style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>Amount in Words</p>
                                        <p className="fw-bold text-primary mb-0" style={{ fontSize: "0.82rem" }}>{fmtPeso(parseFloat(form.amount) || 0)}</p>
                                    </div>
                                </div>
                            )}
                        </Col>
                        <FField label="Remarks / Justification" col={12}>
                            <textarea className="form-control form-control-sm" rows={3}
                                value={form.remarks} onChange={e => set("remarks")(e.target.value)}
                                placeholder="Optional — describe justification or additional context..."
                                style={{ resize: "vertical" }} />
                        </FField>
                    </Row>
                </Section>

                {(form.accountable || form.purpose || form.amount) && (
                    <Section title="Request Preview">
                        <div className="p-3 rounded-3" style={{ background: "var(--vz-light)", border: "1px solid var(--vz-border-color)" }}>
                            <Row className="g-2" style={{ fontSize: "0.8rem" }}>
                                {[
                                    { label: "Officer",      value: form.accountable || "—" },
                                    { label: "Department",   value: form.department   || "—" },
                                    { label: "Purpose",      value: form.purpose      || "—" },
                                    { label: "Amount",       value: form.amount ? fmtPeso(parseFloat(form.amount)) : "—" },
                                    { label: "UACS",         value: form.uacsObject   || "—" },
                                    { label: "Fund Cluster", value: form.fundCluster ? form.fundCluster + " — " + (FUND_CLUSTERS[form.fundCluster] || "") : "—" },
                                ].map(p => (
                                    <Col key={p.label} sm={4}>
                                        <span className="text-uppercase text-muted fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.06em", display: "block" }}>{p.label}</span>
                                        <span className="fw-medium">{p.value}</span>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        {!canSave && (
                            <p className="text-warning mb-0 mt-2" style={{ fontSize: "0.75rem" }}>
                                <i className="ri-error-warning-line me-1"></i>Fill in all required fields (*) to save.
                            </p>
                        )}
                    </Section>
                )}
            </div>
        </ModernModal>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
var DesktopView = function () {
    const [records, setRecords]         = useState(MOCK_DATA);
    const [selected, setSelected]       = useState(null);
    const [showNew, setShowNew]         = useState(false);
    const [search, setSearch]           = useState("");
    const [statusFilter, setStatus]     = useState("All");
    const [purposeFilter, setPurpose]   = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    var totalAmount     = records.reduce((s, r) => s + r.amount, 0);
    var totalLiquidated = records.reduce((s, r) => s + r.liquidated, 0);
    var totalBalance    = totalAmount - totalLiquidated;
    var liqPct          = totalAmount > 0 ? Math.round((totalLiquidated / totalAmount) * 100) : 0;

    var statusCounts = useMemo(() => {
        var c = {};
        records.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
        return c;
    }, [records]);

    const handleSaveNew = form => {
        const newId = Math.max(...records.map(r => r.id), 0) + 1;
        setRecords(prev => [{
            ...form, id: newId,
            refNo: `CA-2025-${String(newId + 10).padStart(2, "0")}-${String(newId).padStart(5, "0")}`,
            date: new Date().toISOString().slice(0, 10),
        }, ...prev]);
        setShowNew(false);
    };

    const handleLiquidate = item => {
        setRecords(prev => prev.map(r => r.id === item.id
            ? { ...r, status: "Liquidated", liquidated: r.amount, orNo: "OR-2025-PENDING" } : r));
        setSelected(prev => prev ? { ...prev, status: "Liquidated", liquidated: prev.amount } : null);
    };

    const handleApprove = item => {
        setRecords(prev => prev.map(r => r.id === item.id
            ? { ...r, status: "Approved", dvRefNo: `DV-2025-APPROVED-${r.id}` } : r));
        setSelected(prev => prev ? { ...prev, status: "Approved" } : null);
    };

    var filtered = useMemo(() => {
        var d = records;
        if (statusFilter !== "All")  d = d.filter(r => r.status  === statusFilter);
        if (purposeFilter !== "All") d = d.filter(r => r.purpose === purposeFilter);
        if (search.trim()) {
            var q = search.toLowerCase();
            d = d.filter(r =>
                r.refNo.toLowerCase().includes(q) ||
                r.accountable.toLowerCase().includes(q) ||
                r.purpose.toLowerCase().includes(q) ||
                r.destination.toLowerCase().includes(q)
            );
        }
        return d;
    }, [records, search, statusFilter, purposeFilter]);

    return (
        <div className="page-content">
            <DetailModal
                item={selected ? records.find(r => r.id === selected.id) ?? selected : null}
                onClose={() => setSelected(null)}
                onLiquidate={handleLiquidate}
                onApprove={handleApprove}
            />
            <NewRequestModal
                show={showNew}
                onClose={() => setShowNew(false)}
                onSave={handleSaveNew}
            />

            <Container fluid>
                <BreadCrumb title="Cash Advances" crumbs={[{ title: "FMS", url: "/fms/dashboard" }]} />

                {/* Stat cards */}
                <Row className="g-3 mb-4">
                    <Col xl={3} md={6}>
                        <Card className="card-animate border-0 shadow-sm mb-0 h-100">
                            <CardBody className="p-3">
                                <div className="d-flex align-items-start justify-content-between mb-3">
                                    <div className="bg-primary-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 46, height: 46 }}>
                                        <i className="ri-money-dollar-box-fill text-primary fs-3"></i>
                                    </div>
                                    <Badge color="warning" className="rounded-pill" style={{ fontSize: "0.65rem" }}>
                                        <i className="ri-time-line me-1"></i>{(statusCounts["Approved"] || 0) + (statusCounts["Submitted"] || 0)} Pending
                                    </Badge>
                                </div>
                                <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>Total Cash Advances</p>
                                <h3 className="mb-1 fw-bold ff-secondary text-primary">
                                    <span style={{ fontSize: "0.9rem", verticalAlign: "super" }}>₱</span>
                                    <CountUp start={0} end={totalAmount} duration={2.5} separator="," decimals={2} />
                                </h3>
                                <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>{records.length} records this period</p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={3} md={6}>
                        <Card className="card-animate border-0 shadow-sm mb-0 h-100">
                            <CardBody className="p-3">
                                <div className="bg-success-subtle rounded-3 d-flex align-items-center justify-content-center mb-3 flex-shrink-0" style={{ width: 46, height: 46 }}>
                                    <i className="ri-verified-badge-fill text-success fs-3"></i>
                                </div>
                                <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>Liquidated</p>
                                <h4 className="mb-1 fw-bold ff-secondary text-success">{fmtPeso(totalLiquidated)}</h4>
                                <div className="progress mb-1" style={{ height: 5, borderRadius: 3 }}>
                                    <div className="progress-bar bg-success" style={{ width: liqPct + "%" }}></div>
                                </div>
                                <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>{liqPct}% of total granted</p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={3} md={6}>
                        <Card className="card-animate border-0 shadow-sm mb-0 h-100">
                            <CardBody className="p-3">
                                <div className="bg-warning-subtle rounded-3 d-flex align-items-center justify-content-center mb-3 flex-shrink-0" style={{ width: 46, height: 46 }}>
                                    <i className="ri-error-warning-fill text-warning fs-3"></i>
                                </div>
                                <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>Unliquidated Balance</p>
                                <h4 className="mb-1 fw-bold ff-secondary text-warning">{fmtPeso(totalBalance)}</h4>
                                <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>{100 - liqPct}% remaining to liquidate</p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={3} md={6}>
                        <Card className="card-animate border-0 shadow-sm mb-0 h-100">
                            <CardBody className="p-3">
                                <div className="d-flex align-items-start justify-content-between mb-2">
                                    <div className="bg-secondary-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 46, height: 46 }}>
                                        <i className="ri-bar-chart-grouped-line text-secondary fs-3"></i>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>{records.length} total</span>
                                </div>
                                <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>By Status</p>
                                <div className="progress mb-2" style={{ height: 6, borderRadius: 3 }}>
                                    <div className="progress-bar bg-success"   style={{ width: Math.round((statusCounts["Liquidated"] || 0) / records.length * 100) + "%" }}></div>
                                    <div className="progress-bar bg-info"      style={{ width: Math.round((statusCounts["Approved"]   || 0) / records.length * 100) + "%" }}></div>
                                    <div className="progress-bar bg-warning"   style={{ width: Math.round((statusCounts["Submitted"]  || 0) / records.length * 100) + "%" }}></div>
                                    <div className="progress-bar bg-secondary" style={{ width: Math.round((statusCounts["Draft"]      || 0) / records.length * 100) + "%" }}></div>
                                </div>
                                <div className="d-flex flex-wrap gap-2" style={{ fontSize: "0.7rem" }}>
                                    <span className="text-success"><i className="ri-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>{statusCounts["Liquidated"] || 0} Liquidated</span>
                                    <span className="text-info"><i className="ri-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>{statusCounts["Approved"] || 0} Approved</span>
                                    <span className="text-warning"><i className="ri-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>{statusCounts["Submitted"] || 0} Submitted</span>
                                    <span className="text-muted"><i className="ri-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>{statusCounts["Draft"] || 0} Draft</span>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Table card */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-bottom-0 pt-3 pb-2 px-4">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                                <h5 className="card-title mb-0">
                                    <i className="ri-money-dollar-box-line me-2 text-primary"></i>Cash Advance Requests
                                </h5>
                                <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.78rem" }}>
                                    {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                                    {statusFilter !== "All" ? " — " + statusFilter : ""}
                                    {purposeFilter !== "All" ? " — " + purposeFilter : ""}
                                    <span className="ms-1 opacity-75">· Click any row to view details</span>
                                </p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                <div className="search-box" style={{ minWidth: 220 }}>
                                    <Input className="search bg-light border-light" placeholder="Search ref no., officer, purpose..."
                                        value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: "0.82rem" }} />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                                <Button color="light" size="sm" className="d-flex align-items-center gap-1"
                                    onClick={() => setShowFilters(!showFilters)}>
                                    <i className="ri-filter-3-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>Filters</span>
                                    {(statusFilter !== "All" || purposeFilter !== "All") && (
                                        <Badge color="primary" className="rounded-pill ms-1" style={{ fontSize: "0.6rem" }}>
                                            {(statusFilter !== "All" ? 1 : 0) + (purposeFilter !== "All" ? 1 : 0)}
                                        </Badge>
                                    )}
                                </Button>
                                <Button color="primary" size="sm" className="d-flex align-items-center gap-1" onClick={() => setShowNew(true)}>
                                    <i className="ri-add-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>New Request</span>
                                </Button>
                                <Button color="light" size="sm" className="d-flex align-items-center gap-1">
                                    <i className="ri-download-2-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>Export</span>
                                </Button>
                            </div>
                        </div>

                        <Collapse isOpen={showFilters}>
                            <div className="mt-3 p-3 rounded-3" style={{ background: "var(--vz-light)", border: "1px solid var(--vz-border-color)" }}>
                                <Row className="g-2 align-items-end">
                                    <Col sm={4}>
                                        <label className="form-label text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>Status</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {["All", "Draft", "Submitted", "Approved", "Liquidated", "Cancelled"].map(f => {
                                                var scfg = STATUS_CFG[f] || {};
                                                return (
                                                    <button key={f}
                                                        className={"btn btn-sm rounded-pill " + (statusFilter === f ? "btn-primary" : "btn-soft-secondary")}
                                                        style={{ fontSize: "0.7rem" }}
                                                        onClick={() => setStatus(f)}>
                                                        {f !== "All" && <i className={(scfg.icon || "") + " me-1"}></i>}
                                                        {f} ({f === "All" ? records.length : statusCounts[f] || 0})
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <label className="form-label text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>Purpose</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {["All", ...CA_PURPOSES].map(p => (
                                                <button key={p}
                                                    className={"btn btn-sm rounded-pill " + (purposeFilter === p ? "btn-primary" : "btn-soft-secondary")}
                                                    style={{ fontSize: "0.7rem" }}
                                                    onClick={() => setPurpose(p)}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </Col>
                                    <Col sm={4} className="text-end">
                                        <button className="btn btn-sm btn-soft-danger"
                                            onClick={() => { setStatus("All"); setPurpose("All"); setSearch(""); setShowFilters(false); }}
                                            style={{ fontSize: "0.75rem" }}>
                                            <i className="ri-refresh-line me-1"></i>Clear All Filters
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        </Collapse>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="ri-file-search-line d-block fs-1 mb-2 opacity-25"></i>
                                <p className="fw-medium mb-0">No cash advance records found.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.8rem" }}>
                                    <thead className="table-light">
                                        <tr>
                                            {["Reference No.", "Date", "Accountable Officer", "Purpose", "UACS Object", "Amount", "Status", "Last Updated", "Action"].map(h => (
                                                <th key={h} style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap",
                                                    paddingLeft: h === "Reference No." ? 20 : undefined,
                                                    paddingRight: h === "Action" ? 20 : undefined }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        {filtered.map(row => {
                                            var balance = row.amount - row.liquidated;
                                            var scfg    = STATUS_CFG[row.status] || { color: "secondary", icon: "ri-question-line" };
                                            var purposeIcon = {
                                                "Official Travel":    "ri-flight-takeoff-line",
                                                "Training / Seminar": "ri-graduation-cap-line",
                                                "Office Supplies":    "ri-store-2-line",
                                                "Special Activity":   "ri-star-line",
                                                "Field Operations":   "ri-map-2-line",
                                            }[row.purpose] || "ri-file-line";
                                            return (
                                                <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => setSelected(row)}>
                                                    <td style={{ paddingLeft: 20 }}>
                                                        <span className="fw-semibold text-primary font-monospace" style={{ fontSize: "0.78rem" }}>{row.refNo}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-muted font-monospace" style={{ fontSize: "0.78rem" }}>{fmtDate(row.date)}</span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 30, height: 30 }}>
                                                                <span className="fw-semibold text-primary" style={{ fontSize: "0.64rem" }}>{initials(row.accountable)}</span>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-semibold" style={{ fontSize: "0.8rem" }}>{row.accountable}</p>
                                                                <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>{row.department}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <i className={purposeIcon + " text-muted"} style={{ fontSize: "0.8rem" }}></i>
                                                            <span className="fw-medium" style={{ fontSize: "0.8rem" }}>{row.purpose}</span>
                                                        </div>
                                                        <p className="mb-0 text-muted" style={{ fontSize: "0.7rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {row.destination}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary-subtle text-secondary rounded-pill font-monospace" style={{ fontSize: "0.68rem" }}>{row.uacsObject}</span>
                                                        <p className="mb-0 text-muted mt-1" style={{ fontSize: "0.7rem" }}>{UACS_OBJECTS[row.uacsObject] || "—"}</p>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <p className="mb-0 fw-bold text-primary" style={{ fontSize: "0.82rem", fontVariantNumeric: "tabular-nums" }}>{fmtPeso(row.amount)}</p>
                                                        {row.liquidated > 0 && <p className="mb-0 text-success" style={{ fontSize: "0.7rem" }}>Liq: {fmtPeso(row.liquidated)}</p>}
                                                        {balance > 0 && row.status !== "Draft" && <p className="mb-0 text-warning" style={{ fontSize: "0.7rem" }}>Bal: {fmtPeso(balance)}</p>}
                                                    </td>
                                                    <td>
                                                        <Badge color={scfg.color} className="rounded-pill" style={{ fontSize: "0.68rem" }}>
                                                            <i className={scfg.icon + " me-1"}></i>{row.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-muted font-monospace" style={{ fontSize: "0.75rem" }}>
                                                            {fmtDate(row.modifiedDate)} <span style={{ opacity: 0.7 }}>{fmtTime(row.modifiedDate)}</span>
                                                        </p>
                                                        <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>
                                                            <i className="ri-user-line me-1"></i>{row.modifiedBy}
                                                        </p>
                                                    </td>
                                                    {/* Action td — stopPropagation prevents double-firing row click */}
                                                    <td style={{ paddingRight: 20 }} onClick={e => e.stopPropagation()}>
                                                        <div className="d-flex gap-1">
                                                            <button className="btn btn-sm btn-soft-primary p-1 lh-1" title="View Details"
                                                                onClick={() => setSelected(row)}>
                                                                <i className="ri-eye-line fs-6"></i>
                                                            </button>
                                                            {row.status === "Draft" && (
                                                                <button className="btn btn-sm btn-soft-warning p-1 lh-1" title="Edit"
                                                                    onClick={() => setSelected(row)}>
                                                                    <i className="ri-edit-line fs-6"></i>
                                                                </button>
                                                            )}
                                                            {row.status === "Approved" && (
                                                                <button className="btn btn-sm btn-soft-success p-1 lh-1" title="Liquidate"
                                                                    onClick={() => handleLiquidate(row)}>
                                                                    <i className="ri-verified-badge-line fs-6"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan={5} className="text-muted" style={{ fontSize: "0.72rem", paddingLeft: 20 }}>
                                                {filtered.length} of {records.length} records
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <p className="mb-0 fw-bold text-primary" style={{ fontSize: "0.78rem" }}>{fmtPeso(filtered.reduce((s, r) => s + r.amount, 0))}</p>
                                                <p className="mb-0 text-success" style={{ fontSize: "0.7rem" }}>Liq: {fmtPeso(filtered.reduce((s, r) => s + r.liquidated, 0))}</p>
                                            </td>
                                            <td colSpan={3}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>

            </Container>
        </div>
    );
};

export default DesktopView;