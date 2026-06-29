import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import BreadCrumb from "./BreadCrumb";

import { hasAccess } from "@/helpers/session_helper";

const COLOR_MAP = {
    primary: { bg: "var(--vz-primary-bg-subtle)", text: "var(--vz-primary)", border: "var(--vz-primary)" },
    success: { bg: "var(--vz-success-bg-subtle)", text: "var(--vz-success)", border: "var(--vz-success)" },
    info: { bg: "var(--vz-info-bg-subtle)", text: "var(--vz-info)", border: "var(--vz-info)" },
    warning: { bg: "var(--vz-warning-bg-subtle)", text: "var(--vz-warning)", border: "var(--vz-warning)" },
    danger: { bg: "var(--vz-danger-bg-subtle)", text: "var(--vz-danger)", border: "var(--vz-danger)" },
    secondary: { bg: "var(--vz-secondary-bg-subtle)", text: "var(--vz-secondary)", border: "var(--vz-secondary)" },
};

const SettingsPage = ({ title = "Settings", settings = [], breadCrumbs = [] }) => {
    const [search, setSearch] = useState("");
    const [activeGroup, setActiveGroup] = useState("All");

    // ── Category chips ────────────────────────────────────────────────────────
    const ALL_CATEGORIES = useMemo(() => {
        const accessible = settings
            .filter(g => g.items.some(i => hasAccess(i.permissionTypeId)))
            .map(g => g.category)
            .sort((a, b) => a.localeCompare(b));
        return ["All", ...accessible];
    }, [settings]);

    // ── Filtered + sorted groups ──────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return settings
            .map(group => ({
                ...group,
                items: group.items
                    .filter(item => hasAccess(item.permissionTypeId))
                    .filter(item => activeGroup === "All" || group.category === activeGroup)
                    .filter(item =>
                        !q ||
                        item.title.toLowerCase().includes(q) ||
                        item.description.toLowerCase().includes(q)
                    )
                    .sort((a, b) => a.title.localeCompare(b.title)),
            }))
            .filter(group => group.items.length > 0)
            .sort((a, b) => a.category.localeCompare(b.category));
    }, [settings, search, activeGroup]);

    const totalAll = settings.reduce((s, g) => s + g.items.filter(i => hasAccess(i.permissionTypeId)).length, 0);
    const totalVisible = filtered.reduce((s, g) => s + g.items.length, 0);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={"Settings"} crumbs={breadCrumbs || []} />
                    {/* ── Hero banner ─────────────────────────────────────────── */}
                    <Card className="border-0 overflow-hidden mb-4"
                        style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 50%, #0ab39c 100%)", minHeight: 110 }}>
                        <CardBody className="p-4">
                            <Row className="align-items-center">
                                <Col md={7}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                                            <i className="ri-settings-2-line text-white" style={{ fontSize: "1.4rem" }} />
                                        </div>
                                        <div>
                                            <h4 className="text-white fw-bold mb-1" style={{ fontSize: "1.2rem" }}>{title}</h4>
                                            <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>
                                                {totalAll} configuration item{totalAll !== 1 ? "s" : ""} · Manage system preferences and reference data
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={5} className="mt-3 mt-md-0">
                                    <div className="search-box" style={{ position: "relative" }}>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search settings…"
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
                                        <i className="ri-search-line search-icon" style={{ color: "#6c757d" }} />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {/* ── Category filter chips ────────────────────────────────── */}
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
                        <span className="text-muted fw-semibold me-1"
                            style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Category:
                        </span>
                        {ALL_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveGroup(cat)}
                                className={`btn btn-sm rounded-pill ${activeGroup === cat ? "btn-primary" : "btn-soft-secondary"}`}
                                style={{ fontSize: "0.75rem" }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* ── Settings groups ──────────────────────────────────────── */}
                    {filtered.length === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <CardBody className="text-center py-5">
                                <i className="ri-settings-2-line d-block mb-3 opacity-25" style={{ fontSize: "3rem" }} />
                                <h5 className="fw-semibold text-muted">No settings found</h5>
                                <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                                    Try adjusting your search or category filter.
                                </p>
                                <button
                                    className="btn btn-sm btn-soft-primary"
                                    onClick={() => { setSearch(""); setActiveGroup("All"); }}>
                                    <i className="ri-refresh-line me-1" />Clear Filters
                                </button>
                            </CardBody>
                        </Card>
                    ) : (
                        filtered.map(group => (
                            <div key={group.category} className="mb-4">
                                {/* Group heading */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div style={{ width: 3, height: 18, borderRadius: 2, background: "var(--vz-primary)" }} />
                                    <h6 className="mb-0 fw-bold"
                                        style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                        {group.category}
                                    </h6>
                                    <span className="badge bg-primary-subtle text-primary rounded-pill ms-1"
                                        style={{ fontSize: "0.68rem" }}>
                                        {group.items.length}
                                    </span>
                                </div>

                                <Row className="g-3">
                                    {group.items.map((item, idx) => {
                                        const clr = COLOR_MAP[item.color] ?? COLOR_MAP.primary;
                                        return (
                                            <Col key={idx} xl={3} lg={4} md={6}>
                                                <Card
                                                    className="border-0 shadow-sm mb-0 h-100 card-animate"
                                                    style={{ overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s" }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.transform = "";
                                                        e.currentTarget.style.boxShadow = "";
                                                    }}>

                                                    {/* Colored top strip */}
                                                    <div style={{ height: 3, background: clr.border, width: "100%" }} />

                                                    <CardBody className="p-4 d-flex flex-column">
                                                        <div className="d-flex align-items-start justify-content-between mb-3">
                                                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                                style={{ width: 46, height: 46, background: clr.bg }}>
                                                                <i className={item.icon} style={{ color: clr.text, fontSize: "1.3rem" }} />
                                                            </div>
                                                            <span className="rounded-pill px-2 py-1 fw-semibold"
                                                                style={{ fontSize: "0.65rem", background: clr.bg, color: clr.text, letterSpacing: "0.04em" }}>
                                                                {group.category.split(" ")[0]}
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
                                                                className={`btn btn-sm w-100 btn-${item.color}`}
                                                                style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                                                                <i className="ri-settings-3-line me-1" />Configure
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

export default SettingsPage;