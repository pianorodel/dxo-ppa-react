import { useEffect, useState } from "react";

import defaultTrxImg from "@/assets/images/default_transaction.png";
import "@/assets/scss/modern-modal.css";
import { Badge } from "@/components/Common/Badge";
import { DateTimeLabel } from "@/components/Common/DateTimeLabel";
import { formatDate } from "@/helpers/date_helper";
import { isMobile } from "react-device-detect";

export default function TransactionDetailsModal({ title, show, fullscreen: initialFullscreen = false, data, tabs = [], buttons = [], onCloseClick, tabRefreshKey = 0 }) {
  const [fullscreen, setFullscreen] = useState(initialFullscreen);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  useEffect(() => {
    if (show) {
      setActiveTab(tabs[0]?.key);
      const isMobile = window.innerWidth <= 600;
      setFullscreen(isMobile ? true : initialFullscreen);
    }
  }, [show]);

  const handleClose = () => {
    onCloseClick?.();
  };

  if (!show) return null;

  const activeTabDef = tabs.find((t) => t.key === activeTab);
  const TabComponent = activeTabDef?.component ?? null;

  return (
    <>
      <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`}>
        <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`}>
          {/* ══════ HEADER ══════ */}
          <div className="emd-hdr">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
              {/* Avatar */}
              <div className="emd-avatar-wrap">
                <img src={defaultTrxImg} style={{ height: "45px" }} />
              </div>

              {/* Title + name/date (desktop inline) */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "clamp(14px, 4vw, 20px)", fontWeight: 800, color: "#fff", lineHeight: 1.3, display: "block", marginBottom: 4, marginTop: isMobile && '10px' }}>
                  {title}
                </span>

                {/* Desktop only — inline name + date */}
                <div className="d-none d-sm-flex" style={{ alignItems: "center", gap: 16 }}>
                  {[
                    { icon: "ri-user-line", val: data.submittedByName },
                    { icon: "ri-calendar-line", val: formatDate(data.dateSubmitted) },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                      <i className={item.icon} style={{ fontSize: 12, flexShrink: 0 }} />
                      <span>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                {/* Desktop — always show all buttons */}
                {/* Mobile — show only if 1 button */}
                {buttons
                  .filter((btn) => btn.show)
                  .map((btn, i) => (
                    <button
                      key={i}
                      className={`emd-btn emd-btn-sm ${btn.className ?? ""} ${buttons.filter((b) => b.show).length > 1 ? "d-none d-sm-inline-flex" : ""}`}
                      onClick={btn.onClick}
                    >
                      {btn.icon && <i className={btn.icon} />} {btn.label}
                    </button>
                  ))}

                {!isMobile && (
                  <button className="emd-icon-btn" onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                    <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
                  </button>
                )}
                <button className="emd-icon-btn emd-close" onClick={handleClose} title="Close">
                  <i className="ri-close-line" style={{ fontSize: 17 }} />
                </button>
              </div>
            </div>

            {/* Mobile only — name + date + buttons (if 2+) below title row */}
            <div className="d-flex d-sm-none" style={{ flexDirection: "column", gap: 10, marginBottom: 14, marginTop: -6 }}>
              {/* Name + Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {[
                  { icon: "ri-user-line", val: data.submittedByName },
                  { icon: "ri-calendar-line", val: formatDate(data.dateSubmitted) },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                    <i className={item.icon} style={{ fontSize: 12, flexShrink: 0 }} />
                    <span>{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Buttons — only show here if 2 or more */}
              {buttons.filter((btn) => btn.show).length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {buttons
                    .filter((btn) => btn.show)
                    .map((btn, i) => (
                      <button
                        key={i}
                        className={`emd-btn emd-btn-sm ${btn.className ?? ""}`}
                        onClick={btn.onClick}
                      >
                        {btn.icon && <i className={btn.icon} />} {btn.label}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div style={{ display: "flex", gap: "12px 24px", flexWrap: "wrap", marginBottom: 2 }}>
              {[
                { label: "Reference No.", val: data.referenceNo },
                { label: "Status", val: <Badge value={data?.statusName} color={data?.statusColor} /> },
                { label: `Date ${data?.statusName}`, val: formatDate(data.statusDate) },
              ].map((s, i) => (
                <div key={i} style={{ paddingBottom: 10, minWidth: "80px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="emd-tab-bar">
              {tabs.map((t) => (
                <button key={t.key} className={`emd-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                  <i className={t.icon} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ══════ TAB CONTENT ══════ */}
          <div className="emd-body">
            <div style={{ minHeight: "560px" }}>
              {TabComponent ? <TabComponent key={`${activeTab}-${tabRefreshKey}`} data={data} /> : null}
            </div>
          </div>

          {/* ══════ FOOTER ══════ */}
          <div className="emd-ftr">
            <span style={{ fontSize: 12, fontWeight: 500 }}>
              Last updated: <DateTimeLabel value={data.modifiedDate} />
            </span>
            {/* <div style={{ display: "flex", gap: 8 }}>
              <button className="emd-btn emd-btn-muted">
                <i className="ri-printer-line" /> Print
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
