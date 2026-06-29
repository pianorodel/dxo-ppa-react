import React, { useCallback, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { Modal, ModalBody } from "reactstrap";

import { apiStore } from "@/api/Store/Store";
import pdfIcon from "@/assets/images/fileTypes/pdf.webp";
import "@/assets/scss/modern-modal.css";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

const PDFSkeleton = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#525659",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      overflowY: "auto",
      padding: "24px 0",
    }}>
    <div
      style={{
        width: "610px",
        minHeight: "860px",
        backgroundColor: "#fff",
        borderRadius: "2px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        padding: "48px 52px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Bone width="55%" height="14px" />
        <Bone width="38%" height="10px" />
      </div>
      <Bone width="100%" height="22px" radius="2px" />
      <Bone width="45%" height="11px" />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "8px" }}>
            <Bone width="22%" height="18px" />
            <Bone width="28%" height="18px" />
            <Bone width="22%" height="18px" />
            <Bone width="28%" height="18px" />
          </div>
        ))}
      </div>
      <Bone width="60%" height="11px" style={{ marginTop: "4px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["30%", "10%", "12%", "12%", "14%", "22%"].map((w, i) => (
            <Bone key={i} width={w} height="28px" color="#e0e0e0" />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "6px" }}>
            {["30%", "10%", "12%", "12%", "14%", "22%"].map((w, j) => (
              <Bone key={j} width={w} height="20px" />
            ))}
          </div>
        ))}
      </div>
      <Bone width="40%" height="11px" style={{ marginTop: "4px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "6px" }}>
            <Bone width="12%" height="18px" />
            <Bone width="38%" height="18px" />
            <Bone width="38%" height="18px" />
            <Bone width="12%" height="18px" />
          </div>
        ))}
      </div>
      <Bone width="50%" height="11px" style={{ marginTop: "4px" }} />
      <Bone width="100%" height="50px" />
      <div style={{ display: "flex", gap: "12px", marginTop: "auto", paddingTop: "24px" }}>
        <Bone width="33%" height="60px" />
        <Bone width="33%" height="60px" />
        <Bone width="33%" height="60px" />
      </div>
    </div>
    <style>{`
      @keyframes pdf-shimmer {
        0%   { background-position: -600px 0; }
        100% { background-position:  600px 0; }
      }
    `}</style>
  </div>
);

const Bone = ({ width, height, radius = "3px", color, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: color ? color : "linear-gradient(90deg, #ebebeb 25%, #f5f5f5 50%, #ebebeb 75%)",
      backgroundSize: "600px 100%",
      animation: "pdf-shimmer 1.4s infinite linear",
      flexShrink: 0,
      ...style,
    }}
  />
);

const IframeReadyDetector = ({ onReady }) => {
  React.useEffect(() => {
    let tries = 0;
    const MAX = 60;
    const interval = setInterval(() => {
      tries++;
      const iframe = document.querySelector(".modal.show iframe");
      if (iframe?.src?.startsWith("blob:")) {
        clearInterval(interval);
        setTimeout(onReady, 150);
      }
      if (tries >= MAX) {
        clearInterval(interval);
        onReady();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onReady]);
  return null;
};

const PDFPreviewModal = React.memo(
  ({ show, onCloseClick, DocumentComponent, data, modalTitle = "Report Preview", fileName: fileNameProp }) => {
    const [toggleExpand, setToggleExpand] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [pdfReady, setPdfReady] = useState(false);

    const documentComponent = useMemo(
      () => (
        <Provider store={apiStore}>
          <DocumentComponent data={data} pdfTitle={modalTitle} />
        </Provider>
      ),
      [DocumentComponent, data, modalTitle],
    );

    const handleExpandToggle = useCallback(() => setToggleExpand((p) => !p), []);

    const handleCloseModal = useCallback(() => {
      setDownloadError(null);
      setPdfReady(false);
      onCloseClick();
    }, [onCloseClick]);

    const handleDownloadError = useCallback((error) => {
      console.error("PDF generation error:", error);
      setDownloadError("Failed to generate PDF");
    }, []);

    const modalHeight = toggleExpand ? "95vh" : "80vh";
    const fileName = useMemo(() => fileNameProp || `report_${Date.now()}.pdf`, [show, fileNameProp]);

    return (
      <>
        <style>
          {`
            .print-modal .modal-content {
              border-radius: ${toggleExpand ? "0" : "17px 17px 0 0"} !important;
              border: none !important;
            }
            .print-modal .emd-hdr {
              border-radius: ${toggleExpand ? "0" : "14px 14px 0 0"} !important;
            }
          `}
        </style>

        <Modal
          modalClassName="print-modal"
          fullscreen={toggleExpand}
          size="xl"
          isOpen={show}
          toggle={handleCloseModal}
          centered
          backdrop="static"
          fade={false}>
          <div className="emd-hdr pb-2">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div className="emd-avatar-wrap">
                <img src={pdfIcon} style={{ height: "32px" }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{modalTitle}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                {downloadError && (
                  <span className="text-danger" style={{ fontSize: 12 }} title={downloadError}>
                    <i className="ri-error-warning-line me-1" />
                    Error
                  </span>
                )}

                <PDFDownloadLink
                  document={documentComponent}
                  fileName={fileName}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => setDownloadError(null)}>
                  {({ loading, error }) => {
                    if (error) handleDownloadError(error);
                    return (
                      <button
                        className="emd-icon-btn"
                        title={loading ? "Generating PDF..." : "Download PDF"}
                        style={{ pointerEvents: loading ? "none" : "auto" }}>
                        <i
                          className={loading ? "ri-loader-4-line" : "ri-download-2-line"}
                          style={{
                            fontSize: 16,
                            animation: loading ? "spin 1s linear infinite" : "none",
                            color: loading ? "#f7b84b" : undefined,
                          }}
                        />
                      </button>
                    );
                  }}
                </PDFDownloadLink>

                <button className="emd-icon-btn" onClick={handleExpandToggle} title={toggleExpand ? "Exit fullscreen" : "Fullscreen"}>
                  <i className={toggleExpand ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} style={{ fontSize: 15 }} />
                </button>

                <button className="emd-icon-btn emd-close" onClick={handleCloseModal} title="Close">
                  <i className="ri-close-line" style={{ fontSize: 17 }} />
                </button>
              </div>
            </div>
          </div>

          <ModalBody className="p-0" style={{ height: modalHeight, overflow: "hidden", position: "relative" }}>
            {show && !downloadError && (
              <>
                {!pdfReady && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                    <PDFSkeleton />
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    opacity: pdfReady ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: pdfReady ? "auto" : "none",
                  }}>
                  <PDFViewer style={{ width: "100%", height: "100%", border: "none" }}>{documentComponent}</PDFViewer>
                </div>

                {!pdfReady && <IframeReadyDetector onReady={() => setPdfReady(true)} />}
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  },
);

export default PDFPreviewModal;
