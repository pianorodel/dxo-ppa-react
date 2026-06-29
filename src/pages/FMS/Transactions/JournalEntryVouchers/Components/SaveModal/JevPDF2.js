import { StyleSheet, Text, View, usePDF } from "@react-pdf/renderer";

import React, { useEffect, useMemo, useRef, useState } from "react";

import PDFPortrait from "@/components/Common/PDFs/PDFPortrait";
import PDFTable from "@/components/Common/PDFs/PDFTable";

const styles = StyleSheet.create({
  headerBox: { border: "1px solid #dcdcdc", display: "flex", flexDirection: "row", marginBottom: 0 },
  headerColumn: { borderRight: "1px solid #dcdcdc", padding: 8 },
  headerColumnLast: { padding: 8 },
  boldText: { fontWeight: "bold", marginBottom: 4, fontSize: 9 },
  normalText: { marginBottom: 2, fontSize: 8 },
  accountTableHeader: {
    display: "flex",
    flexDirection: "row",
    borderLeft: "1px solid #dcdcdc",
    borderRight: "1px solid #dcdcdc",
    borderBottom: "1px solid #dcdcdc",
    backgroundColor: "#dcdcdc",
  },
  accountTableHeaderCell: { padding: 6, borderRight: "1px solid #dcdcdc", fontWeight: "bold", textAlign: "center", fontSize: 8 },
  accountTableHeaderCellLast: { padding: 6, fontWeight: "bold", textAlign: "center", fontSize: 8 },
  totalRow: { display: "flex", flexDirection: "row", backgroundColor: "#f9f9f9" },
  totalCell: { padding: 6, fontSize: 8 },
  totalCellLast: { padding: 6, fontSize: 8 },
  supportingDocsTable: { marginTop: 10 },
  particularsSection: { marginTop: 10, marginBottom: 20 },
  particularsLabel: { fontWeight: "bold", fontSize: 8, marginBottom: 4 },
  particularsText: { fontSize: 8 },
  signatureSection: { display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  signatureBox: { width: "45%" },
  signatureLabel: { fontSize: 8, marginBottom: 20 },
  signatureLine: { borderBottom: "1px solid black", marginBottom: 2 },
  signatureName: { fontSize: 8, fontWeight: "bold", textAlign: "center" },
});

const PDFSkeleton = () => (
  <div style={{ width: "100%", height: "100%", background: "#f5f5f5", padding: "20px", boxSizing: "border-box" }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      .shimmer {
        background: linear-gradient(90deg, #ececec 25%, #e0e0e0 50%, #ececec 75%);
        background-size: 1000px 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
    `}</style>
    <div style={{ background: "white", maxWidth: 700, margin: "0 auto", padding: 32, minHeight: "90%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div className="shimmer" style={{ height: 80, flex: "0 0 40%" }} />
        <div className="shimmer" style={{ height: 80, flex: "0 0 35%" }} />
        <div className="shimmer" style={{ height: 80, flex: "0 0 25%" }} />
      </div>
      <div className="shimmer" style={{ height: 28, marginBottom: 8 }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="shimmer" style={{ height: 22, marginBottom: 6, opacity: 1 - i * 0.1 }} />
      ))}
      <div className="shimmer" style={{ height: 22, marginBottom: 24, width: "40%", marginLeft: "auto" }} />
      <div className="shimmer" style={{ height: 16, width: "30%", marginBottom: 12 }} />
      <div className="shimmer" style={{ height: 28, marginBottom: 8 }} />
      <div className="shimmer" style={{ height: 22, marginBottom: 24 }} />
      <div className="shimmer" style={{ height: 14, width: "20%", marginBottom: 8 }} />
      <div className="shimmer" style={{ height: 14, marginBottom: 4 }} />
      <div className="shimmer" style={{ height: 14, width: "70%", marginBottom: 32 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="shimmer" style={{ height: 60, width: "40%" }} />
        <div className="shimmer" style={{ height: 60, width: "40%" }} />
      </div>
    </div>
  </div>
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
    if (instance.url) {
      onNewUrl(instance.url);
    }
  }, [instance.url]);

  return null;
};

const JevPDF = ({ pdfTitle, accountEntries = [], supportingDocuments = [], headerData = {} }) => {
  const [stableEntries, setStableEntries] = useState(accountEntries);
  const [stableHeader, setStableHeader] = useState(headerData);
  const [stableSupportingDocs, setStableSupportingDocs] = useState(supportingDocuments);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [rendererKey, setRendererKey] = useState(0);

  const iframeA = useRef(null);
  const iframeB = useRef(null);
  const activeRef = useRef("a");
  const swapTimerRef = useRef(null);
  const rowCountRef = useRef(accountEntries.length);
  const supportingDocsCountRef = useRef(supportingDocuments.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStableEntries(accountEntries);
      setStableHeader(headerData);
      setStableSupportingDocs(supportingDocuments);

      const entriesChanged = accountEntries.length !== rowCountRef.current;
      const docsChanged = supportingDocuments.length !== supportingDocsCountRef.current;

      if (entriesChanged || docsChanged) {
        rowCountRef.current = accountEntries.length;
        supportingDocsCountRef.current = supportingDocuments.length;
        setRendererKey((k) => k + 1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [accountEntries, headerData, supportingDocuments]);

  const columns = useMemo(
    () => [
      { field: "responsibilityCenter", header: "Responsibility Center", width: "20%" },
      { field: "accountTitle", header: "Account Title", width: "20%" },
      { field: "accountCode", header: "Account Code", width: "20%" },
      { field: "subObjectCode", header: "Sub-Object Code", width: "20%" },
      { field: "debit", header: "Debit", width: "10%" },
      { field: "credit", header: "Credit", width: "10%" },
    ],
    [],
  );

  const supportingDocsColumns = useMemo(
    () => [
      { field: "codeDescription", header: "Code and Description", width: "40%" },
      { field: "documentNo", header: "Document No.", width: "30%" },
      { field: "date", header: "Date", width: "30%" },
    ],
    [],
  );

  const data = useMemo(
    () =>
      stableEntries.filter(Boolean).map((d) => ({
        responsibilityCenter: d?.responsibilityCenter?.officeName || "",
        accountTitle: d?.accountTitle?.accountTitle || "",
        accountCode: d?.accountTitle?.accountCode || "",
        subObjectCode: d?.subObject?.label || "",
        debit: d?.debit || 0,
        credit: d?.credit || 0,
      })),
    [stableEntries],
  );

  const supportingDocsData = useMemo(
    () =>
      stableSupportingDocs.filter(Boolean).map((d) => ({
        codeDescription: d?.codeDescription || "",
        documentNo: d?.documentNo || "",
        date: d?.date || "",
      })),
    [stableSupportingDocs],
  );

  const { totalDebit, totalCredit } = useMemo(() => {
    const totalDebit = data.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
    const totalCredit = data.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
    return { totalDebit: totalDebit.toFixed(2), totalCredit: totalCredit.toFixed(2) };
  }, [data]);

  const pdfDoc = useMemo(
    () => (
      <PDFPortrait pdfTitle={pdfTitle}>
        <View style={styles.headerBox}>
          <View style={[styles.headerColumn, { width: "40%" }]}>
            <Text style={styles.boldText}>Journal Entry Voucher</Text>
            <Text style={styles.normalText}>PHILIPPINE</Text>
            <Text style={styles.normalText}>SPORTS</Text>
            <Text style={styles.normalText}>COMMISSION</Text>
          </View>
          <View style={[styles.headerColumn, { width: "35%" }]}>
            <Text style={styles.boldText}>Funding Source:</Text>
            <Text style={styles.normalText}>{stableHeader?.fundingSourceId?.label || ""}</Text>
          </View>
          <View style={[styles.headerColumnLast, { width: "25%" }]}>
            <Text style={styles.normalText}>No.: JEV-2025-07-004525</Text>
            <Text style={styles.normalText}>Date: {stableHeader?.transactionDate || ""}</Text>
          </View>
        </View>

        <PDFTable columns={columns} data={data} />

        {data.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, { width: "80%", textAlign: "right", fontWeight: "bold" }]}>TOTAL</Text>
            <Text style={[styles.totalCell, { width: "10%", textAlign: "left" }]}>P{totalDebit}</Text>
            <Text style={[styles.totalCellLast, { width: "10%", textAlign: "left" }]}>P{totalCredit}</Text>
          </View>
        )}

        <View style={styles.supportingDocsTable}>
          <Text style={styles.boldText}>Supporting Documents:</Text>
        </View>
        <PDFTable columns={supportingDocsColumns} data={supportingDocsData} />

        <View style={styles.particularsSection}>
          <Text style={styles.particularsLabel}>Particulars:</Text>
          <Text style={styles.particularsText}>{stableHeader?.particulars || ""}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Prepared by:</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>SANTOS, MARIA L.</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Approved by:</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>JUAN DELA CRUZ</Text>
          </View>
        </View>
      </PDFPortrait>
    ),
    [pdfTitle, stableHeader, data, supportingDocsData, totalDebit, totalCredit, columns, supportingDocsColumns],
  );

  const handleNewUrl = (url) => {
    const inactive = activeRef.current === "a" ? iframeB.current : iframeA.current;
    if (inactive) {
      inactive.src = url;
    }
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

  useEffect(() => {
    return () => clearTimeout(swapTimerRef.current);
  }, []);

  const iframeStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "white" }}>
      <PDFRenderer key={rendererKey} pdfDoc={pdfDoc} onNewUrl={handleNewUrl} />

      {isFirstLoad && (
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <PDFSkeleton />
        </div>
      )}

      <iframe ref={iframeA} onLoad={handleLoadA} style={{ ...iframeStyle, zIndex: 1, opacity: 1 }} title="JEV PDF A" />
      <iframe ref={iframeB} onLoad={handleLoadB} style={{ ...iframeStyle, zIndex: 1, opacity: 1 }} title="JEV PDF B" />
    </div>
  );
};

export default React.memo(JevPDF);
