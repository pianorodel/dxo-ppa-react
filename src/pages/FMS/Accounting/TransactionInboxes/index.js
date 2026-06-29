import { useState, useMemo } from "react";
import {
    Container, Row, Col, Card, CardBody, CardHeader,
    Badge, Button, Input, InputGroup, InputGroupText,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Collapse,
} from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import JournalEntryVouchersSaveModal from "@/pages/FMS/Transactions/JournalEntryVouchers/Components/SaveModal";

// ─── Mock Data ────────────────────────────────────────────────────────────────
var MOCK_DATA = [
    {
        id: 1,
        refNo:        "DVF2025-06-00001",
        refType:      "DVF",
        date:         "06/02/2025",
        particulars:  "Payment of Office Supplies for the month of May 2025 per Sales Invoice No. 6348 dated May 15, 2025",
        amount:       25000.00,
        fund:         "Regular Agency Fund - General Fund",
        fundCluster:  "01",
        remarks:      "For immediate payment",
        templateCode: "DJE001",
        status:       "Pending",
    },
    {
        id: 2,
        refNo:        "DVF2V-2025-03-00001",
        refType:      "DVF2V",
        date:         "06/03/2025",
        particulars:  "Payment for Phase 2 Bids to Contractors - Payment for the 15% Mobilization fee for the Six Storey East Wing Building Construction Project in Manila",
        amount:       59820000.00,
        fund:         "Infrastructure Development Fund",
        fundCluster:  "05",
        remarks:      "Phase 2 construction payment - Major construction project",
        templateCode: "DJE009",
        status:       "Pending",
    },
    {
        id: 3,
        refNo:        "DVF2025-06-00002",
        refType:      "DVF",
        date:         "06/04/2025",
        particulars:  "Payment for fuel consumption of MADA patrol boats for emergency response with the May 2025",
        amount:       15000000.00,
        fund:         "Regular Agency Fund - General Fund",
        fundCluster:  "01",
        remarks:      "Monthly fuel allocation",
        templateCode: "DJE001",
        status:       "Pending",
    },
    {
        id: 4,
        refNo:        "DVF2025-06-00003",
        refType:      "DVF",
        date:         "06/04/2025",
        particulars:  "Payment of hazard pay for traffic enforcers and head count employees for May 2025",
        amount:       752225.98,
        fund:         "Regular Agency Fund - General Fund",
        fundCluster:  "01",
        remarks:      "Monthly hazard pay",
        templateCode: "DJE001",
        status:       "Pending",
    },
    {
        id: 5,
        refNo:        "DVF2025-06-00004",
        refType:      "DVF",
        date:         "06/06/2025",
        particulars:  "Payment for IT equipment and Software licenses for office modernization project",
        amount:       12600000.00,
        fund:         "Special Agency Fund",
        fundCluster:  "02",
        remarks:      "IT modernization phase 1",
        templateCode: "DJE002",
        status:       "Processed",
    },
    {
        id: 6,
        refNo:        "CDU2025-06-00102",
        refType:      "CDU",
        date:         "06/02/2025",
        particulars:  "Collection of Business Tax for June 2025",
        amount:       150000.00,
        fund:         "General Fund",
        fundCluster:  "01",
        remarks:      "Daily collection",
        templateCode: "CDU001",
        status:       "Pending",
    },
    {
        id: 7,
        refNo:        "CDU2025-06-00158",
        refType:      "CDU",
        date:         "06/03/2025",
        particulars:  "Collection of environmental fees from commercial establishments along EDSA and C5 Road",
        amount:       180000000.00,
        fund:         "Environmental Management Fund",
        fundCluster:  "03",
        remarks:      "Monthly environmental fee collection",
        templateCode: "CDU002",
        status:       "Pending",
    },
    {
        id: 8,
        refNo:        "CDU2025-06-00159",
        refType:      "CDU",
        date:         "06/04/2025",
        particulars:  "Collection of parking fees from designated parking areas in Central Business District and Ortigas Business District for the month of June 2025",
        amount:       155000000.00,
        fund:         "Traffic Management Fund",
        fundCluster:  "04",
        remarks:      "Daily parking fee collection",
        templateCode: "CDU003",
        status:       "Pending",
    },
    {
        id: 9,
        refNo:        "CDU2025-06-00170",
        refType:      "CDU",
        date:         "06/04/2025",
        particulars:  "Collection of traffic violation fees from Metro Manila Traffic Violator System for the month of May 2025 — covering all districts",
        amount:       260731186.42,
        fund:         "Traffic Management Fund",
        fundCluster:  "04",
        remarks:      "Monthly violation fee collection",
        templateCode: "CDU001",
        status:       "Processed",
    },
    {
        id: 10,
        refNo:        "DVF2025-06-00005",
        refType:      "DVF",
        date:         "06/07/2025",
        particulars:  "Payment of salaries and wages for contractual employees for the month of May 2025",
        amount:       3450000.00,
        fund:         "Regular Agency Fund - General Fund",
        fundCluster:  "01",
        remarks:      "Monthly payroll - contractual",
        templateCode: "DJE001",
        status:       "Pending",
    },
    {
        id: 11,
        refNo:        "CDU2025-06-00181",
        refType:      "CDU",
        date:         "06/08/2025",
        particulars:  "Collection of market stall rentals and fees from Divisoria Market for June 2025",
        amount:       2875000.00,
        fund:         "General Fund",
        fundCluster:  "01",
        remarks:      "Monthly market collection",
        templateCode: "CDU001",
        status:       "Pending",
    },
    {
        id: 12,
        refNo:        "DVF2025-06-00006",
        refType:      "DVF",
        date:         "06/09/2025",
        particulars:  "Payment for medical supplies and equipment for city health centers for Q2 2025",
        amount:       8120000.00,
        fund:         "Special Agency Fund",
        fundCluster:  "02",
        remarks:      "Quarterly health supply procurement",
        templateCode: "DJE002",
        status:       "Pending",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
var PAGE_SIZES = [10, 25, 50];

function fmt(n) {
    return new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

var REF_TYPE_COLOR = {
    DVF:   "primary",
    DVF2V: "info",
    CDU:   "success",
};

var TEMPLATE_BADGE = {
    DJE001: "warning",
    DJE002: "info",
    DJE009: "danger",
    CDU001: "success",
    CDU002: "primary",
    CDU003: "secondary",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose, onPrepare }) {
    if (!item) return null;
    var typeColor = REF_TYPE_COLOR[item.refType] || "secondary";
    var statusColor = item.status === "Processed" ? "success" : "warning";

    return (
        <Modal isOpen size="lg" centered scrollable toggle={onClose}>
            <ModalHeader toggle={onClose} className="border-bottom-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                    <div className={"bg-" + typeColor + "-subtle rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"}
                        style={{ width: 40, height: 40 }}>
                        <i className={"ri-file-list-3-line text-" + typeColor + " fs-3"}></i>
                    </div>
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <p className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>{item.refNo}</p>
                            <Badge color={typeColor} className="rounded-pill" style={{ fontSize: "0.65rem" }}>{item.refType}</Badge>
                            <Badge color={statusColor} className="rounded-pill" style={{ fontSize: "0.65rem" }}>{item.status}</Badge>
                        </div>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.74rem" }}>
                            <i className="ri-calendar-line me-1"></i>{item.date}
                        </p>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="pt-2 px-4">
                {/* Particulars */}
                <div className="p-3 rounded-3 bg-light bg-opacity-50 border mb-3">
                    <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.07em" }}>Particulars</p>
                    <p className="mb-0 fw-semibold" style={{ fontSize: "0.85rem" }}>{item.particulars}</p>
                </div>

                <Row className="g-2">
                    {[
                        ["Amount",        fmt(item.amount),    "bx bx-money", "success"],
                        ["Fund",          item.fund,           "ri-bank-line",              "primary"],
                        ["Fund Cluster",  item.fundCluster,    "ri-folder-3-line",          "info"],
                        ["Template Code", item.templateCode,   "ri-code-line",              "warning"],
                        ["Date",          item.date,           "ri-calendar-line",          "secondary"],
                        ["Remarks",       item.remarks,        "ri-chat-1-line",            "secondary"],
                    ].map(function(row) {
                        return (
                            <Col key={row[0]} sm={6}>
                                <div className="d-flex flex-column p-2 rounded-3 border h-100">
                                    <div className="d-flex align-items-center gap-1 mb-1">
                                        <i className={row[2] + " text-" + row[3]} style={{ fontSize: "0.75rem" }}></i>
                                        <p className="mb-0 text-muted" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{row[0]}</p>
                                    </div>
                                    <p className="mb-0 fw-semibold" style={{ fontSize: "0.83rem" }}>{row[1]}</p>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </ModalBody>
            <ModalFooter className="border-top-0 pt-0 gap-2">
                <Button color="light" onClick={onClose}>
                    <i className="ri-close-line me-1"></i>Close
                </Button>
                {item.status !== "Processed" && (
                    <Button color="primary" onClick={function() { onPrepare(item); onClose(); }}>
                        <i className="ri-file-text-line me-1"></i>Prepare JEV
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TransactionInboxes() {
    var [data]             = useState(MOCK_DATA);
    var [search, setSearch]         = useState("");
    var [showFilters, setShowFilters] = useState(false);
    var [filterType, setFilterType]   = useState("All");
    var [filterStatus, setFilterStatus] = useState("All");
    var [filterTemplate, setFilterTemplate] = useState("All");
    var [dateFrom, setDateFrom]       = useState("");
    var [dateTo, setDateTo]           = useState("");
    var [page, setPage]               = useState(1);
    var [pageSize, setPageSize]       = useState(10);
    var [expandedRow, setExpandedRow] = useState(null);
    var [selected, setSelected]       = useState(null);
    var [saveItem, setSaveItem]        = useState(null);
    var [sortCol, setSortCol]         = useState("date");
    var [sortDir, setSortDir]         = useState("asc");

    // ── Totals ──────────────────────────────────────────────────────────────────
    var totalAmount  = data.reduce(function(s, r) { return s + r.amount; }, 0);
    var pendingCount = data.filter(function(r) { return r.status === "Pending"; }).length;
    var processedCount = data.filter(function(r) { return r.status === "Processed"; }).length;
    var uniqueTemplates = Array.from(new Set(data.map(function(r) { return r.templateCode; }))).sort();
    var uniqueTypes     = ["All"].concat(Array.from(new Set(data.map(function(r) { return r.refType; }))).sort());

    // ── Filter + Sort ───────────────────────────────────────────────────────────
    var filtered = useMemo(function() {
        var d = data;
        if (search.trim()) {
            var q = search.toLowerCase();
            d = d.filter(function(r) {
                return r.refNo.toLowerCase().includes(q)
                    || r.particulars.toLowerCase().includes(q)
                    || r.fund.toLowerCase().includes(q)
                    || r.remarks.toLowerCase().includes(q)
                    || r.templateCode.toLowerCase().includes(q);
            });
        }
        if (filterType !== "All")     d = d.filter(function(r) { return r.refType === filterType; });
        if (filterStatus !== "All")   d = d.filter(function(r) { return r.status === filterStatus; });
        if (filterTemplate !== "All") d = d.filter(function(r) { return r.templateCode === filterTemplate; });
        if (dateFrom) d = d.filter(function(r) { return r.date >= dateFrom.split("-").reverse().join("/"); });
        if (dateTo)   d = d.filter(function(r) { return r.date <= dateTo.split("-").reverse().join("/"); });

        return d.slice().sort(function(a, b) {
            var va = a[sortCol], vb = b[sortCol];
            if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
            va = String(va).toLowerCase(); vb = String(vb).toLowerCase();
            return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });
    }, [data, search, filterType, filterStatus, filterTemplate, dateFrom, dateTo, sortCol, sortDir]);

    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    var pageData   = filtered.slice((page - 1) * pageSize, page * pageSize);
    var filteredTotal = filtered.reduce(function(s, r) { return s + r.amount; }, 0);

    var pageBtns = useMemo(function() {
        var btns = [], delta = 2;
        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) btns.push(i);
            else if (btns[btns.length - 1] !== "...") btns.push("...");
        }
        return btns;
    }, [page, totalPages]);

    function handleSort(col) {
        if (sortCol === col) setSortDir(function(d) { return d === "asc" ? "desc" : "asc"; });
        else { setSortCol(col); setSortDir("asc"); }
        setPage(1);
    }

    function SortIcon(col) {
        if (sortCol !== col) return <i className="ri-arrow-up-down-line ms-1 opacity-25" style={{ fontSize: "0.7rem" }}></i>;
        return sortDir === "asc"
            ? <i className="ri-arrow-up-line ms-1 text-primary" style={{ fontSize: "0.7rem" }}></i>
            : <i className="ri-arrow-down-line ms-1 text-primary" style={{ fontSize: "0.7rem" }}></i>;
    }

    function resetFilters() {
        setSearch(""); setFilterType("All"); setFilterStatus("All");
        setFilterTemplate("All"); setDateFrom(""); setDateTo(""); setPage(1);
    }

    var hasFilters = search || filterType !== "All" || filterStatus !== "All"
        || filterTemplate !== "All" || dateFrom || dateTo;

    var TRUNCATE_LEN = 80;

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Transaction Inboxes" crumbs={[
                    { title: "FMS", url: "/fms/dashboard" },
                ]} />

                {/* ══ STAT STRIP ════════════════════════════════════════════════ */}
                <Row className="g-3 mb-4">
                    {[
                        { label: "Total Transactions", value: data.length,                    icon: "ri-inbox-archive-line",       color: "primary",   text: null          },
                        { label: "Pending JEV",        value: pendingCount,                   icon: "ri-time-line",                color: "warning",   text: null          },
                        { label: "Processed",          value: processedCount,                  icon: "ri-checkbox-circle-line",     color: "success",   text: null          },
                        { label: "Total Amount",       value: "₱" + new Intl.NumberFormat("en-PH", { notation: "compact", maximumFractionDigits: 2 }).format(totalAmount),
                          icon: "bx bx-money", color: "info", text: true },
                    ].map(function(s) {
                        return (
                            <Col key={s.label} xl={3} sm={6}>
                                <Card className="card-animate border-0 shadow-sm mb-0">
                                    <CardBody className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <p className="text-uppercase fw-semibold text-muted mb-1"
                                                    style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>{s.label}</p>
                                                <h4 className="mb-0 fw-bold ff-secondary">{s.value}</h4>
                                            </div>
                                            <div className={"bg-" + s.color + "-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"}
                                                style={{ width: 46, height: 46 }}>
                                                <i className={s.icon + " text-" + s.color + " fs-3"}></i>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* ══ MAIN TABLE CARD ═══════════════════════════════════════════ */}
                <Card className="border-0 shadow-sm">
                    {/* ── Toolbar ───────────────────────────────────────────────── */}
                    <CardHeader className="border-bottom-0 pt-3 pb-2 px-4">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                                <h5 className="card-title mb-0">
                                    <i className="ri-inbox-archive-line me-2 text-primary"></i>
                                    Transaction Inboxes
                                </h5>
                                <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.78rem" }}>
                                    {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
                                    {hasFilters ? " matching current filters" : " ready for JEV preparation"}
                                </p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                {/* Show Filters toggle */}
                                <Button
                                    size="sm"
                                    color={showFilters ? "primary" : "light"}
                                    onClick={function() { setShowFilters(function(v) { return !v; }); }}
                                >
                                    <i className="ri-filter-3-line me-1"></i>
                                    {showFilters ? "Hide Filters" : "Show Filters"}
                                    {hasFilters && !showFilters && (
                                        <span className="badge bg-danger ms-1 rounded-pill" style={{ fontSize: "0.6rem" }}>
                                            {[search, filterType !== "All", filterStatus !== "All", filterTemplate !== "All", dateFrom, dateTo].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>

                                {/* Search */}
                                <div className="search-box" style={{ minWidth: 260 }}>
                                    <Input
                                        className="search bg-light border-light"
                                        placeholder="Search ref no., particulars, fund, template..."
                                        value={search}
                                        onChange={function(e) { setSearch(e.target.value); setPage(1); }}
                                        style={{ fontSize: "0.82rem" }}
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>

                                {/* Page size */}
                                <select className="form-select form-select-sm" style={{ width: 72 }}
                                    value={pageSize}
                                    onChange={function(e) { setPageSize(+e.target.value); setPage(1); }}>
                                    {PAGE_SIZES.map(function(n) { return <option key={n} value={n}>{n}</option>; })}
                                </select>

                                {/* Export */}
                                <Button size="sm" color="success" outline>
                                    <i className="ri-download-2-line me-1"></i>Export
                                </Button>
                            </div>
                        </div>

                        {/* ── Collapsible Filters ──────────────────────────────── */}
                        <Collapse isOpen={showFilters}>
                            <div className="mt-3 pt-3 border-top">
                                <Row className="g-2">
                                    <Col lg={2} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Reference Type</label>
                                        <select className="form-select form-select-sm" value={filterType}
                                            onChange={function(e) { setFilterType(e.target.value); setPage(1); }}>
                                            {uniqueTypes.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
                                        </select>
                                    </Col>
                                    <Col lg={2} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Status</label>
                                        <select className="form-select form-select-sm" value={filterStatus}
                                            onChange={function(e) { setFilterStatus(e.target.value); setPage(1); }}>
                                            <option value="All">All</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Processed">Processed</option>
                                        </select>
                                    </Col>
                                    <Col lg={2} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Template Code</label>
                                        <select className="form-select form-select-sm" value={filterTemplate}
                                            onChange={function(e) { setFilterTemplate(e.target.value); setPage(1); }}>
                                            <option value="All">All</option>
                                            {uniqueTemplates.map(function(t) { return <option key={t} value={t}>{t}</option>; })}
                                        </select>
                                    </Col>
                                    <Col lg={2} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Date From</label>
                                        <Input type="date" bsSize="sm" value={dateFrom}
                                            onChange={function(e) { setDateFrom(e.target.value); setPage(1); }} />
                                    </Col>
                                    <Col lg={2} sm={6}>
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: "0.72rem" }}>Date To</label>
                                        <Input type="date" bsSize="sm" value={dateTo}
                                            onChange={function(e) { setDateTo(e.target.value); setPage(1); }} />
                                    </Col>
                                    <Col lg={2} sm={6} className="d-flex align-items-end">
                                        {hasFilters && (
                                            <Button size="sm" color="light" className="w-100" onClick={resetFilters}>
                                                <i className="ri-refresh-line me-1"></i>Clear Filters
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                {/* Active filter chips */}
                                {hasFilters && (
                                    <div className="d-flex flex-wrap gap-1 mt-2">
                                        {search && (
                                            <Badge color="primary" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>
                                                <i className="ri-search-line me-1"></i>"{search}"
                                            </Badge>
                                        )}
                                        {filterType !== "All" && (
                                            <Badge color="info" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>Type: {filterType}</Badge>
                                        )}
                                        {filterStatus !== "All" && (
                                            <Badge color="warning" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>Status: {filterStatus}</Badge>
                                        )}
                                        {filterTemplate !== "All" && (
                                            <Badge color="success" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>Template: {filterTemplate}</Badge>
                                        )}
                                        {dateFrom && (
                                            <Badge color="secondary" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>From: {dateFrom}</Badge>
                                        )}
                                        {dateTo && (
                                            <Badge color="secondary" className="rounded-pill fw-normal" style={{ fontSize: "0.7rem" }}>To: {dateTo}</Badge>
                                        )}
                                        <span className="text-muted" style={{ fontSize: "0.7rem", alignSelf: "center" }}>
                                            — {filtered.length} result{filtered.length !== 1 ? "s" : ""} &nbsp;·&nbsp;
                                            ₱{new Intl.NumberFormat("en-PH", { notation: "compact", maximumFractionDigits: 2 }).format(filteredTotal)} total
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Collapse>
                    </CardHeader>

                    {/* ── Table ─────────────────────────────────────────────────── */}
                    <CardBody className="p-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="ri-inbox-line d-block fs-1 mb-2 opacity-25"></i>
                                <p className="fw-medium mb-1">No transactions found.</p>
                                <Button size="sm" color="link" onClick={resetFilters}>Clear all filters</Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.8rem" }}>
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: 28 }}></th>
                                            <th style={{ cursor: "pointer", minWidth: 160, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em", paddingLeft: 20 }}
                                                onClick={function() { handleSort("refNo"); }}>
                                                Reference No. {SortIcon("refNo")}
                                            </th>
                                            <th style={{ cursor: "pointer", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function() { handleSort("date"); }}>
                                                Date {SortIcon("date")}
                                            </th>
                                            <th style={{ minWidth: 280, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Particulars</th>
                                            <th style={{ cursor: "pointer", textAlign: "right", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function() { handleSort("amount"); }}>
                                                Amount {SortIcon("amount")}
                                            </th>
                                            <th style={{ minWidth: 160, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Fund</th>
                                            <th style={{ minWidth: 140, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Remarks</th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Template</th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em", paddingRight: 20 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageData.map(function(row) {
                                            var typeColor    = REF_TYPE_COLOR[row.refType]          || "secondary";
                                            var tmplColor    = TEMPLATE_BADGE[row.templateCode]     || "secondary";
                                            var statusColor  = row.status === "Processed" ? "success" : "warning";
                                            var isExpanded   = expandedRow === row.id;
                                            var needsTruncate = row.particulars.length > TRUNCATE_LEN;
                                            var displayText  = isExpanded || !needsTruncate
                                                ? row.particulars
                                                : row.particulars.slice(0, TRUNCATE_LEN) + "…";

                                            return (
                                                <tr key={row.id}
                                                    style={{ borderLeft: "3px solid " + (row.status === "Processed" ? "var(--vz-success)" : "transparent") }}>
                                                    {/* Expand toggle */}
                                                    <td style={{ paddingLeft: 10, paddingRight: 0 }}>
                                                        {needsTruncate && (
                                                            <button
                                                                className="btn btn-sm p-0 lh-1 text-muted"
                                                                style={{ width: 18, height: 18, fontSize: "0.7rem" }}
                                                                onClick={function() {
                                                                    setExpandedRow(function(prev) { return prev === row.id ? null : row.id; });
                                                                }}
                                                                title={isExpanded ? "Collapse" : "Expand"}
                                                            >
                                                                <i className={isExpanded ? "ri-subtract-line" : "ri-add-line"}></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                    {/* Ref No */}
                                                    <td style={{ paddingLeft: 20 }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className={"bg-" + typeColor + "-subtle rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"}
                                                                style={{ width: 26, height: 26 }}>
                                                                <i className={"ri-file-list-line text-" + typeColor} style={{ fontSize: "0.78rem" }}></i>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className={"btn btn-link p-0 fw-semibold text-" + typeColor}
                                                                    style={{ fontSize: "0.78rem", textDecoration: "none" }}
                                                                    onClick={function() { setSelected(row); }}
                                                                >
                                                                    {row.refNo}
                                                                </button>
                                                                <div>
                                                                    <Badge color={typeColor} className="rounded-pill" style={{ fontSize: "0.58rem" }}>{row.refType}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* Date */}
                                                    <td>
                                                        <span className="font-monospace text-muted" style={{ fontSize: "0.78rem" }}>{row.date}</span>
                                                    </td>
                                                    {/* Particulars */}
                                                    <td>
                                                        <p className="mb-0" style={{ fontSize: "0.78rem", lineHeight: 1.4 }}>
                                                            {displayText}
                                                            {needsTruncate && !isExpanded && (
                                                                <button
                                                                    className="btn btn-link p-0 ms-1 text-primary"
                                                                    style={{ fontSize: "0.72rem", verticalAlign: "baseline" }}
                                                                    onClick={function() { setExpandedRow(row.id); }}
                                                                >
                                                                    See more
                                                                </button>
                                                            )}
                                                            {needsTruncate && isExpanded && (
                                                                <button
                                                                    className="btn btn-link p-0 ms-1 text-muted"
                                                                    style={{ fontSize: "0.72rem", verticalAlign: "baseline" }}
                                                                    onClick={function() { setExpandedRow(null); }}
                                                                >
                                                                    See less
                                                                </button>
                                                            )}
                                                        </p>
                                                    </td>
                                                    {/* Amount */}
                                                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                                        <span className="fw-bold" style={{ fontSize: "0.82rem" }}>
                                                            {fmt(row.amount)}
                                                        </span>
                                                    </td>
                                                    {/* Fund */}
                                                    <td>
                                                        <p className="mb-0 text-truncate" style={{ maxWidth: 160, fontSize: "0.78rem" }} title={row.fund}>
                                                            {row.fund}
                                                        </p>
                                                        <span className="badge bg-light text-muted border" style={{ fontSize: "0.6rem" }}>
                                                            FC-{row.fundCluster}
                                                        </span>
                                                    </td>
                                                    {/* Remarks */}
                                                    <td>
                                                        <p className="mb-0 text-muted text-truncate" style={{ maxWidth: 160, fontSize: "0.78rem" }} title={row.remarks}>
                                                            {row.remarks}
                                                        </p>
                                                    </td>
                                                    {/* Template */}
                                                    <td style={{ textAlign: "center" }}>
                                                        <Badge color={tmplColor} className="rounded-pill" style={{ fontSize: "0.68rem" }}>
                                                            {row.templateCode}
                                                        </Badge>
                                                    </td>
                                                    {/* Status */}
                                                    <td style={{ textAlign: "center" }}>
                                                        <Badge
                                                            color={statusColor}
                                                            className="rounded-pill"
                                                            style={{ fontSize: "0.68rem" }}
                                                        >
                                                            {row.status === "Pending"
                                                                ? <><i className="ri-time-line me-1"></i>Pending</>
                                                                : <><i className="ri-checkbox-circle-line me-1"></i>Processed</>
                                                            }
                                                        </Badge>
                                                    </td>
                                                    {/* Action */}
                                                    <td style={{ textAlign: "center", paddingRight: 20 }}>
                                                        {row.status !== "Processed" ? (
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                                                                onClick={function() { setSaveItem(row); }}
                                                            >
                                                                <i className="ri-file-text-line me-1"></i>Prepare JEV
                                                            </Button>
                                                        ) : (
                                                            <button className="btn btn-sm btn-soft-success" style={{ fontSize: "0.72rem" }}
                                                                onClick={function() { setSelected(row); }}>
                                                                <i className="ri-eye-line me-1"></i>View
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan={4} className="fw-semibold text-end pe-3" style={{ fontSize: "0.78rem", paddingLeft: 20 }}>
                                                Page Total ({pageData.length} records):
                                            </td>
                                            <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                                <span className="fw-bold text-success" style={{ fontSize: "0.82rem" }}>
                                                    {fmt(pageData.reduce(function(s, r) { return s + r.amount; }, 0))}
                                                </span>
                                            </td>
                                            <td colSpan={5} className="text-muted ps-2" style={{ fontSize: "0.72rem" }}>
                                                Filtered total: ₱{new Intl.NumberFormat("en-PH", { notation: "compact", maximumFractionDigits: 2 }).format(filteredTotal)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardBody>

                    {/* ── Pagination ─────────────────────────────────────────────── */}
                    {filtered.length > 0 && (
                        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-top flex-wrap gap-2">
                            <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
                            </p>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={"page-item " + (page === 1 ? "disabled" : "")}>
                                    <button className="page-link" onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }}>
                                        <i className="ri-arrow-left-s-line"></i>
                                    </button>
                                </li>
                                {pageBtns.map(function(b, i) {
                                    return (
                                        <li key={i} className={"page-item " + (b === page ? "active" : "") + " " + (b === "..." ? "disabled" : "")}>
                                            <button className="page-link" onClick={function() { if (b !== "...") setPage(b); }}>{b}</button>
                                        </li>
                                    );
                                })}
                                <li className={"page-item " + (page === totalPages ? "disabled" : "")}>
                                    <button className="page-link" onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }}>
                                        <i className="ri-arrow-right-s-line"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </Card>

                {/* Detail / View Modal */}
                <DetailModal
                    item={selected}
                    onClose={function() { setSelected(null); }}
                    onPrepare={function(item) {
                        setSelected(null);
                        setSaveItem(item);
                    }}
                />

                {/* Prepare JEV — SaveModal */}
                <JournalEntryVouchersSaveModal
                    show={!!saveItem}
                    data={saveItem}
                    onCloseClick={function() { setSaveItem(null); }}
                />
            </Container>
        </div>
    );
}