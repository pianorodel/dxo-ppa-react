import { PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";

import React, { useEffect, useMemo, useState } from "react";

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

const JevPDF = ({ pdfTitle, accountEntries = [], headerData = {} }) => {
  const [stableEntries, setStableEntries] = useState(accountEntries);
  const [stableHeader, setStableHeader] = useState(headerData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStableEntries(accountEntries);
      setStableHeader(headerData);
    }, 300);
    return () => clearTimeout(timer);
  }, [accountEntries, headerData]);

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
      { field: "date", header: "Date", width: "33%" },
      { field: "description", header: "Description", width: "33%" },
      { field: "documentNo", header: "Document No", width: "33%" },
    ],
    [],
  );

  const data = useMemo(
    () =>
      stableEntries.map((d) => ({
        responsibilityCenter: d?.responsibilityCenter?.officeName || "",
        accountTitle: d?.accountTitle?.accountTitle || "",
        accountCode: d?.accountTitle?.accountCode || "",
        subObjectCode: d?.subObject?.label || "",
        debit: d?.debit || 0,
        credit: d?.credit || 0,
      })),
    [stableEntries],
  );

  const supportingDocsData = useMemo(() => [{ date: "test", description: "test", documentNo: "test" }], []);

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
            <Text style={styles.normalText}>{stableHeader?.fundingSourceId?.label}</Text>
          </View>

          <View style={[styles.headerColumnLast, { width: "25%" }]}>
            <Text style={styles.normalText}>No.: JEV-2025-07-004525</Text>
            <Text style={styles.normalText}>Date: {stableHeader.transactionDate}</Text>
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
          <Text style={styles.particularsText}>{stableHeader.particulars}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Prepared by:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureName}>SANTOS, MARIA L.</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Approved by:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureName}>JUAN DELA CRUZ</Text>
          </View>
        </View>
      </PDFPortrait>
    ),
    [pdfTitle, stableHeader, data, totalDebit, totalCredit],
  );

  return (
    <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar>
      {pdfDoc}
    </PDFViewer>
  );
};

export default React.memo(JevPDF);
