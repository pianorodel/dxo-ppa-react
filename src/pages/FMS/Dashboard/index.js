import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  Badge,
  Card, CardBody, CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";

import Banner from "@/components/Common/Banner";

// ─── Velzon CSS variable palette (matches --vz-* tokens) ─────────────────────
const VZ = {
  primary: "#405189",
  success: "#0ab39c",
  warning: "#f7b84b",
  danger: "#f06548",
  info: "#299cdb",
  purple: "#6f42c1",
  teal: "#008080",
  cardBg: "var(--vz-card-bg)",
  bodyBg: "var(--vz-body-bg)",
  border: "var(--vz-border-color)",
  text: "var(--vz-body-color)",
  textMuted: "var(--vz-text-muted)",
  headingColor: "var(--vz-heading-color)",
};

// ─── Shared ApexCharts theme options ─────────────────────────────────────────
const chartDefaults = {
  chart: { toolbar: { show: false }, background: "transparent", fontFamily: "var(--vz-font-sans-serif)" },
  tooltip: { theme: "dark" },
  grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 3 },
  dataLabels: { enabled: false },
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, badge }) {
  return (
    <CardHeader className="align-items-center d-flex">
      <h4 className="card-title mb-0 flex-grow-1" style={{ fontSize: 14 }}>{title}</h4>
      {sub && <span style={{ fontSize: 11, color: VZ.textMuted }}>{sub}</span>}
      {badge && <Badge color="soft-primary" className="ms-2" style={{ fontSize: 10, background: VZ.primary + "22", color: VZ.primary }}>{badge}</Badge>}
    </CardHeader>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon, trend, trendVal }) {
  return (
    <Card className="card-animate" style={{ height: "100%" }}>
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-uppercase fw-medium mb-0 text-truncate" style={{ fontSize: 11, color: VZ.textMuted, letterSpacing: "0.08em" }}>
              {label}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span style={{ fontSize: 11, color: trend === "up" ? VZ.success : VZ.danger }}>
              {trend === "up" ? "▲" : "▼"} {trendVal}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-between mt-3">
          <div>
            <h4 className="fs-22 fw-semibold ff-secondary mb-1" style={{ color: VZ.headingColor }}>
              {value}
            </h4>
            <span style={{ fontSize: 12, color: VZ.textMuted }}>{sub}</span>
          </div>
          <div className="avatar-sm flex-shrink-0">
            <span className="avatar-title rounded fs-3" style={{ background: color + "22", color }}>
              <i className={`bx ${icon}`} />
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Budget Utilization Progress ──────────────────────────────────────────────
function UtilizationBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1">
        <span style={{ fontSize: 12, color: VZ.textMuted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: VZ.headingColor }}>₱{value}B <span style={{ color, fontWeight: 400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 6, background: "var(--vz-border-color)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// ─── Waterfall ───────────────────────────────────────────────────────
function WaterfallChart() {
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
    colors: [VZ.primary, VZ.danger, VZ.primary, VZ.warning, VZ.primary, VZ.success, VZ.success],
    xaxis: {
      categories: ["Approp.", "Unreleased", "Allotment", "Unobligated", "Obligations", "Unpaid", "Disbursed"],
      labels: { style: { colors: VZ.textMuted, fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: VZ.textMuted, fontSize: "11px" }, formatter: v => "₱" + (v / 1000).toFixed(1) + "B" },
    },
    grid: chartDefaults.grid,
    legend: { show: false },
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v.toLocaleString() + "M" } },
  };
  const series = [{
    name: "Amount",
    data: [4820, 880, 3940, 1230, 2710, 530, 2180],
    color: undefined,
  }];
  // manual per-bar color via fill
  opts.fill = { colors: [VZ.primary, "#f0654833", VZ.primary, "#f7b84b33", VZ.warning, "#0ab39c33", VZ.success] };
  return <ReactApexChart options={opts} series={[{ name: "₱M", data: [4820, 880, 3940, 1230, 2710, 530, 2180] }]} type="bar" height={260} />;
}

// ─── Donut – Expenditure Class ───────────────────────────────────────
function ExpClassDonut() {
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "donut" },
    labels: ["PS", "MOOE", "CO", "FinEx"],
    colors: [VZ.primary, VZ.warning, VZ.success, VZ.purple],
    plotOptions: { pie: { donut: { size: "70%", labels: { show: true, total: { show: true, label: "Total", color: VZ.textMuted, fontSize: "12px", formatter: () => "₱2.71B" } } } } },
    legend: { show: false },
    stroke: { width: 2, colors: ["transparent"] },
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  return (
    <>
      <ReactApexChart options={opts} series={[1240, 870, 480, 120]} type="donut" height={200} />
      <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
        {[["PS", VZ.primary, "₱1.24B", "45.8%"], ["MOOE", VZ.warning, "₱0.87B", "32.1%"], ["CO", VZ.success, "₱0.48B", "17.7%"], ["FinEx", VZ.purple, "₱0.12B", "4.4%"]].map(([l, c, v, p]) => (
          <div key={l} className="d-flex align-items-center gap-1" style={{ fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />
            <span style={{ color: VZ.textMuted }}>{l}</span>
            <span style={{ color: VZ.headingColor, fontWeight: 600 }}>{v}</span>
            <span style={{ color: VZ.textMuted }}>({p})</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Fund Cluster ────────────────────────────────────────────────────
function FundClusterChart() {
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { horizontal: true, barHeight: "60%", borderRadius: 3, dataLabels: { position: "top" } } },
    colors: [VZ.primary + "44", VZ.warning],
    xaxis: {
      categories: ["01 Regular", "02 Foreign-Asst.", "03 Spec-Local", "04 Spec-Foreign", "05 IGF", "06 Business", "07 Trust"],
      labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, formatter: v => "₱" + v + "M" },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" } } },
    legend: {
      show: true, position: "top", horizontalAlign: "right",
      labels: { colors: VZ.textMuted }, fontSize: "11px",
      markers: { width: 8, height: 8, radius: 2 },
    },
    stroke: { show: true, width: [0, 0] },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  const series = [
    { name: "Allotment", data: [2840, 480, 220, 165, 110, 80, 45] },
    { name: "Obligated", data: [1920, 320, 160, 110, 88, 70, 42] },
  ];
  return <ReactApexChart options={opts} series={series} type="bar" height={280} />;
}

// ─── ORS Status ──────────────────────────────────────────────────────
function OrsStatusChart() {
  const colors = [VZ.textMuted, VZ.warning, VZ.primary, VZ.purple, VZ.success, VZ.danger];
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { columnWidth: "60%", borderRadius: 3, distributed: true } },
    colors,
    legend: { show: false },
    xaxis: {
      categories: ["Draft", "For Approval", "Obligated", "Part. Paid", "Fully Paid", "Cancelled"],
      labels: { style: { colors: Array(6).fill(VZ.textMuted), fontSize: "10px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" } } },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => v + " ORS" } },
  };
  return <ReactApexChart options={opts} series={[{ name: "Count", data: [84, 41, 213, 67, 388, 23] }]} type="bar" height={230} />;
}

// ─── Monthly Trend ───────────────────────────────────────────────────
function MonthlyTrendChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "line" },
    stroke: { width: [2, 2, 2], curve: "smooth", dashArray: [0, 0, 0] },
    colors: [VZ.primary, VZ.warning, VZ.success],
    markers: { size: 3, strokeWidth: 0 },
    xaxis: {
      categories: months,
      labels: { style: { colors: VZ.textMuted, fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, formatter: v => "₱" + v + "M" } },
    legend: {
      show: true, position: "top", horizontalAlign: "right",
      labels: { colors: VZ.textMuted }, fontSize: "11px",
      markers: { width: 8, height: 8, radius: 2 },
    },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
    fill: { type: ["solid", "solid", "solid"], opacity: [1, 1, 1] },
  };
  const series = [
    { name: "Allotment", data: [320, 380, 410, 340, 290, 350, 420, 390, 310, 280, 320, 130] },
    { name: "Obligations", data: [210, 260, 280, 240, 195, 240, 290, 265, 200, 180, 211, 110] },
    { name: "Disbursements", data: [170, 200, 225, 195, 155, 195, 235, 215, 160, 148, 168, 88] },
  ];
  return <ReactApexChart options={opts} series={series} type="line" height={220} />;
}

// ─── Auth Code ───────────────────────────────────────────────────────
function AuthCodeChart() {
  const authColors = [VZ.primary, "#378ADD", "#85B7EB", VZ.success, "#1D9E75", VZ.warning, VZ.purple];
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 3, distributed: true } },
    colors: authColors,
    legend: { show: false },
    xaxis: {
      categories: ["01 New Gen Approp", "02 Continuing", "03 Supplemental", "04 Automatic", "06 Retained Income", "07 Revolving", "08 Trust Receipts"],
      labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, formatter: v => "₱" + v + "M" },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" } } },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  return <ReactApexChart options={opts} series={[{ name: "₱M", data: [1820, 420, 180, 145, 88, 42, 15] }]} type="bar" height={270} />;
}

// ─── JEV Summary Mini ─────────────────────────────────────────────────────────
function JevSummary() {
  const items = [
    { type: "NCA Receipt", count: 12, color: VZ.primary },
    { type: "Advice of Allotment", count: 28, color: VZ.info },
    { type: "ORS Obligation", count: 213, color: VZ.warning },
    { type: "DV Payment", count: 174, color: VZ.success },
    { type: "TRA Remittance", count: 31, color: VZ.purple },
    { type: "Qtr-End Reversal", count: 3, color: VZ.danger },
    { type: "Manual JEV", count: 7, color: VZ.textMuted },
  ];
  const total = items.reduce((s, i) => s + i.count, 0);
  return (
    <div className="d-flex flex-column gap-2">
      {items.map(item => (
        <div key={item.type} className="d-flex align-items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          <div className="flex-grow-1" style={{ fontSize: 12, color: VZ.textMuted }}>{item.type}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: VZ.headingColor, minWidth: 30, textAlign: "right" }}>{item.count}</div>
          <div style={{ width: 80, height: 4, background: "var(--vz-border-color)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: (item.count / total * 100) + "%", height: "100%", background: item.color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between pt-2 mt-1" style={{ borderTop: "1px solid var(--vz-border-color)", fontSize: 12 }}>
        <span style={{ color: VZ.textMuted }}>Total JEVs this period</span>
        <span style={{ fontWeight: 700, color: VZ.headingColor }}>{total}</span>
      </div>
    </div>
  );
}

// ─── DV Mode Donut ───────────────────────────────────────────────────
function DvModeChart() {
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "donut" },
    labels: ["LDDAP-ADA", "Check", "TRA"],
    colors: [VZ.purple, VZ.primary, VZ.success],
    plotOptions: { pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Total", color: VZ.textMuted, fontSize: "12px", formatter: () => "₱2.18B" } } } } },
    legend: { show: false },
    stroke: { width: 2, colors: ["transparent"] },
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  return (
    <>
      <ReactApexChart options={opts} series={[1540, 480, 162]} type="donut" height={180} />
      <div className="d-flex flex-column gap-2 mt-2">
        {[["LDDAP-ADA", VZ.purple, "₱1,540M", "70.6%"], ["Check", VZ.primary, "₱480M", "22.0%"], ["TRA", VZ.success, "₱162M", "7.4%"]].map(([l, c, v, p]) => (
          <div key={l} className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: VZ.textMuted }}>{l}</span>
            </div>
            <div className="d-flex gap-3" style={{ fontSize: 12 }}>
              <span style={{ color: VZ.headingColor, fontWeight: 600 }}>{v}</span>
              <span style={{ color: VZ.textMuted, minWidth: 36, textAlign: "right" }}>{p}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── NCA Quarterly ───────────────────────────────────────────────────
function NcaChart() {
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 3, grouped: true } },
    colors: [VZ.primary, VZ.success, VZ.danger],
    xaxis: {
      categories: ["Q1", "Q2", "Q3", "Q4"],
      labels: { style: { colors: VZ.textMuted, fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, formatter: v => "₱" + v + "M" } },
    legend: {
      show: true, position: "top", horizontalAlign: "right",
      labels: { colors: VZ.textMuted }, fontSize: "11px",
      markers: { width: 8, height: 8, radius: 2 },
    },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  const series = [
    { name: "Received", data: [980, 1120, 860, 760] },
    { name: "Utilized", data: [820, 990, 780, 680] },
    { name: "Excess/Returned", data: [160, 130, 80, 80] },
  ];
  return <ReactApexChart options={opts} series={series} type="bar" height={200} />;
}

// ─── Top Object Codes ────────────────────────────────────────────────
function ObjectCodeChart() {
  const cats = [
    "5-01-01-010 Salaries–Reg", "1-07-04-030 ICT Equipment", "5-01-02-010 PERA",
    "5-02-03-010 Office Supplies", "5-02-04-020 Electricity", "5-02-99-060 Security Svc",
    "5-02-05-010 Water", "5-02-07-010 Telephone", "5-02-13-050 Representation", "5-02-12-010 Traveling Local",
  ];
  const data = [980, 420, 260, 142, 118, 95, 78, 64, 55, 48];
  const barColors = [VZ.primary, VZ.success, VZ.primary, VZ.warning, VZ.warning, VZ.warning, VZ.warning, VZ.warning, VZ.warning, VZ.warning];
  const opts = {
    ...chartDefaults,
    chart: { ...chartDefaults.chart, type: "bar" },
    plotOptions: { bar: { horizontal: true, barHeight: "60%", borderRadius: 3, distributed: true } },
    colors: barColors,
    legend: { show: false },
    xaxis: {
      categories: cats,
      labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, formatter: v => "₱" + v + "M" },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: VZ.textMuted, fontSize: "10px" }, maxWidth: 160 } },
    grid: chartDefaults.grid,
    tooltip: { ...chartDefaults.tooltip, y: { formatter: v => "₱" + v + "M" } },
  };
  return <ReactApexChart options={opts} series={[{ name: "₱M", data }]} type="bar" height={320} />;
}

const DesktopView = () => {

  const kpis = [
    { label: "Total Appropriation", value: "₱4.82B", sub: "GAA RA 12116", color: VZ.primary, icon: "bx-briefcase-alt-2", trend: "up", trendVal: "100%" },
    { label: "Allotment Released", value: "₱3.94B", sub: "81.7% of approp.", color: VZ.info, icon: "bx-transfer", trend: "up", trendVal: "81.7%" },
    { label: "Obligations Incurred", value: "₱2.71B", sub: "68.8% of allotment", color: VZ.warning, icon: "bx-file", trend: "up", trendVal: "68.8%" },
    { label: "Disbursements", value: "₱2.18B", sub: "80.4% of obligations", color: VZ.success, icon: "bx-money", trend: "up", trendVal: "80.4%" },
    { label: "NCA Balance", value: "₱0.64B", sub: "Cash–MDS Regular", color: VZ.danger, icon: "bx-wallet-alt", trend: "down", trendVal: "13.3%" },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row className="mb-4">
            <Col>
              <Banner
                title="Welcome to Financial Management System"
                description="Manage your agency's financial transactions, budget execution, and accounting records in compliance with COA, DBM, and eNGAS standards."
                icon="ri-government-line"
              />
            </Col>
          </Row>

          {/* KPI Row */}
          <Row className="g-3 mb-3">
            {kpis.map(k => (
              <Col key={k.label} xl={2} md={4} sm={6} xs={12} style={{ flex: "0 0 20%", maxWidth: "20%" }}>
                <KpiCard {...k} />
              </Col>
            ))}
          </Row>

          {/* Budget utilization progress */}
          <Row className="g-3 mb-3">
            <Col xl={4} md={12}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="Budget Utilization Rate" sub="FY 2025" />
                <CardBody>
                  <UtilizationBar label="Appropriation → Allotment" value={3.94} max={4.82} color={VZ.primary} />
                  <UtilizationBar label="Allotment → Obligations" value={2.71} max={3.94} color={VZ.warning} />
                  <UtilizationBar label="Obligations → Disbursed" value={2.18} max={2.71} color={VZ.success} />
                  <UtilizationBar label="NCA → Utilized" value={2.82} max={3.46} color={VZ.info} />
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--vz-border-color)" }}>
                    <div style={{ fontSize: 11, color: VZ.textMuted, marginBottom: 8, letterSpacing: "0.05em" }}>FUNDING TYPE SPLIT</div>
                    <div className="d-flex gap-2">
                      <div style={{ flex: "0 0 68%", height: 24, background: VZ.primary, borderRadius: "4px 0 0 4px", display: "flex", alignItems: "center", paddingLeft: 10 }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>Via SARO 68%</span>
                      </div>
                      <div style={{ flex: 1, height: 24, background: VZ.success, borderRadius: "0 4px 4px 0", display: "flex", alignItems: "center", paddingLeft: 8 }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>GAA Direct 32%</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={5} md={7}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="Budget Execution Waterfall" sub="₱ Billions" />
                <CardBody>
                  <WaterfallChart />
                </CardBody>
              </Card>
            </Col>

            <Col xl={3} md={5}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="Obligations by Exp. Class" />
                <CardBody>
                  <ExpClassDonut />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Fund cluster + ORS */}
          <Row className="g-3 mb-3">
            <Col xl={6} md={12}>
              <Card>
                <SectionHeader title="Fund Cluster Utilization" sub="UACS FC 01–07" />
                <CardBody>
                  <FundClusterChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={6} md={12}>
              <Card>
                <SectionHeader title="ORS Status Pipeline" badge="FY 2025 Q1" />
                <CardBody>
                  <OrsStatusChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Monthly trend + Auth code */}
          <Row className="g-3 mb-3">
            <Col xl={8} md={12}>
              <Card>
                <SectionHeader title="Monthly Budget Execution Trend" sub="₱ Millions" />
                <CardBody>
                  <MonthlyTrendChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} md={12}>
              <Card>
                <SectionHeader title="By Authorization Code" />
                <CardBody>
                  <AuthCodeChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* DV mode + NCA */}
          <Row className="g-3 mb-3">
            <Col xl={3} md={6}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="DV Payment Mode" />
                <CardBody>
                  <DvModeChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={5} md={6}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="NCA Utilization by Quarter" />
                <CardBody>
                  <NcaChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} md={12}>
              <Card style={{ height: "100%" }}>
                <SectionHeader title="JEV by Reference Type" />
                <CardBody>
                  <JevSummary />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Top Object Codes */}
          <Row className="g-3">
            <Col xs={12}>
              <Card>
                <SectionHeader title="Top UACS Object Codes by Obligation" />
                <CardBody>
                  <ObjectCodeChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default DesktopView;
