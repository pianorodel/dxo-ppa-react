import React, { useState, useMemo } from "react";
import { Col, Container, Row, Card, CardBody, CardHeader } from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import TableContainer from "@/components/Common/TableContainer";

const SEED_CONTRACTS = [
    {
        id: "PE-2025-001",
        contract_no: "PE-2025-001",
        prepaid_type: "Prepaid Rent",
        payee: "Ayala Land Inc.",
        total_amount: "360000",
        start_date: "2025-01-01",
        months: 12,
        monthly_amount: "30000",
        asset_code: "1-19-01-010-00",
        expense_code: "5-02-03-010-00",
        status: "Active",
        balance: "360000",
    },
    {
        id: "PE-2025-002",
        contract_no: "PE-2025-002",
        prepaid_type: "Prepaid Internet / Telecom",
        payee: "PLDT Enterprise",
        total_amount: "84000",
        start_date: "2025-01-01",
        months: 12,
        monthly_amount: "7000",
        asset_code: "1-19-01-020-00",
        expense_code: "5-02-03-070-00",
        status: "Active",
        balance: "84000",
    },
];

function generateSchedule(contract) {
    if (!contract) return [];
    const start = new Date(contract.start_date);
    const monthlyAmt = parseFloat(contract.monthly_amount) || 0;
    const total = parseFloat(contract.total_amount) || 0;
    const months = parseInt(contract.months) || 12;
    const rows = [];
    let balance = total;
    for (let i = 0; i < months; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const label = d.toLocaleString("en-PH", { month: "long", year: "numeric" });
        const amort = i === months - 1 ? balance : Math.min(monthlyAmt, balance);
        balance -= amort;
        rows.push({ month: i + 1, label, amort, balance: Math.max(balance, 0), posted: false });
    }
    return rows;
}

function fmt(n) {
    return Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

const getColumns = () => [
    {
        header: "#",
        accessorKey: "month",
        size: 40,
        cell: ({ getValue }) => (
            <span className="text-muted" style={{ fontSize: "0.78rem" }}>{getValue()}</span>
        ),
    },
    {
        header: "Period",
        accessorKey: "label",
        cell: ({ getValue }) => (
            <span style={{ fontSize: "0.78rem" }}>{getValue()}</span>
        ),
    },
    {
        header: "Debit — Expense",
        accessorKey: "amort",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-success" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Credit — Prepaid",
        accessorKey: "amort",
        id: "credit",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-danger" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Asset Balance",
        accessorKey: "balance",
        cell: ({ getValue }) => (
            <span className="fw-bold" style={{ fontSize: "0.78rem", color: getValue() === 0 ? "#878a99" : "#f7b84b" }}>
                ₱{fmt(getValue())}
            </span>
        ),
    },
    {
        header: "Status",
        accessorKey: "posted",
        cell: ({ getValue }) => (
            getValue()
                ? <span className="badge bg-success-subtle text-success">Posted</span>
                : <span className="badge bg-warning-subtle text-warning">Pending</span>
        ),
    },
];

const DesktopView = () => {

    const [selectedId, setSelectedId] = useState(SEED_CONTRACTS[0].id);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);

    const contract = SEED_CONTRACTS.find(c => c.id === selectedId);
    const schedule = useMemo(() => generateSchedule(contract), [contract]);
    const columns  = useMemo(() => getColumns(), []);
    const pageCount = Math.ceil(schedule.length / pageSize) || 0;

    const STAT_ITEMS = [
        { label: "Payee",        value: contract.payee,                    color: "primary", icon: "ri-user-3-line"      },
        { label: "Prepaid Type", value: contract.prepaid_type,             color: "warning", icon: "ri-price-tag-3-line" },
        { label: "Total Amount", value: `₱${fmt(contract.total_amount)}`,  color: "info",    icon: "ri-coins-line"       },
        { label: "Monthly",      value: `₱${fmt(contract.monthly_amount)}`,color: "success", icon: "ri-calendar-line"    },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Amortization Schedules"
                        crumbs={[{ title: "FMS", url: "/fms/dashboard" }]}
                    />

                    {/* ── StatBar ─────────────────────────────────────────────── */}
                    <Row className="g-2 mb-4">
                        {STAT_ITEMS.map((s) => (
                            <Col key={s.label}>
                                <Card className="border-0 shadow-sm mb-0">
                                    <CardBody className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <p className="text-uppercase fw-semibold text-muted mb-1"
                                                    style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>
                                                    {s.label}
                                                </p>
                                                <h6 className={`mb-0 fw-bold text-${s.color}`}>
                                                    {s.value}
                                                </h6>
                                            </div>
                                            <div className={`bg-${s.color}-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
                                                style={{ width: 40, height: 40 }}>
                                                <i className={`${s.icon} text-${s.color} fs-4`}></i>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* ── Table Card ──────────────────────────────────────────── */}
                    <Card className="border-0 shadow-sm">
                        <CardBody className="px-4 pt-4 pb-3">

                            {/* Section Label */}
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#f7b84b" }} />
                                <span className="text-uppercase fw-bold"
                                    style={{ fontSize: "0.68rem", letterSpacing: "0.05em", color: "#f7b84b" }}>
                                    Select Contract
                                </span>
                                <div style={{ flex: 1, height: 1, background: "#e9ebec22" }} />
                            </div>

                            {/* Contract Label + Dropdown */}
                            <div >
                                <select
                                    className="form-select"
                                    style={{ width: "100%" }}
                                    value={selectedId}
                                    onChange={e => { setSelectedId(e.target.value); setPage(1); }}
                                >
                                    {SEED_CONTRACTS.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.contract_no} — {c.payee} ({c.prepaid_type}) ₱{fmt(c.total_amount)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </CardBody>

                        <CardBody className="p-4">
                            <TableContainer
                                columns={columns}
                                data={schedule}
                                pageSize={pageSize}
                                currentPage={page}
                                pageCount={pageCount}
                                onPageChange={(p) => setPage(p)}
                                divClass="table-responsive mb-1"
                                tableClass="mb-0 align-middle table-sm"
                                theadClass="table-light"
                                totalRecords={schedule.length}
                                disablePageSizeSelect
                            />
                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default DesktopView;