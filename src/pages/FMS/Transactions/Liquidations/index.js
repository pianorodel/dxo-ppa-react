import BreadCrumb from "@/components/Common/BreadCrumb";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import ExportExcelModal from "@/components/Common/Modals/ExportExcelModal";
import * as moment from "moment";
import CountUp from "react-countup";
import { useEffect, useMemo, useState } from "react";
import {
    Badge, Button, Card, CardBody, CardHeader,
    Col, Collapse, Container, Input, Progress, Row,
} from "reactstrap";

import auditlogsImage from "@/assets/images/auditlogs.png";
import avatar2 from "@/assets/images/users/avatar-2.jpg";
import avatar6 from "@/assets/images/users/avatar-6.jpg";
import avatar8 from "@/assets/images/users/avatar-8.jpg";

// ─── Reference data ───────────────────────────────────────────────────────────
var CA_TYPES = {
    "Local Travel":     { color: "primary", icon: "ri-road-map-line" },
    "Foreign Travel":   { color: "info",    icon: "ri-flight-takeoff-line" },
    "Operating Expense":{ color: "success", icon: "ri-building-line" },
    "Special Purpose":  { color: "warning", icon: "ri-star-line" },
    "Confidential":     { color: "danger",  icon: "ri-lock-line" },
};

var LIQ_STATUS = {
    "Pending":    { color: "warning",   icon: "ri-time-line" },
    "Submitted":  { color: "info",      icon: "ri-send-plane-line" },
    "Approved":   { color: "success",   icon: "ri-checkbox-circle-line" },
    "Returned":   { color: "secondary", icon: "ri-arrow-go-back-line" },
    "Disallowed": { color: "danger",    icon: "ri-close-circle-line" },
};

var FUND_CLUSTERS = {
    "01": "Regular Agency Fund",
    "04": "Special Accounts – Foreign Fund",
};

var UACS_CODES = {
    "50201010 00": "Traveling Expenses – Local",
    "50201020 00": "Traveling Expenses – Foreign",
    "50202010 00": "Training Expenses",
    "50203010 00": "Office Supplies Expense",
    "50203210 00": "Janitorial Supplies Expense",
    "50299990 00": "Other MOOE",
};

var DEPARTMENTS = [
    "Accounting Division", "Finance Division", "Engineering Division",
    "MIS Department", "General Services", "Executive Office", "Administrative Division",
];

var PAYEES = [
    { name: "Maria Santos",     designation: "Finance Officer III",     department: "Finance Division" },
    { name: "Benjamin Cruz",    designation: "Engineer III",            department: "Engineering Division" },
    { name: "Roland Acuesta",   designation: "Senior Software Engineer",department: "MIS Department" },
    { name: "Luis Bautista",    designation: "Supply Officer I",        department: "General Services" },
    { name: "Ana Reyes",        designation: "Accountant II",           department: "Accounting Division" },
];

var HISTORY = [
    { avatar: avatar6, name: "Bethany Johnson",     action: "Approved",  date: "20 Jun 2025", note: "Liquidation report reviewed and approved. JEV prepared." },
    { avatar: avatar8, name: "Roland Acuesta",      action: "Submitted", date: "18 Jun 2025", note: "Submitted liquidation report with all supporting documents." },
    { avatar: avatar2, name: "Stefhannie Wagoner",  action: "Pending",   date: "17 Jun 2025", note: "Liquidation report created based on actual expenses incurred." },
];

var ACTION_COLOR = { Approved: "success", Submitted: "info", Pending: "warning", Returned: "secondary", Disallowed: "danger" };

// ─── Mock data ─────────────────────────────────────────────────────────────────
var INITIAL_DATA = [
    {
        id: 1, refNo: "LIQ-2025-06-0001", caRefNo: "CA-2025-06-0002", caType: "Operating Expense",
        payee: "Maria Santos", designation: "Finance Officer III", department: "Finance Division",
        purpose: "Purchase of office supplies for Q2 2025 — bond paper, printer ink cartridges, and other consumables",
        fundCluster: "01", orsNo: "ORS-2025-06-00143", uacsCode: "50203010 00",
        amountGranted: 18500.00, dateGranted: "2025-06-03", dateDue: "2025-06-17", dateSettled: "2025-06-15",
        jevNo: "JEV-2025-06-00089",
        expenses: [
            { particular: "Bond paper (A4, 80gsm) — 20 reams",       uacs: "50203010 00", amount: 4200.00 },
            { particular: "Printer ink cartridges (black) — 6 pcs",   uacs: "50203010 00", amount: 7800.00 },
            { particular: "Printer ink cartridges (color) — 4 pcs",   uacs: "50203010 00", amount: 5200.00 },
            { particular: "Stapler and staple wires — 5 sets",         uacs: "50203010 00", amount:  750.00 },
            { particular: "Miscellaneous office consumables",           uacs: "50203010 00", amount:  550.00 },
        ],
        totalExpenses: 18500.00, refundAmount: 0.00, status: "Approved",
        modifiedDate: "2025-06-20T10:30:00.000Z", modifiedBy: "Bethany Johnson",
    },
    {
        id: 2, refNo: "LIQ-2025-06-0002", caRefNo: "CA-2025-06-0005", caType: "Local Travel",
        payee: "Benjamin Cruz", designation: "Engineer III", department: "Engineering Division",
        purpose: "Field inspection of infrastructure projects in Region VII — bridges, road improvements, drainage systems",
        fundCluster: "01", orsNo: "ORS-2025-06-00146", uacsCode: "50201010 00",
        amountGranted: 12500.00, dateGranted: "2025-06-05", dateDue: "2025-06-19", dateSettled: "2025-06-18",
        jevNo: "JEV-2025-06-00092",
        expenses: [
            { particular: "Airfare (MNL–CEB round trip)",                uacs: "50201010 00", amount: 6800.00 },
            { particular: "Per diem — 3 days (₱1,000/day)",             uacs: "50201010 00", amount: 3000.00 },
            { particular: "Hotel accommodation — 2 nights (₱800/night)",uacs: "50201010 00", amount: 1600.00 },
            { particular: "Transportation (land) — various",              uacs: "50201010 00", amount:  850.00 },
        ],
        totalExpenses: 12250.00, refundAmount: 250.00, status: "Approved",
        modifiedDate: "2025-06-18T16:45:00.000Z", modifiedBy: "Benjamin Cruz",
    },
    {
        id: 3, refNo: "LIQ-2025-06-0003", caRefNo: "CA-2025-06-0001", caType: "Local Travel",
        payee: "Roland Acuesta", designation: "Senior Software Engineer", department: "MIS Department",
        purpose: "Systems training and demo of new FMS module for regional offices in Davao City and CDO",
        fundCluster: "01", orsNo: "ORS-2025-06-00142", uacsCode: "50201010 00",
        amountGranted: 25000.00, dateGranted: "2025-06-01", dateDue: "2025-06-22", dateSettled: null,
        jevNo: null,
        expenses: [
            { particular: "Airfare (MNL–DVO round trip)",    uacs: "50201010 00", amount: 8500.00 },
            { particular: "Airfare (DVO–CDO–MNL)",           uacs: "50201010 00", amount: 5200.00 },
            { particular: "Per diem — 5 days (₱1,200/day)", uacs: "50201010 00", amount: 6000.00 },
            { particular: "Hotel — 4 nights (₱1,000/night)",uacs: "50201010 00", amount: 4000.00 },
        ],
        totalExpenses: 23700.00, refundAmount: 1300.00, status: "Submitted",
        modifiedDate: "2025-06-19T09:00:00.000Z", modifiedBy: "Roland Acuesta",
    },
    {
        id: 4, refNo: "LIQ-2025-06-0004", caRefNo: "CA-2025-06-0007", caType: "Operating Expense",
        payee: "Luis Bautista", designation: "Supply Officer I", department: "General Services",
        purpose: "Janitorial and cleaning supplies for Q2 2025",
        fundCluster: "01", orsNo: "ORS-2025-06-00147", uacsCode: "50203210 00",
        amountGranted: 8750.00, dateGranted: "2025-06-07", dateDue: "2025-06-21", dateSettled: null,
        jevNo: null, expenses: [], totalExpenses: 0.00, refundAmount: 0.00, status: "Pending",
        modifiedDate: "2025-06-07T13:00:00.000Z", modifiedBy: "Luis Bautista",
    },
    {
        id: 5, refNo: "LIQ-2025-06-0005", caRefNo: "CA-2025-06-0008", caType: "Confidential",
        payee: "Director Office", designation: "Office of the Director", department: "Executive Office",
        purpose: "Confidential expenses per R.A. 6426",
        fundCluster: "01", orsNo: "ORS-2025-06-00148", uacsCode: "50299990 00",
        amountGranted: 75000.00, dateGranted: "2025-06-02", dateDue: "2025-06-30", dateSettled: null,
        jevNo: null,
        expenses: [{ particular: "Confidential — details on file with Chief Accountant", uacs: "50299990 00", amount: 75000.00 }],
        totalExpenses: 68500.00, refundAmount: 6500.00, status: "Returned",
        modifiedDate: "2025-06-22T11:00:00.000Z", modifiedBy: "Admin User",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d) { return d ? moment(new Date(d)).format("DD MMM YYYY") : "—"; }
function fmtTime(d) { return moment(new Date(d)).format("hh:mm A"); }
function fmtPeso(n) { return "₱" + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
function daysLeft(due) { if (!due) return null; return moment(due).diff(moment().startOf("day"), "days"); }
function initials(name) { var p = name.split(" "); return (p[0].charAt(0) + (p[p.length - 1] || "").charAt(0)).toUpperCase(); }
function utilizationPct(expenses, granted) { if (!granted) return 0; return Math.min(100, Math.round((expenses / granted) * 100)); }

// ─── Form field helpers ───────────────────────────────────────────────────────
function FLabel({ children }) {
    return <label className="form-label text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.06em" }}>{children}</label>;
}
function FInput({ value, onChange, placeholder, type = "text", disabled }) {
    return <input type={type} className="form-control form-control-sm" value={value ?? ""} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled} />;
}
function FSelect({ value, onChange, options }) {
    return (
        <select className="form-select form-select-sm" value={value ?? ""} onChange={e => onChange?.(e.target.value)}>
            {options.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
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
            <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`} style={{ width: fullscreen ? "" : "620px" }}>

                {/* Header */}
                <div className="emd-hdr">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
                        <div className="emd-avatar-wrap">
                            <img src={auditlogsImage} style={{ height: 55 }} alt="Audit Logs" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{title || "Activity History"}</span>
                            </div>
                            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 14, fontWeight: 600 }}>
                                    {subTitle}
                                    {statusName && (
                                        <span style={{
                                            display: "inline-flex", alignItems: "center",
                                            padding: "2px 8px", borderRadius: 3,
                                            fontSize: 11, fontWeight: 700,
                                            background: "rgba(255,255,255,0.18)",
                                            color: "#fff", letterSpacing: "0.4px",
                                        }}>{statusName}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                            <button className="emd-icon-btn" onClick={() => setFullscreen(f => !f)} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
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
                    {/* Search */}
                    <div className="search-box mb-3">
                        <Input className="search bg-light border-light" placeholder="Search by name, action, or note..."
                            value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: "0.82rem" }} />
                        <i className="ri-search-line search-icon"></i>
                    </div>

                    {/* Timeline */}
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
                                            <span className={"badge bg-" + (ACTION_COLOR[h.action] || "secondary") + "-subtle text-" + (ACTION_COLOR[h.action] || "secondary") + " rounded-pill"} style={{ fontSize: "0.66rem" }}>
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

// ─── Liquidation Detail Modal (ModernModal) ───────────────────────────────────
function LiquidationDetailModal({ item, onClose, onApprove, onReturn, onSubmit }) {
    const [showAuditLogs, setShowAuditLogs] = useState(false);
    if (!item) return null;

    var typeCfg   = CA_TYPES[item.caType]   || { color: "secondary", icon: "ri-file-line" };
    var statusCfg = LIQ_STATUS[item.status] || { color: "secondary", icon: "ri-question-line" };
    var utilPct   = utilizationPct(item.totalExpenses, item.amountGranted);
    var hasRefund = item.refundAmount > 0;
    var days      = daysLeft(item.dateDue);

    return (
        <>
            <ModernAuditLogsModal
                show={showAuditLogs}
                title="Activity History"
                subTitle={item.refNo}
                statusName={item.status}
                statusColor={statusCfg.color}
                history={HISTORY}
                onClose={() => setShowAuditLogs(false)}
            />

            <ModernModal
                isProcess={true}
                title={`Liquidation — ${item.refNo}`}
                isOpen={true}
                onClose={onClose}
                width="960px"
                isSaving={false}
                modifiedDate={item.modifiedDate}
                canSave={false}
                footerContent={
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        {item.status === "Pending" && (
                            <Button color={typeCfg.color} size="sm" className="d-flex align-items-center gap-1" onClick={() => onSubmit(item)}>
                                <i className="ri-send-plane-line"></i>
                                <span style={{ fontSize: "0.8rem" }}>Submit</span>
                            </Button>
                        )}
                        {item.status === "Submitted" && (
                            <>
                                <Button color="info" size="sm" className="d-flex align-items-center gap-1" onClick={() => onReturn(item)}>
                                    <i className="ri-arrow-go-back-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>Return</span>
                                </Button>
                                <Button color="success" size="sm" className="d-flex align-items-center gap-1" onClick={() => onApprove(item)}>
                                    <i className="ri-check-double-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>Approve</span>
                                </Button>
                                <Button color="danger" size="sm" className="d-flex align-items-center gap-1">
                                    <i className="ri-close-circle-line"></i>
                                    <span style={{ fontSize: "0.8rem" }}>Disallow</span>
                                </Button>
                            </>
                        )}
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
                    { label: "Amount Granted", value: fmtPeso(item.amountGranted), icon: "ri-wallet-3-line",   color: typeCfg.color },
                    { label: "Total Expenses", value: fmtPeso(item.totalExpenses), icon: "bx bx-money",        color: item.totalExpenses > item.amountGranted ? "danger" : "success" },
                    { label: "Refund to Govt", value: hasRefund ? fmtPeso(item.refundAmount) : "None",         icon: "ri-refund-2-line", color: hasRefund ? "warning" : "secondary" },
                    { label: "Utilization",    value: utilPct + "%",                                            icon: "ri-pie-chart-line",color: utilPct >= 95 ? "success" : utilPct >= 70 ? "info" : "warning" },
                ].map(s => (
                    <Col key={s.label} xl={3} sm={6}>
                        <Card className="border-0 shadow-sm mb-0">
                            <CardBody className="p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>{s.label}</p>
                                        <h5 className={"mb-0 fw-bold ff-secondary text-" + s.color}>{s.value}</h5>
                                    </div>
                                    <div className={"bg-" + s.color + "-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 42, height: 42 }}>
                                        <i className={s.icon + " text-" + s.color + " fs-3"}></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-3 mt-0">
                {/* Expense breakdown — full width now that history is in its own modal */}
                <Col lg={12}>
                    <Section title="Expense Breakdown">
                        {/* Payee highlight */}
                        <div className={"p-3 rounded-3 mb-3 bg-" + typeCfg.color + "-subtle border border-" + typeCfg.color + "-subtle"}>
                            <p className={"text-uppercase fw-semibold text-" + typeCfg.color + " mb-2"} style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>
                                <i className="ri-user-star-line me-1"></i>Accountable / Payee
                            </p>
                            <div className="d-flex align-items-center gap-3">
                                <div className={"bg-" + typeCfg.color + "-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 40, height: 40 }}>
                                    <span className={"fw-bold text-" + typeCfg.color} style={{ fontSize: "0.78rem" }}>{initials(item.payee)}</span>
                                </div>
                                <div>
                                    <p className="mb-0 fw-bold" style={{ fontSize: "0.9rem" }}>{item.payee}</p>
                                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{item.designation} · {item.department}</p>
                                </div>
                                <div className="ms-auto text-end">
                                    <p className="mb-0 text-muted" style={{ fontSize: "0.65rem", textTransform: "uppercase" }}>CA Reference</p>
                                    <span className="font-monospace fw-semibold" style={{ fontSize: "0.78rem" }}>{item.caRefNo}</span>
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="p-3 rounded-3 border mb-3" style={{ background: "var(--vz-light)" }}>
                            <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>
                                <i className="ri-chat-quote-line me-1"></i>Purpose
                            </p>
                            <p className="mb-0 fw-semibold" style={{ fontSize: "0.85rem" }}>{item.purpose}</p>
                        </div>

                        {/* Meta grid */}
                        <Row className="g-2 mb-3">
                            {[
                                ["ORS No.",      item.orsNo || "Not obligated", "ri-file-list-3-line", item.orsNo ? "info" : "warning"],
                                ["UACS Code",    item.uacsCode,                 "ri-code-line",         "secondary"],
                                ["Date Granted", fmtDate(item.dateGranted),     "ri-calendar-check-line","success"],
                                ["Due Date",     fmtDate(item.dateDue),          "ri-calendar-close-line",
                                    item.dateSettled ? "success" : (days !== null && days < 0 ? "danger" : days !== null && days <= 3 ? "warning" : "secondary")],
                            ].map(row => (
                                <Col sm={6} key={row[0]}>
                                    <div className="d-flex flex-column p-2 rounded-3 border h-100" style={{ background: "var(--vz-card-bg)" }}>
                                        <div className="d-flex align-items-center gap-1 mb-1">
                                            <i className={row[2] + " text-" + row[3]} style={{ fontSize: "0.75rem" }}></i>
                                            <p className="mb-0 text-muted" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{row[0]}</p>
                                        </div>
                                        <p className="mb-0 fw-semibold" style={{ fontSize: "0.83rem" }}>{row[1]}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        {/* Expense line items */}
                        {item.expenses.length > 0 ? (
                            <div className="border rounded-3 overflow-hidden mb-3">
                                <div className="d-flex px-3 py-2 table-light" style={{ borderBottom: "0.5px solid var(--vz-border-color)" }}>
                                    <span className="fw-semibold text-muted" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", width: 20 }}>#</span>
                                    <span className="fw-semibold text-muted flex-grow-1" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Particular</span>
                                    <span className="fw-semibold text-muted text-center" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", width: 110 }}>UACS</span>
                                    <span className="fw-semibold text-muted text-end"   style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", width: 110 }}>Amount</span>
                                </div>
                                {item.expenses.map((exp, i) => (
                                    <div key={i} className="d-flex align-items-center px-3 py-2"
                                        style={{ background: i % 2 === 0 ? "var(--vz-card-bg)" : "var(--vz-light)", borderBottom: i < item.expenses.length - 1 ? "0.5px solid var(--vz-border-color)" : "none" }}>
                                        <span className="text-muted flex-shrink-0" style={{ fontSize: "0.72rem", width: 20 }}>{i + 1}</span>
                                        <span className="flex-grow-1" style={{ fontSize: "0.8rem" }}>{exp.particular}</span>
                                        <span className="font-monospace text-muted text-center" style={{ fontSize: "0.72rem", width: 110 }}>{exp.uacs}</span>
                                        <span className="fw-semibold text-end" style={{ fontSize: "0.82rem", width: 110, fontVariantNumeric: "tabular-nums" }}>{fmtPeso(exp.amount)}</span>
                                    </div>
                                ))}
                                <div className={"d-flex align-items-center px-3 py-2 bg-" + typeCfg.color + "-subtle"} style={{ borderTop: "1px solid var(--vz-border-color)" }}>
                                    <span style={{ width: 20 }}></span>
                                    <span className={"fw-bold text-" + typeCfg.color + " flex-grow-1"} style={{ fontSize: "0.8rem" }}>Total Expenses</span>
                                    <span style={{ width: 110 }}></span>
                                    <span className={"fw-bold text-" + typeCfg.color + " text-end"} style={{ fontSize: "0.85rem", width: 110, fontVariantNumeric: "tabular-nums" }}>{fmtPeso(item.totalExpenses)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted border rounded-3 mb-3" style={{ fontSize: "0.82rem" }}>
                                <i className="ri-receipt-line d-block fs-3 mb-1 opacity-25"></i>No expense items entered yet.
                            </div>
                        )}

                        {/* Settlement summary */}
                        <div className="border rounded-3 overflow-hidden mb-3">
                            {[
                                { label: "Amount Granted",    value: item.amountGranted,  color: typeCfg.color, bold: false },
                                { label: "Total Expenses",    value: item.totalExpenses,  color: "dark",        bold: false },
                                { label: "Refund to Govt",    value: item.refundAmount,   color: hasRefund ? "warning" : "success", bold: true },
                            ].map((row, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between px-3 py-2"
                                    style={{ background: i === 2 ? "var(--vz-warning-bg-subtle)" : "var(--vz-card-bg)", borderBottom: i < 2 ? "0.5px solid var(--vz-border-color)" : "none" }}>
                                    <span className={row.bold ? "fw-bold" : "text-muted"} style={{ fontSize: "0.8rem" }}>{row.label}</span>
                                    <span className={"fw-bold text-" + row.color} style={{ fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" }}>{fmtPeso(row.value)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Utilization bar */}
                        <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <span className="text-muted" style={{ fontSize: "0.75rem" }}><i className="ri-pie-chart-line me-1"></i>Fund Utilization</span>
                                <span className={"fw-semibold text-" + typeCfg.color} style={{ fontSize: "0.75rem" }}>{utilPct}%</span>
                            </div>
                            <Progress value={utilPct} color={typeCfg.color} style={{ height: 8, borderRadius: 4 }} />
                            <div className="d-flex justify-content-between mt-1">
                                <span className="text-muted" style={{ fontSize: "0.68rem" }}>₱0</span>
                                <span className="text-muted" style={{ fontSize: "0.68rem" }}>{fmtPeso(item.amountGranted)} granted</span>
                            </div>
                        </div>

                        {/* COA notice */}
                        <div className="p-3 rounded-3 border-start border-4 border-warning" style={{ background: "var(--vz-warning-bg-subtle)", fontSize: "0.78rem" }}>
                            <p className="fw-semibold text-warning mb-1"><i className="ri-information-line me-1"></i>COA Requirements</p>
                            <p className="mb-0 text-muted">
                                Liquidation must be supported by official receipts, invoices, and other documents.
                                Any excess must be refunded to the Cashier. Per COA Circular No. 97-002,
                                a new CA may not be granted to an officer with an outstanding unliquidated advance.
                            </p>
                        </div>
                    </Section>
                </Col>
            </Row>
        </ModernModal>
        </>
    );
}

// ─── New Liquidation Modal ────────────────────────────────────────────────────
var BLANK = {
    caRefNo: "", caType: "Local Travel", payee: "", designation: "", department: "",
    purpose: "", fundCluster: "01", orsNo: "", uacsCode: "50201010 00",
    amountGranted: "", dateGranted: "", dateDue: "",
    expenses: [],
};

function NewLiquidationModal({ show, onClose, onSave }) {
    const [form, setForm]     = useState({ ...BLANK });
    const [saving, setSaving] = useState(false);
    // Local expense line state
    const [expLine, setExpLine] = useState({ particular: "", uacs: "50201010 00", amount: "" });

    const set = k => v => setForm(f => ({ ...f, [k]: v }));

    const handlePayeeChange = name => {
        const found = PAYEES.find(p => p.name === name);
        if (found) setForm(f => ({ ...f, payee: found.name, designation: found.designation, department: found.department }));
        else setForm(f => ({ ...f, payee: name }));
    };

    const addExpense = () => {
        if (!expLine.particular.trim() || !expLine.amount) return;
        setForm(f => {
            const newExp = [...f.expenses, { ...expLine, amount: parseFloat(expLine.amount) || 0 }];
            return { ...f, expenses: newExp, totalExpenses: newExp.reduce((s, e) => s + e.amount, 0) };
        });
        setExpLine({ particular: "", uacs: "50201010 00", amount: "" });
    };

    const removeExpense = idx => {
        setForm(f => {
            const newExp = f.expenses.filter((_, i) => i !== idx);
            return { ...f, expenses: newExp, totalExpenses: newExp.reduce((s, e) => s + e.amount, 0) };
        });
    };

    const totalExp    = form.expenses.reduce((s, e) => s + e.amount, 0);
    const amtGranted  = parseFloat(form.amountGranted) || 0;
    const refund      = Math.max(0, amtGranted - totalExp);
    const canSave     = form.caRefNo && form.payee && form.purpose && amtGranted > 0;

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onSave({
                ...form,
                amountGranted: amtGranted,
                totalExpenses: totalExp,
                refundAmount: refund,
                dateGranted: form.dateGranted || new Date().toISOString().slice(0, 10),
                dateSettled: null, jevNo: null,
                status: "Pending",
                modifiedDate: new Date().toISOString(),
                modifiedBy: "Current User",
            });
            setSaving(false);
            setForm({ ...BLANK });
            setExpLine({ particular: "", uacs: "50201010 00", amount: "" });
        }, 600);
    };

    return (
        <ModernModal
            isProcess={true}
            title="New Liquidation Report"
            isOpen={show}
            onClose={() => { setForm({ ...BLANK }); onClose(); }}
            width="880px"
            isSaving={saving}
            canSave={!!canSave}
            onSave={handleSave}
        >
            <div>
                <Section title="Cash Advance Reference">
                    <Row>
                        <FField label="CA Reference No. *" col={4}>
                            <FInput value={form.caRefNo} onChange={set("caRefNo")} placeholder="e.g. CA-2025-06-0009" />
                        </FField>
                        <FField label="CA Type *" col={4}>
                            <FSelect value={form.caType} onChange={set("caType")}
                                options={Object.keys(CA_TYPES).map(t => ({ value: t, label: t }))} />
                        </FField>
                        <FField label="Fund Cluster" col={4}>
                            <FSelect value={form.fundCluster} onChange={set("fundCluster")}
                                options={Object.entries(FUND_CLUSTERS).map(([k, v]) => ({ value: k, label: k + " — " + v }))} />
                        </FField>
                    </Row>
                </Section>

                <Section title="Payee / Accountable Officer">
                    <Row>
                        <FField label="Payee / Officer *" col={6}>
                            <FSelect value={form.payee} onChange={handlePayeeChange}
                                options={[{ value: "", label: "— Select Payee —" }, ...PAYEES.map(p => ({ value: p.name, label: p.name }))]} />
                        </FField>
                        <FField label="Designation" col={3}>
                            <FInput value={form.designation} onChange={set("designation")} placeholder="Auto-filled" disabled={!!PAYEES.find(p => p.name === form.payee)} />
                        </FField>
                        <FField label="Department" col={3}>
                            <FSelect value={form.department} onChange={set("department")}
                                options={[{ value: "", label: "— Dept —" }, ...DEPARTMENTS.map(d => ({ value: d, label: d }))]} />
                        </FField>
                    </Row>
                </Section>

                <Section title="Activity Details & Financials">
                    <Row>
                        <FField label="Purpose / Activity *" col={12}>
                            <FInput value={form.purpose} onChange={set("purpose")} placeholder="Describe purpose of the cash advance..." />
                        </FField>
                        <FField label="ORS No." col={4}>
                            <FInput value={form.orsNo} onChange={set("orsNo")} placeholder="ORS-2025-06-00XXX" />
                        </FField>
                        <FField label="UACS Code" col={4}>
                            <FSelect value={form.uacsCode} onChange={set("uacsCode")}
                                options={Object.entries(UACS_CODES).map(([k, v]) => ({ value: k, label: k + " — " + v }))} />
                        </FField>
                        <FField label="Amount Granted (₱) *" col={4}>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text fw-semibold">₱</span>
                                <input type="number" className="form-control form-control-sm" min={0} step={0.01}
                                    value={form.amountGranted} onChange={e => set("amountGranted")(e.target.value)} placeholder="0.00" />
                            </div>
                        </FField>
                        <FField label="Date Granted" col={4}>
                            <FInput type="date" value={form.dateGranted} onChange={set("dateGranted")} />
                        </FField>
                        <FField label="Due Date" col={4}>
                            <FInput type="date" value={form.dateDue} onChange={set("dateDue")} />
                        </FField>
                    </Row>
                </Section>

                <Section title="Expense Line Items">
                    {/* Add line item row */}
                    <div className="d-flex gap-2 mb-3 align-items-end flex-wrap p-3 rounded-3 border" style={{ background: "var(--vz-light)" }}>
                        <div style={{ flex: 3, minWidth: 180 }}>
                            <FLabel>Particular</FLabel>
                            <FInput value={expLine.particular} onChange={v => setExpLine(e => ({ ...e, particular: v }))} placeholder="Describe the expense item..." />
                        </div>
                        <div style={{ flex: 2, minWidth: 150 }}>
                            <FLabel>UACS Code</FLabel>
                            <FSelect value={expLine.uacs} onChange={v => setExpLine(e => ({ ...e, uacs: v }))}
                                options={Object.entries(UACS_CODES).map(([k, v]) => ({ value: k, label: k }))} />
                        </div>
                        <div style={{ flex: 1, minWidth: 100 }}>
                            <FLabel>Amount (₱)</FLabel>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">₱</span>
                                <input type="number" className="form-control form-control-sm" min={0} step={0.01}
                                    value={expLine.amount} onChange={e => setExpLine(ex => ({ ...ex, amount: e.target.value }))} placeholder="0.00" />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={addExpense}
                                disabled={!expLine.particular.trim() || !expLine.amount}>
                                <i className="ri-add-line"></i> Add
                            </button>
                        </div>
                    </div>

                    {/* Line items table */}
                    {form.expenses.length > 0 ? (
                        <div className="border rounded-3 overflow-hidden mb-3">
                            <div className="d-flex px-3 py-2 table-light" style={{ borderBottom: "0.5px solid var(--vz-border-color)" }}>
                                <span className="fw-semibold text-muted" style={{ fontSize: "0.68rem", textTransform: "uppercase", width: 24 }}>#</span>
                                <span className="fw-semibold text-muted flex-grow-1" style={{ fontSize: "0.68rem", textTransform: "uppercase" }}>Particular</span>
                                <span className="fw-semibold text-muted text-center" style={{ fontSize: "0.68rem", textTransform: "uppercase", width: 110 }}>UACS</span>
                                <span className="fw-semibold text-muted text-end"   style={{ fontSize: "0.68rem", textTransform: "uppercase", width: 110 }}>Amount</span>
                                <span style={{ width: 32 }}></span>
                            </div>
                            {form.expenses.map((exp, i) => (
                                <div key={i} className="d-flex align-items-center px-3 py-2"
                                    style={{ background: i % 2 === 0 ? "var(--vz-card-bg)" : "var(--vz-light)", borderBottom: i < form.expenses.length - 1 ? "0.5px solid var(--vz-border-color)" : "none" }}>
                                    <span className="text-muted" style={{ fontSize: "0.72rem", width: 24 }}>{i + 1}</span>
                                    <span className="flex-grow-1" style={{ fontSize: "0.8rem" }}>{exp.particular}</span>
                                    <span className="font-monospace text-muted text-center" style={{ fontSize: "0.72rem", width: 110 }}>{exp.uacs}</span>
                                    <span className="fw-semibold text-end" style={{ fontSize: "0.82rem", width: 110, fontVariantNumeric: "tabular-nums" }}>{fmtPeso(exp.amount)}</span>
                                    <div style={{ width: 32, textAlign: "right" }}>
                                        <button className="btn btn-sm btn-soft-danger p-0 lh-1" style={{ width: 22, height: 22 }} onClick={() => removeExpense(i)}>
                                            <i className="ri-delete-bin-line" style={{ fontSize: "0.72rem" }}></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex align-items-center px-3 py-2 bg-primary-subtle" style={{ borderTop: "1px solid var(--vz-border-color)" }}>
                                <span style={{ width: 24 }}></span>
                                <span className="fw-bold text-primary flex-grow-1" style={{ fontSize: "0.8rem" }}>Total Expenses</span>
                                <span style={{ width: 110 }}></span>
                                <span className="fw-bold text-primary text-end" style={{ fontSize: "0.85rem", width: 110, fontVariantNumeric: "tabular-nums" }}>{fmtPeso(totalExp)}</span>
                                <span style={{ width: 32 }}></span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-3 text-muted border rounded-3 mb-3" style={{ fontSize: "0.8rem" }}>
                            <i className="ri-receipt-line d-block fs-4 mb-1 opacity-25"></i>
                            No expense items yet. Add items above.
                        </div>
                    )}

                    {/* Summary strip */}
                    {amtGranted > 0 && (
                        <div className="border rounded-3 overflow-hidden">
                            {[
                                { label: "Amount Granted",  value: amtGranted,  color: "primary" },
                                { label: "Total Expenses",  value: totalExp,    color: totalExp > amtGranted ? "danger" : "success" },
                                { label: "Refund to Govt",  value: refund,      color: refund > 0 ? "warning" : "secondary" },
                            ].map((row, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between px-3 py-2"
                                    style={{ background: i === 2 ? "var(--vz-warning-bg-subtle)" : "var(--vz-card-bg)", borderBottom: i < 2 ? "0.5px solid var(--vz-border-color)" : "none" }}>
                                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>{row.label}</span>
                                    <span className={"fw-bold text-" + row.color} style={{ fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" }}>{fmtPeso(row.value)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {!canSave && (
                        <p className="text-warning mb-0 mt-2" style={{ fontSize: "0.75rem" }}>
                            <i className="ri-error-warning-line me-1"></i>Fill in all required fields (*) to save.
                        </p>
                    )}
                </Section>
            </div>
        </ModernModal>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CashAdvanceLiquidation() {
    const [records, setRecords]       = useState(INITIAL_DATA);
    const [selected, setSelected]     = useState(null);
    const [showNew, setShowNew]       = useState(false);
    const [isExportExcel, setExport]  = useState(false);
    const [search, setSearch]         = useState("");
    const [statusFilter, setStatus]   = useState("All");
    const [typeFilter, setType]       = useState("All");
    const [showFilters, setFilters]   = useState(false);

    // ── Stats ──────────────────────────────────────────────────────────────────
    var totalGranted  = records.reduce((s, r) => s + r.amountGranted, 0);
    var totalExpenses = records.reduce((s, r) => s + r.totalExpenses, 0);
    var totalRefund   = records.reduce((s, r) => s + r.refundAmount, 0);
    var approvedCount = records.filter(r => r.status === "Approved").length;
    var pendingCount  = records.filter(r => r.status === "Pending" || r.status === "Submitted").length;

    const statusCounts = useMemo(() => {
        var c = {};
        records.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
        return c;
    }, [records]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSaveNew = form => {
        const newId = Math.max(...records.map(r => r.id), 0) + 1;
        setRecords(prev => [{ ...form, id: newId, refNo: `LIQ-2025-06-${String(newId).padStart(4, "0")}` }, ...prev]);
        setShowNew(false);
    };

    const handleApprove = item => {
        setRecords(prev => prev.map(r => r.id === item.id ? { ...r, status: "Approved", dateSettled: new Date().toISOString().slice(0, 10), jevNo: `JEV-2025-06-${String(r.id + 90).padStart(5, "0")}` } : r));
        setSelected(prev => prev ? { ...prev, status: "Approved" } : null);
    };

    const handleReturn = item => {
        setRecords(prev => prev.map(r => r.id === item.id ? { ...r, status: "Returned" } : r));
        setSelected(prev => prev ? { ...prev, status: "Returned" } : null);
    };

    const handleSubmit = item => {
        setRecords(prev => prev.map(r => r.id === item.id ? { ...r, status: "Submitted" } : r));
        setSelected(prev => prev ? { ...prev, status: "Submitted" } : null);
    };

    // ── Filter ─────────────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        var d = records;
        if (statusFilter !== "All") d = d.filter(r => r.status === statusFilter);
        if (typeFilter   !== "All") d = d.filter(r => r.caType  === typeFilter);
        if (search.trim()) {
            var q = search.toLowerCase();
            d = d.filter(r =>
                r.refNo.toLowerCase().includes(q)  ||
                r.caRefNo.toLowerCase().includes(q)||
                r.payee.toLowerCase().includes(q)  ||
                r.department.toLowerCase().includes(q)||
                r.purpose.toLowerCase().includes(q)
            );
        }
        return d;
    }, [records, search, statusFilter, typeFilter]);

    const hasFilters = search || statusFilter !== "All" || typeFilter !== "All";

    return (
        <div className="page-content">
            <ExportExcelModal show={isExportExcel} onCloseClick={() => setExport(false)} data={filtered} title="Export Liquidation Reports" />

            {/* Modals */}
            <LiquidationDetailModal
                item={selected ? records.find(r => r.id === selected.id) ?? selected : null}
                onClose={() => setSelected(null)}
                onApprove={handleApprove}
                onReturn={handleReturn}
                onSubmit={handleSubmit}
            />
            <NewLiquidationModal
                show={showNew}
                onClose={() => setShowNew(false)}
                onSave={handleSaveNew}
            />

            <Container fluid>
                <BreadCrumb title="Liquidations" crumbs={[{ title: "FMS", url: "/fms/dashboard" }]} />

                {/* ── Stat cards ──────────────────────────────────────────── */}
                <Row className="g-3 mb-4">
                    {[
                        { label: "Total Liquidations", value: records.length,  sub: pendingCount + " pending review",                   icon: "ri-file-list-3-line",  color: "primary",  prefix: "",  decimals: 0, sep: "" },
                        { label: "Total Expenses",     value: totalExpenses,   sub: "vs " + fmtPeso(totalGranted) + " granted",         icon: "bx bx-money",          color: "success",  prefix: "₱", decimals: 2, sep: "," },
                        { label: "Total Refunds",      value: totalRefund,     sub: records.filter(r => r.refundAmount > 0).length + " records with refund", icon: "ri-refund-2-line", color: totalRefund > 0 ? "warning" : "secondary", prefix: "₱", decimals: 2, sep: "," },
                        { label: "Approved",           value: approvedCount,   sub: "Fully settled & JEV posted",                       icon: "ri-checkbox-circle-line",color: "success", prefix: "",  decimals: 0, sep: "" },
                    ].map(s => (
                        <Col key={s.label} xl={3} sm={6}>
                            <Card className={"card-animate border-0 shadow-sm mb-0 h-100 border-top border-" + s.color} style={{ borderTopWidth: 3 }}>
                                <CardBody className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>{s.label}</p>
                                            <h3 className={"mb-0 fw-bold ff-secondary text-" + s.color}>
                                                {s.prefix && <span style={{ fontSize: "0.9rem", verticalAlign: "super" }}>{s.prefix}</span>}
                                                <CountUp start={0} end={s.value} duration={2.5} separator={s.sep} decimals={s.decimals} />
                                            </h3>
                                            <p className="mb-0 text-muted mt-1" style={{ fontSize: "0.72rem" }}>{s.sub}</p>
                                        </div>
                                        <div className={"bg-" + s.color + "-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 46, height: 46 }}>
                                            <i className={s.icon + " text-" + s.color + " fs-3"}></i>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* ── Table card ──────────────────────────────────────────── */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-bottom-0 pt-3 pb-2 px-4">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                                <h5 className="card-title mb-0">
                                    <i className="ri-file-list-3-line me-2 text-primary"></i>Liquidation Reports
                                </h5>
                                <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.78rem" }}>
                                    {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                                    {hasFilters ? " matching current filters" : ""}
                                    <span className="ms-1 opacity-75">· Click any row to view details</span>
                                </p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                <Button size="sm" color={showFilters ? "primary" : "light"} onClick={() => setFilters(v => !v)}>
                                    <i className="ri-filter-3-line me-1"></i>{showFilters ? "Hide" : "Filters"}
                                    {hasFilters && !showFilters && <span className="badge bg-danger ms-1 rounded-pill" style={{ fontSize: "0.6rem" }}>{[statusFilter !== "All", typeFilter !== "All", !!search].filter(Boolean).length}</span>}
                                </Button>
                                <div className="search-box" style={{ minWidth: 240 }}>
                                    <Input className="search bg-light border-light" placeholder="Search payee, ref no., purpose..."
                                        value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: "0.82rem" }} />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                                <Button size="sm" color="primary" className="d-flex align-items-center gap-1" onClick={() => setShowNew(true)}>
                                    <i className="ri-add-line"></i><span style={{ fontSize: "0.8rem" }}>New Liquidation</span>
                                </Button>
                                <Button size="sm" color="light" className="d-flex align-items-center gap-1" onClick={() => setExport(true)}>
                                    <i className="ri-download-2-line"></i><span style={{ fontSize: "0.8rem" }}>Export</span>
                                </Button>
                            </div>
                        </div>

                        <Collapse isOpen={showFilters}>
                            <div className="mt-3 pt-3 border-top">
                                <Row className="g-2">
                                    <Col lg={3} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Status</label>
                                        <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatus(e.target.value)}>
                                            <option value="All">All Statuses</option>
                                            {Object.keys(LIQ_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </Col>
                                    <Col lg={3} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>CA Type</label>
                                        <select className="form-select form-select-sm" value={typeFilter} onChange={e => setType(e.target.value)}>
                                            <option value="All">All Types</option>
                                            {Object.keys(CA_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </Col>
                                    <Col lg={2} sm={6} className="d-flex align-items-end">
                                        {hasFilters && (
                                            <Button size="sm" color="light" className="w-100" onClick={() => { setSearch(""); setStatus("All"); setType("All"); }}>
                                                <i className="ri-refresh-line me-1"></i>Clear
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        </Collapse>

                        {/* Status chips */}
                        <div className="d-flex flex-wrap gap-1 mt-2">
                            {["All", "Pending", "Submitted", "Approved", "Returned", "Disallowed"].map(f => {
                                const cnt    = f === "All" ? records.length : (statusCounts[f] || 0);
                                const scfg   = LIQ_STATUS[f] || { color: "secondary" };
                                return (
                                    <button key={f}
                                        className={"btn btn-sm rounded-pill " + (statusFilter === f ? "btn-primary" : "btn-soft-secondary")}
                                        style={{ fontSize: "0.7rem" }}
                                        onClick={() => setStatus(f)}>
                                        {f !== "All" && <i className={(scfg.icon || "") + " me-1"}></i>}
                                        {f} ({cnt})
                                    </button>
                                );
                            })}
                        </div>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="ri-file-search-line d-block fs-1 mb-2 opacity-25"></i>
                                <p className="fw-medium mb-0">No liquidation records found.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.8rem" }}>
                                    <thead className="table-light">
                                        <tr>
                                            {["Liquidation No.", "CA Reference", "Payee", "Amount Granted", "Total Expenses", "Refund", "JEV No.", "Status", "Last Updated", "Action"].map(h => (
                                                <th key={h} style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap",
                                                    paddingLeft: h === "Liquidation No." ? 20 : undefined,
                                                    paddingRight: h === "Action" ? 20 : undefined }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(row => {
                                            const typeCfg   = CA_TYPES[row.caType]   || { color: "secondary", icon: "ri-file-line" };
                                            const statusCfg = LIQ_STATUS[row.status] || { color: "secondary", icon: "ri-question-line" };
                                            const utilPct   = utilizationPct(row.totalExpenses, row.amountGranted);
                                            const over      = row.totalExpenses > row.amountGranted;
                                            return (
                                                <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => setSelected(row)}>
                                                    {/* Liquidation No. */}
                                                    <td style={{ paddingLeft: 20 }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className={"bg-" + typeCfg.color + "-subtle rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 28, height: 28 }}>
                                                                <i className={typeCfg.icon + " text-" + typeCfg.color} style={{ fontSize: "0.8rem" }}></i>
                                                            </div>
                                                            <div>
                                                                <span className={"fw-semibold text-" + typeCfg.color + " font-monospace"} style={{ fontSize: "0.78rem" }}>{row.refNo}</span>
                                                                <div><Badge color={typeCfg.color} className="rounded-pill" style={{ fontSize: "0.58rem" }}>{row.caType}</Badge></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* CA Ref */}
                                                    <td>
                                                        <span className="font-monospace text-muted" style={{ fontSize: "0.75rem" }}>
                                                            <i className="ri-links-line me-1"></i>{row.caRefNo}
                                                        </span>
                                                    </td>
                                                    {/* Payee */}
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 30, height: 30 }}>
                                                                <span className="fw-semibold text-primary" style={{ fontSize: "0.65rem" }}>{initials(row.payee)}</span>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-semibold" style={{ fontSize: "0.8rem" }}>{row.payee}</p>
                                                                <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>{row.department}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* Amount Granted */}
                                                    <td>
                                                        <span className="fw-semibold text-primary" style={{ fontSize: "0.82rem", fontVariantNumeric: "tabular-nums" }}>{fmtPeso(row.amountGranted)}</span>
                                                    </td>
                                                    {/* Total Expenses */}
                                                    <td>
                                                        <span className={"fw-bold " + (over ? "text-danger" : "text-success")} style={{ fontSize: "0.82rem", fontVariantNumeric: "tabular-nums" }}>
                                                            {row.totalExpenses > 0 ? fmtPeso(row.totalExpenses) : <span className="text-muted">—</span>}
                                                        </span>
                                                        {row.totalExpenses > 0 && (
                                                            <div className="mt-1">
                                                                <Progress value={utilPct} color={over ? "danger" : utilPct >= 90 ? "success" : "info"} style={{ height: 3, borderRadius: 2 }} />
                                                                <span className="text-muted" style={{ fontSize: "0.68rem" }}>{utilPct}% utilized</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    {/* Refund */}
                                                    <td>
                                                        {row.refundAmount > 0
                                                            ? <span className="fw-semibold text-warning" style={{ fontSize: "0.8rem", fontVariantNumeric: "tabular-nums" }}>{fmtPeso(row.refundAmount)}</span>
                                                            : <span className="text-muted opacity-50" style={{ fontSize: "0.78rem" }}>—</span>}
                                                    </td>
                                                    {/* JEV */}
                                                    <td>
                                                        {row.jevNo
                                                            ? <span className="badge bg-success-subtle text-success rounded-pill font-monospace" style={{ fontSize: "0.65rem" }}>{row.jevNo}</span>
                                                            : <span className="badge bg-light text-muted rounded-pill border" style={{ fontSize: "0.65rem" }}>Not yet posted</span>}
                                                    </td>
                                                    {/* Status */}
                                                    <td>
                                                        <Badge color={statusCfg.color} className="rounded-pill" style={{ fontSize: "0.68rem" }}>
                                                            <i className={statusCfg.icon + " me-1"}></i>{row.status}
                                                        </Badge>
                                                    </td>
                                                    {/* Last Updated */}
                                                    <td>
                                                        <p className="mb-0 font-monospace text-muted" style={{ fontSize: "0.75rem" }}>
                                                            {fmtDate(row.modifiedDate)} <span style={{ opacity: 0.7 }}>{fmtTime(row.modifiedDate)}</span>
                                                        </p>
                                                        <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>
                                                            <i className="ri-user-line me-1"></i>{row.modifiedBy}
                                                        </p>
                                                    </td>
                                                    {/* Action — td stops propagation, buttons handle their own actions */}
                                                    <td style={{ paddingRight: 20 }} onClick={e => e.stopPropagation()}>
                                                        <div className="d-flex gap-1">
                                                            <button className="btn btn-sm btn-soft-primary p-1 lh-1" title="View" onClick={() => setSelected(row)}>
                                                                <i className="ri-eye-line fs-6"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan={3} className="text-muted" style={{ fontSize: "0.72rem", paddingLeft: 20 }}>
                                                {filtered.length} of {records.length} records
                                            </td>
                                            <td>
                                                <span className="fw-bold text-primary" style={{ fontSize: "0.78rem", fontVariantNumeric: "tabular-nums" }}>
                                                    {fmtPeso(filtered.reduce((s, r) => s + r.amountGranted, 0))}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-bold text-success" style={{ fontSize: "0.78rem", fontVariantNumeric: "tabular-nums" }}>
                                                    {fmtPeso(filtered.reduce((s, r) => s + r.totalExpenses, 0))}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-semibold text-warning" style={{ fontSize: "0.78rem", fontVariantNumeric: "tabular-nums" }}>
                                                    {fmtPeso(filtered.reduce((s, r) => s + r.refundAmount, 0))}
                                                </span>
                                            </td>
                                            <td colSpan={4}></td>
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
}