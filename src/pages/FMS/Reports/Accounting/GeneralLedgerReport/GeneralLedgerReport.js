import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  signature: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 70
  },

  sigBlock: {
    width: '45%',
  },

  sigTopLabel: {
    fontSize: 9,
    marginBottom: 5,
    textAlign: 'left',
  },

  sigLine: {
    width: '100%',
    borderBottom: "0.5pt solid #000",
    marginTop: 20,
  },

  sigPosition: {
    marginTop: 5,
    fontSize: 9,
    textAlign: 'center',
  },

  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  generalLedger: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
});

const GeneralLedgerReport = ({ pdfTitle }) => {

  const data = [
    {
      date: "2025-03-01",
      jevNo: "BB-2025-03",
      reference: "-",
      particulars: "Beginning Balance",
      debit: "0.00",
      credit: "0.00",
      balance: "0.00"
    },
    {
      date: "2025-03-10",
      jevNo: "JEV-2025-06-007639",
      reference: "-",
      particulars:
        "Collection of traffic violation fees from Metro Manila LGUs for the month of May 2025",
      debit: "250,733,196.43",
      credit: "0.00",
      balance: "250,733,196.43"
    },
    {
      date: "2025-03-11",
      jevNo: "JEV-2025-06-007640",
      reference: "-",
      particulars:
        "Collection of environmental fees from commercial establishments along EDSA and C5 corridors for June 2025",
      debit: "180,000,000.00",
      credit: "0.00",
      balance: "430,733,196.43"
    },
    {
      date: "2025-03-12",
      jevNo: "JEV-2025-06-007643",
      reference: "-",
      particulars:
        "Collection of parking fees from designated MMDA parking areas in Makati and Ortigas Business Districts",
      debit: "125,000,000.00",
      credit: "0.00",
      balance: "555,733,196.43"
    },
    {
      date: "2025-03-13",
      jevNo: "JEV-2025-06-007641",
      reference: "-",
      particulars:
        "Payment for fuel consumption of MMDA patrol vehicles and emergency response units for May 2025",
      debit: "0.00",
      credit: "35,000,000.00",
      balance: "520,733,196.43"
    },
    {
      date: "2025-03-14",
      jevNo: "JEV-2025-06-007642",
      reference: "-",
      particulars:
        "Payment of hazard pay for traffic enforcers and flood control personnel for May 2025",
      debit: "0.00",
      credit: "752,279.39",
      balance: "519,980,917.04"
    },
    {
      date: "2025-03-15",
      jevNo: "JEV-2025-06-007644",
      reference: "-",
      particulars:
        "Payment for Fees to Contractors - Payment for the 15% Mobilization fee for the Six-Storey East Wing Building (MONOBUILD CONSTRUCTION, INC.)",
      debit: "59,820,000.00",
      credit: "0.00",
      balance: "579,800,917.04"
    },
    {
      date: "2025-03-15",
      jevNo: "JEV-2025-06-007644",
      reference: "-",
      particulars:
        "Payment for Fees to Contractors - Payment for the 15% Mobilization fee for the Six-Storey East Wing Building (MONOBUILD CONSTRUCTION, INC.)",
      debit: "0.00",
      credit: "59,820,000.00",
      balance: "519,980,917.04"
    },
    {
      date: "",
      jevNo: "",
      reference: "",
      particulars: "TOTAL",
      debit: "615,553,196.43",
      credit: "95,572,279.39",
      balance: "519,980,917.04"
    }
  ];

  const date = new Date();

  const formattedDate = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(",", "");

  const asOfText = `As of ${formattedDate}`;

  const columns = [
    { field: "date", header: "Date", width: "9%" },
    { field: "jevNo", header: "JEV No.", width: "15%" },
    { field: "reference", header: "Reference", width: "15%" },
    { field: "particulars", header: "Particulars", width: "20%" },
    { field: "debit", header: "Debit", width: "13%" },
    { field: "credit", header: "Credit", width: "14%" },
    { field: "balance", header: "Balance", width: "14%" }
  ];

  return (
    <PDFPortrait pdfTitle={pdfTitle}>
      <View style={styles.header} fixed>
        <Text style={styles.title}>
          GENERAL LEDGER REPORT
        </Text>
        <Text style={styles.subtitle}>
          {asOfText}
        </Text>
      </View>

      <PDFTable columns={columns} data={data} />
      <View style={styles.signature}>
        <View style={styles.sigBlock}>
          <Text style={styles.sigTopLabel}>Prepared By :</Text>
          <View style={styles.sigLine} />
          <Text style={styles.sigPosition}>Accountant</Text>
        </View>

        <View style={styles.sigBlock}>
          <Text style={styles.sigTopLabel}>Certified Correct :</Text>
          <View style={styles.sigLine} />
          <Text style={styles.sigPosition}>Division Chief</Text>
        </View>
      </View>

    </PDFPortrait >
  )
}

export default React.memo(GeneralLedgerReport);