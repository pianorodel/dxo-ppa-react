import React, { useState, useMemo } from "react";
import { Col, Container, Row, Card, CardBody, CardHeader } from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import TableContainer from "@/components/Common/TableContainer";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const ASSET_TYPES = [
    { id: "ict_equip",    label: "ICT Equipment",                 depreciable: true, useful_life: 5,  asset: "1-07-05-020-00", accum: "1-07-05-021-00", depr_exp: "5-02-99-060-00", assetLabel: "ICT Equipment",          accumLabel: "Accum. Depr. – ICT Equipment",    exLabel: "Depreciation – ICT Equipment"    },
    { id: "motor_vehicle",label: "Motor Vehicles",                depreciable: true, useful_life: 7,  asset: "1-07-06-010-00", accum: "1-07-06-011-00", depr_exp: "5-02-99-060-00", assetLabel: "Motor Vehicles",          accumLabel: "Accum. Depr. – Motor Vehicles",  exLabel: "Depreciation – Motor Vehicles"   },
    { id: "building",     label: "Buildings and Structures",      depreciable: true, useful_life: 30, asset: "1-07-03-010-00", accum: "1-07-03-011-00", depr_exp: "5-02-99-060-00", assetLabel: "Buildings and Structures", accumLabel: "Accum. Depr. – Buildings",       exLabel: "Depreciation – Buildings"        },
];

const SEED_ASSETS = [
    {
        id: "PPE-2023-001",
        asset_no: "PPE-2023-001",
        description: "Dell OptiPlex 7090 Desktop Computer — Finance Division",
        asset_type: "ICT Equipment",
        acquisition_date: "2023-01-15",
        acquisition_cost: "85000",
        residual_value: "8500",
        useful_life: 5,
        depreciable_amount: "76500",
        annual_depr: "15300",
        monthly_depr: "1275",
        asset_code: "1-07-05-020-00",
        accum_code: "1-07-05-021-00",
        depr_code: "5-02-99-060-00",
        status: "Active",
    },
    {
        id: "PPE-2022-001",
        asset_no: "PPE-2022-001",
        description: "Toyota Innova 2.8G DSL AT — Agency Service Vehicle",
        asset_type: "Motor Vehicles",
        acquisition_date: "2022-03-01",
        acquisition_cost: "1450000",
        residual_value: "145000",
        useful_life: 7,
        depreciable_amount: "1305000",
        annual_depr: "186428.57",
        monthly_depr: "15535.71",
        asset_code: "1-07-06-010-00",
        accum_code: "1-07-06-011-00",
        depr_code: "5-02-99-060-00",
        status: "Active",
    },
    {
        id: "PPE-2020-001",
        asset_no: "PPE-2020-001",
        description: "Agency Office Building — Main Campus",
        asset_type: "Buildings and Structures",
        acquisition_date: "2020-07-01",
        acquisition_cost: "12500000",
        residual_value: "1250000",
        useful_life: 30,
        depreciable_amount: "11250000",
        annual_depr: "375000",
        monthly_depr: "31250",
        asset_code: "1-07-03-010-00",
        accum_code: "1-07-03-011-00",
        depr_code: "5-02-99-060-00",
        status: "Active",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
    return Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

function generateAnnualSchedule(asset) {
    if (!asset) return [];
    const cost        = parseFloat(asset.acquisition_cost) || 0;
    const residual    = parseFloat(asset.residual_value) || 0;
    const depreciable = parseFloat(asset.depreciable_amount) || (cost - residual);
    const annualDepr  = parseFloat(asset.annual_depr) || 0;
    const years       = parseInt(asset.useful_life) || 0;
    let accumDepr = 0;
    return Array.from({ length: years }).map((_, i) => {
        const depr = i === years - 1 ? Math.max(depreciable - accumDepr, 0) : Math.min(annualDepr, depreciable - accumDepr);
        accumDepr += depr;
        return {
            year:   i + 1,
            annual: depr,
            accum:  accumDepr,
            book:   Math.max(cost - accumDepr, residual),
            fullyDepr: i === years - 1,
        };
    });
}

function generateMonthlySchedule(asset) {
    if (!asset) return [];
    const cost        = parseFloat(asset.acquisition_cost) || 0;
    const residual    = parseFloat(asset.residual_value) || 0;
    const depreciable = parseFloat(asset.depreciable_amount) || (cost - residual);
    const monthly     = parseFloat(asset.monthly_depr) || 0;
    const months      = (parseInt(asset.useful_life) || 0) * 12;
    const acqDate     = new Date(asset.acquisition_date || "2025-01-01");
    const startDate   = new Date(acqDate.getFullYear(), acqDate.getMonth() + 1, 1);
    let accumDepr = 0;
    return Array.from({ length: months }).map((_, i) => {
        const d     = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const label = d.toLocaleString("en-PH", { month: "long", year: "numeric" });
        const depr  = i === months - 1 ? Math.max(depreciable - accumDepr, 0) : Math.min(monthly, depreciable - accumDepr);
        accumDepr  += depr;
        return {
            month: i + 1,
            label,
            depr,
            accum:    accumDepr,
            book:     Math.max(cost - accumDepr, residual),
            lastDepr: i === months - 1,
        };
    });
}

// ─── Columns ──────────────────────────────────────────────────────────────────
const getAnnualColumns = () => [
    {
        header: "Year",
        accessorKey: "year",
        size: 80,
        cell: ({ getValue }) => (
            <span className="fw-bold" style={{ fontSize: "0.78rem" }}>Year {getValue()}</span>
        ),
    },
    {
        header: "Annual Depreciation",
        accessorKey: "annual",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-success" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Accumulated Depreciation",
        accessorKey: "accum",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-danger" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Book Value (Year-End)",
        accessorKey: "book",
        cell: ({ getValue }) => (
            <span className="fw-bold" style={{ fontSize: "0.78rem", color: "#f7b84b" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Status",
        accessorKey: "fullyDepr",
        cell: ({ getValue }) => (
            getValue()
                ? <span className="badge bg-success-subtle text-success">Fully Depr.</span>
                : <span className="badge bg-warning-subtle text-warning">Active</span>
        ),
    },
];

const getMonthlyColumns = () => [
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
        header: "Monthly Depr.",
        accessorKey: "depr",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-success" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Accum. Depreciation",
        accessorKey: "accum",
        cell: ({ getValue }) => (
            <span className="fw-semibold text-danger" style={{ fontSize: "0.78rem" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Book Value",
        accessorKey: "book",
        cell: ({ getValue }) => (
            <span className="fw-bold" style={{ fontSize: "0.78rem", color: "#f7b84b" }}>₱{fmt(getValue())}</span>
        ),
    },
    {
        header: "Status",
        accessorKey: "lastDepr",
        cell: ({ getValue }) => (
            getValue()
                ? <span className="badge bg-success-subtle text-success">Last Depr.</span>
                : <span className="badge bg-warning-subtle text-warning">Pending</span>
        ),
    },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const DesktopView = () => {

    const depreciableAssets = SEED_ASSETS.filter(a =>
        ASSET_TYPES.find(t => t.label === a.asset_type)?.depreciable
    );

    const [selectedId, setSelectedId] = useState(depreciableAssets[0]?.id || "");
    const [view, setView]             = useState("annual");
    const [page, setPage]             = useState(1);
    const [pageSize]                  = useState(12);

    const asset     = depreciableAssets.find(a => a.id === selectedId);
    const assetType = ASSET_TYPES.find(t => t.label === asset?.asset_type);

    const annualSchedule  = useMemo(() => generateAnnualSchedule(asset),  [asset]);
    const monthlySchedule = useMemo(() => generateMonthlySchedule(asset), [asset]);

    const schedule    = view === "annual" ? annualSchedule : monthlySchedule;
    const annualCols  = useMemo(() => getAnnualColumns(),  []);
    const monthlyCols = useMemo(() => getMonthlyColumns(), []);
    const columns     = view === "annual" ? annualCols : monthlyCols;
    const pageCount   = Math.ceil(schedule.length / pageSize) || 0;

    const STAT_ITEMS = [
        { label: "Asset Type",           value: asset?.asset_type?.split(" ").slice(0, 3).join(" ") || "—", color: "warning", icon: "ri-price-tag-3-line"       },
        { label: "Acquisition Cost",     value: `₱${fmt(asset?.acquisition_cost)}`,                         color: "primary", icon: "ri-coins-line"              },
        { label: "Depreciable Amount",   value: `₱${fmt(asset?.depreciable_amount)}`,                       color: "info",    icon: "ri-subtract-line"           },
        { label: "Annual Depreciation",  value: `₱${fmt(asset?.annual_depr)}`,                              color: "warning", icon: "ri-calendar-line"           },
        { label: "Monthly Depreciation", value: `₱${fmt(asset?.monthly_depr)}`,                             color: "success", icon: "ri-calendar-check-line"     },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Depreciation Schedules"
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
                                    Select Asset
                                </span>
                                <div style={{ flex: 1, height: 1, background: "#e9ebec22" }} />
                            </div>

                            {/* Dropdown */}
                            <div className="mb-3">
                                <select
                                    className="form-select"
                                    style={{ width: "100%" }}
                                    value={selectedId}
                                    onChange={e => { setSelectedId(e.target.value); setPage(1); setView("annual"); }}
                                >
                                    {depreciableAssets.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.asset_no} — {a.description?.slice(0, 55)} | ₱{fmt(a.acquisition_cost)} | {a.useful_life}yr SLM
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="d-flex gap-0">
                                {[
                                    { id: "annual",  label: "Annual Schedule"  },
                                    { id: "monthly", label: "Monthly Schedule" },
                                ].map(o => (
                                    <button key={o.id}
                                        className={`btn btn-sm ${view === o.id ? "btn-warning" : "btn-light"}`}
                                        style={{ borderRadius: o.id === "annual" ? "4px 0 0 4px" : "0 4px 4px 0", fontWeight: 600, fontSize: "0.78rem" }}
                                        onClick={() => { setView(o.id); setPage(1); }}>
                                        {o.label}
                                    </button>
                                ))}
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