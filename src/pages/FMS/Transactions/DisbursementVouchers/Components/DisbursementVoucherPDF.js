import { StyleSheet, Text, View, usePDF } from "@react-pdf/renderer";

import React, { useEffect, useMemo, useRef, useState } from "react";

import PDFPortrait from "@/components/Common/PDFs/PDFPortrait";
import PDFTable from "@/components/Common/PDFs/PDFTable";

const styles = StyleSheet.create({
  headerBox: { border: "1px solid #000", display: "flex", flexDirection: "row", marginBottom: 0 },
  headerLeft: { width: "55%", borderRight: "1px solid #000", padding: 8 },
  headerRight: { width: "45%", padding: 8 },
  agencyName: { fontWeight: "bold", fontSize: 10, marginBottom: 2 },
  agencyCity: { fontWeight: "bold", fontSize: 10, marginBottom: 4 },
  dvLabel: { fontWeight: "bold", fontSize: 10, textDecoration: "underline" },
  normalText: { fontSize: 8, marginBottom: 3 },
  boldText: { fontWeight: "bold", fontSize: 8, marginBottom: 3 },
  mopRow: { border: "1px solid #000", borderTop: "none", display: "flex", flexDirection: "row", alignItems: "center", padding: "4 8" },
  mopLabel: { fontSize: 8, marginRight: 10 },
  checkboxGroup: { display: "flex", flexDirection: "row", alignItems: "center" },
  checkboxItem: { display: "flex", flexDirection: "row", alignItems: "center", marginRight: 12 },
  checkbox: { width: 8, height: 8, border: "1px solid #000", marginRight: 3 },
  checkboxChecked: { width: 8, height: 8, border: "1px solid #000", backgroundColor: "#000", marginRight: 3 },
  checkboxLabel: { fontSize: 8 },
  othersLine: { borderBottom: "1px solid #000", width: 80, marginLeft: 4 },
  fieldRow: { border: "1px solid #000", borderTop: "none", display: "flex", flexDirection: "row", alignItems: "stretch", minHeight: 20 },
  fieldLabel: { width: "18%", borderRight: "1px solid #000", padding: "4 8", fontSize: 8, fontWeight: "bold" },
  fieldValue: { flex: 1, padding: "4 8", fontSize: 8 },
  totalRow: { display: "flex", flexDirection: "row", backgroundColor: "#f9f9f9" },
  totalCell: { padding: 6, fontSize: 8 },
  totalCellLast: { padding: 6, fontSize: 8 },
  certifiedBox: { border: "1px solid #000", marginTop: 8 },
  certifiedRow: { padding: "4 8", fontSize: 8, fontWeight: "bold", borderBottom: "1px solid #000" },
  certDetailRow: { display: "flex", flexDirection: "row", minHeight: 55 },
  certDetailLeft: { width: "50%", borderRight: "1px solid #000", padding: "4 8" },
  certDetailRight: { width: "50%", padding: "4 8" },
  certDetailText: { fontSize: 8, marginBottom: 3 },
  certDetailUnderline: { borderBottom: "1px solid #000", marginBottom: 2, marginTop: 2 },
  approvedSection: { border: "1px solid #000", marginTop: 8, padding: "4 8", minHeight: 70 },
  approvedLabel: { fontSize: 8, fontWeight: "bold", marginBottom: 30 },
  approvedSignLabel: { fontSize: 8, marginBottom: 2 },
  receiptBox: { border: "1px solid #000", marginTop: 8 },
  receiptLabel: { padding: "4 8", fontSize: 8, fontWeight: "bold", borderBottom: "1px solid #000" },
  receiptDetail: { padding: "4 8", minHeight: 60 },
  receiptLine: { display: "flex", flexDirection: "row", marginBottom: 4 },
  receiptFieldLabel: { fontSize: 8, marginRight: 4 },
  receiptFieldLine: { borderBottom: "1px solid #000", flex: 1, marginRight: 16 },
  receiptSignLabel: { fontSize: 8, marginTop: 12 },
  jevFooter: { marginTop: 4, paddingLeft: 4 },
  jevFooterText: { fontSize: 7, marginBottom: 2 },
});

const PDFSkeleton = () => (
  // <div style={{ width: "100%", height: "100%", background: "#f5f5f5", padding: "20px", boxSizing: "border-box" }}>
  //   <style>{`
  //     @keyframes shimmer {
  //       0% { background-position: -1000px 0; }
  //       100% { background-position: 1000px 0; }
  //     }
  //     .shimmer {
  //       background: linear-gradient(90deg, #ececec 25%, #e0e0e0 50%, #ececec 75%);
  //       background-size: 1000px 100%;
  //       animation: shimmer 1.5s infinite;
  //       border-radius: 4px;
  //     }
  //   `}</style>
  //   <div style={{ background: "white", maxWidth: 700, margin: "0 auto", padding: 32, minHeight: "90%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
  //     <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
  //       <div className="shimmer" style={{ height: 80, flex: "0 0 55%" }} />
  //       <div className="shimmer" style={{ height: 80, flex: "0 0 45%" }} />
  //     </div>
  //     <div className="shimmer" style={{ height: 22, marginBottom: 6 }} />
  //     {[...Array(3)].map((_, i) => (
  //       <div key={i} className="shimmer" style={{ height: 20, marginBottom: 5, opacity: 1 - i * 0.1 }} />
  //     ))}
  //     <div className="shimmer" style={{ height: 28, marginBottom: 8 }} />
  //     {[...Array(4)].map((_, i) => (
  //       <div key={i} className="shimmer" style={{ height: 22, marginBottom: 6 }} />
  //     ))}
  //     <div className="shimmer" style={{ height: 22, marginBottom: 24, width: "25%", marginLeft: "auto" }} />
  //     <div className="shimmer" style={{ height: 55, marginBottom: 6 }} />
  //     <div className="shimmer" style={{ height: 70, marginBottom: 6 }} />
  //     <div className="shimmer" style={{ height: 60, marginBottom: 6 }} />
  //   </div>
  // </div>
  <></>
);

const FADE_DURATION = 300;
const RENDER_BUFFER = 800;

const PDFRenderer = ({ pdfDoc, onNewUrl }) => {
  const [instance, updateInstance] = usePDF({ document: pdfDoc });

  const prevDocRef = useRef(pdfDoc);
  useEffect(() => {
    if (prevDocRef.current !== pdfDoc) {
      prevDocRef.current = pdfDoc;
      updateInstance(pdfDoc);
    }
  }, [pdfDoc, updateInstance]);

  useEffect(() => {
    if (instance.url) onNewUrl(instance.url);
  }, [instance.url]);

  return null;
};

function CheckItem({ label, checked }) {
  return (
    <View style={styles.checkboxItem}>
      <View style={checked ? styles.checkboxChecked : styles.checkbox} />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
}

const DisbursementVoucherPDF = ({ pdfTitle = "Disbursement Voucher", headerData = {}, particularsEntries = [] }) => {
  const [stableEntries, setStableEntries] = useState(particularsEntries);
  const [stableHeader, setStableHeader] = useState(headerData);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [rendererKey, setRendererKey] = useState(0);

  const iframeA = useRef(null);
  const iframeB = useRef(null);
  const activeRef = useRef("a");
  const swapTimerRef = useRef(null);
  const rowCountRef = useRef(particularsEntries.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStableEntries(particularsEntries);
      setStableHeader(headerData);
      if (particularsEntries.length !== rowCountRef.current) {
        rowCountRef.current = particularsEntries.length;
        setRendererKey((k) => k + 1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [particularsEntries, headerData]);

  const columns = useMemo(
    () => [
      { field: "particulars", header: "Particulars", width: "50%" },
      { field: "responsibilityCenter", header: "Responsibility Center", width: "15%" },
      { field: "mfoPap", header: "MFO/PAP", width: "15%" },
      { field: "amount", header: "Amount", width: "20%" },
    ],
    [],
  );

  const data = useMemo(
    () =>
      stableEntries.filter(Boolean).map((d) => ({
        particulars: d?.particulars || "",
        responsibilityCenter: d?.responsibilityCenter || "",
        mfoPap: d?.mfoPap || "",
        amount: d?.amount != null ? Number(d.amount).toFixed(2) : "",
      })),
    [stableEntries],
  );

  const totalAmount = useMemo(() => stableEntries.reduce((sum, d) => sum + (parseFloat(d?.amount) || 0), 0).toFixed(2), [stableEntries]);

  const mop = stableHeader?.modeOfPayment || "";

  const pdfDoc = useMemo(
    () => (
      <PDFPortrait pdfTitle={pdfTitle}>
        <View style={styles.headerBox}>
          <View style={styles.headerLeft}>
            <Text style={styles.agencyName}>{process.env.REACT_APP_CUSTOMER_FULL_NAME}</Text>
            <Text style={styles.agencyCity}>Manila, Philippines</Text>
            <Text style={styles.dvLabel}>DISBURSEMENT VOUCHER</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.normalText}>Fund Cluster: {stableHeader?.fundCluster || ""}</Text>
            <Text style={styles.normalText}>Date: {stableHeader?.date || ""}</Text>
            <Text style={styles.normalText}>DV No.: {stableHeader?.dvNo || ""}</Text>
          </View>
        </View>

        <View style={styles.mopRow}>
          <Text style={styles.mopLabel}>Mode of Payment:</Text>
          <View style={styles.checkboxGroup}>
            <CheckItem label="MDS Check" checked={mop === "mds"} />
            <CheckItem label="Commercial Check" checked={mop === "commercial"} />
            <CheckItem label="ADA" checked={mop === "ada"} />
            <View style={styles.checkboxItem}>
              <View style={mop === "others" ? styles.checkboxChecked : styles.checkbox} />
              <Text style={styles.checkboxLabel}>Others: </Text>
              <View style={styles.othersLine}>
                <Text style={styles.checkboxLabel}>{mop === "others" ? stableHeader?.othersLabel || "" : ""}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Payee:</Text>
          <Text style={styles.fieldValue}>{stableHeader?.payee || ""}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Address:</Text>
          <Text style={styles.fieldValue}>{stableHeader?.address || ""}</Text>
        </View>

        <PDFTable columns={columns} data={data} />

        {data.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, { width: "80%", textAlign: "right", fontWeight: "bold" }]}>Total</Text>
            <Text style={[styles.totalCellLast, { width: "20%", textAlign: "left" }]}>P{totalAmount}</Text>
          </View>
        )}

        <View style={styles.certifiedBox}>
          <View style={styles.certifiedRow}>
            <Text>Certified</Text>
          </View>
          <View style={styles.certDetailRow}>
            <View style={styles.certDetailLeft}>
              <Text style={styles.certDetailText}>Charges to: {stableHeader?.chargesTo || ""}</Text>
              <View style={styles.certDetailUnderline} />
              <Text style={styles.certDetailText}>Available: {stableHeader?.available || ""}</Text>
              <View style={styles.certDetailUnderline} />
              <Text style={styles.certDetailText}>Head, Accounting Unit/Authorized Representative</Text>
              <Text style={styles.certDetailText}>Date: {stableHeader?.accountingDate || ""}</Text>
            </View>
            <View style={styles.certDetailRight}>
              <Text style={styles.certDetailText}>Cash Available: {stableHeader?.cashAvailable || ""}</Text>
              <View style={styles.certDetailUnderline} />
              <Text style={styles.certDetailText}>Subject to ADA: {stableHeader?.subjectToAda || ""}</Text>
              <View style={styles.certDetailUnderline} />
              <Text style={styles.certDetailText}>Head, Cash Unit/Authorized Representative</Text>
              <Text style={styles.certDetailText}>Date: {stableHeader?.cashDate || ""}</Text>
            </View>
          </View>
        </View>

        <View style={styles.approvedSection}>
          <Text style={styles.approvedLabel}>Approved for Payment</Text>
          <Text style={styles.approvedSignLabel}>Agency Head/Authorized Representative</Text>
          <Text style={styles.approvedSignLabel}>Date: {stableHeader?.approvedDate || ""}</Text>
        </View>

        <View style={styles.receiptBox}>
          <View style={styles.receiptLabel}>
            <Text>Receipt of Payment</Text>
          </View>
          <View style={styles.receiptDetail}>
            <View style={styles.receiptLine}>
              <Text style={styles.receiptFieldLabel}>Check/ADA No.:</Text>
              <View style={styles.receiptFieldLine}>
                <Text style={styles.certDetailText}>{stableHeader?.checkAdaNo || ""}</Text>
              </View>
              <Text style={styles.receiptFieldLabel}>Date:</Text>
              <View style={styles.receiptFieldLine}>
                <Text style={styles.certDetailText}>{stableHeader?.checkAdaDate || ""}</Text>
              </View>
            </View>
            <View style={styles.receiptLine}>
              <Text style={styles.receiptFieldLabel}>Bank Name:</Text>
              <View style={styles.receiptFieldLine}>
                <Text style={styles.certDetailText}>{stableHeader?.bankName || ""}</Text>
              </View>
              <Text style={styles.receiptFieldLabel}>Check/ADA Amount:</Text>
              <View style={styles.receiptFieldLine}>
                <Text style={styles.certDetailText}>{stableHeader?.checkAdaAmount || ""}</Text>
              </View>
            </View>
            <Text style={styles.receiptSignLabel}>Printed Name, Signature and Date of Receipt</Text>
          </View>
        </View>

        <View style={styles.jevFooter}>
          <Text style={styles.jevFooterText}>JEV No.: {stableHeader?.jevNo || "_______________"}</Text>
          <Text style={styles.jevFooterText}>Date: {stableHeader?.jevDate || "_______________"}</Text>
        </View>
      </PDFPortrait>
    ),
    [pdfTitle, stableHeader, data, totalAmount, columns, mop],
  );

  const handleNewUrl = (url) => {
    const inactive = activeRef.current === "a" ? iframeB.current : iframeA.current;
    if (inactive) inactive.src = url;
  };

  const doSwap = (incoming, outgoing) => {
    if (!incoming || !outgoing) return;
    incoming.style.transition = "none";
    incoming.style.opacity = "0";
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";
    incoming.getBoundingClientRect();
    incoming.style.transition = `opacity ${FADE_DURATION}ms ease`;
    outgoing.style.transition = `opacity ${FADE_DURATION}ms ease`;
    incoming.style.opacity = "1";
    outgoing.style.opacity = "0";
    setTimeout(() => {
      outgoing.style.transition = "none";
      outgoing.style.opacity = "1";
      outgoing.style.zIndex = "1";
      incoming.style.zIndex = "2";
      setIsFirstLoad(false);
    }, FADE_DURATION);
  };

  const handleLoadA = () => {
    if (activeRef.current !== "a") {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = setTimeout(() => {
        doSwap(iframeA.current, iframeB.current);
        activeRef.current = "a";
      }, RENDER_BUFFER);
    }
  };

  const handleLoadB = () => {
    if (activeRef.current !== "b") {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = setTimeout(() => {
        doSwap(iframeB.current, iframeA.current);
        activeRef.current = "b";
      }, RENDER_BUFFER);
    }
  };

  useEffect(() => () => clearTimeout(swapTimerRef.current), []);

  const iframeStyle = { position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "white" }}>
      <PDFRenderer key={rendererKey} pdfDoc={pdfDoc} onNewUrl={handleNewUrl} />
      {isFirstLoad && (
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <PDFSkeleton />
        </div>
      )}
      <iframe ref={iframeA} onLoad={handleLoadA} style={{ ...iframeStyle, zIndex: 1, opacity: 1 }} title="DV PDF A" />
      <iframe ref={iframeB} onLoad={handleLoadB} style={{ ...iframeStyle, zIndex: 1, opacity: 1 }} title="DV PDF B" />
    </div>
  );
};

export default React.memo(DisbursementVoucherPDF);
