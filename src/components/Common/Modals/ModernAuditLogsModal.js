import { useEffect, useState } from "react";

import auditlogsImage from "@/assets/images/auditlogs.png";
import "@/assets/scss/modern-modal.css";
import { Badge } from "@/components/Common/Badge";
import HistoryList from "@/components/Common/HistoryList";

import { useGetSystemLogsQuery } from "@/api/Endpoints/Core/App/SystemLogs";

const ModernAuditLogsModal = ({
  show = false,
  title = "History",
  subTitle,
  transactionId,
  idKey = "transactionId",
  startDate = null,
  data,
  useLogsQuery,
  queryArg = {},
  onClose = () => { },
}) => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!show) {
      setFullscreen(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`}>
      <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`} style={{ width: fullscreen ? "" : "1080px" }}>
        {/* HEADER */}
        <div className="emd-hdr">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
            <div className="emd-avatar-wrap">
              <img src={auditlogsImage} style={{ height: "55px" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{title}</span>
                </>
              </div>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 14, fontWeight: 600 }}>
                  {subTitle} {data?.statusName && <Badge value={data?.statusName} color={data?.statusColor} />}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <button className="emd-icon-btn" onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
              </button>
              <button className="emd-icon-btn emd-close" onClick={onClose} title="Close">
                <i className="ri-close-line" style={{ fontSize: 17 }} />
              </button>
            </div>
          </div>
        </div>

        {/* BODY — dynamic content injected here */}
        <div className="emd-body">
          <HistoryList
            title={"History"}
            transactionId={transactionId}
            idKey={idKey}
            startDate={startDate}
            useLogsQuery={useLogsQuery || useGetSystemLogsQuery}
            queryArg={queryArg}
          />
        </div>

        {/* FOOTER */}
        <div className="emd-ftr">
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            {/* {modifiedDate && (
              <>
                Last updated: <DateTimeLabel value={modifiedDate} />
              </>
            )} */}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="emd-btn emd-btn-light emd-btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuditLogsModal;
