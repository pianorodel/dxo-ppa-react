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
    marginTop: 40
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

const SubsidiaryLedgerReport = ({ pdfTitle }) => {

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
      date: "2025-03-15",
      jevNo: "JEV-2025-06-007644",
      reference: "DV-2025-03-011",
      particulars:
        "Payment for Fees to Contractors - Payment for the 15% Mobilization fee for the Six-Storey East Wing Building (MONOBUILD CONSTRUCTION, INC.)",
      debit: "59,820,000.00",
      credit: "0.00",
      balance: "59,820,000.00"
    },
    {
      date: "2025-03-20",
      jevNo: "JEV-2025-06-007645",
      reference: "DV-2025-03-015",
      particulars:
        "Advance payment for construction materials and initial works",
      debit: "25,000,000.00",
      credit: "0.00",
      balance: "84,820,000.00"
    },
    {
      date: "2025-03-25",
      jevNo: "JEV-2025-06-007646",
      reference: "JV-2025-03-008",
      particulars:
        "Recoupment of 20% of Mobilization Fee based on 1st Progress Billing",
      debit: "0.00",
      credit: "11,964,000.00",
      balance: "72,856,000.00"
    },
    {
      date: "2025-03-31",
      jevNo: "JEV-2025-06-007647",
      reference: "JV-2025-03-010",
      particulars:
        "Recording of contractors accomplishment for March 2025",
      debit: "0.00",
      credit: "15,000,000.00",
      balance: "57,856,000.00"
    },
    {
      date: "",
      jevNo: "",
      reference: "",
      particulars: "TOTAL",
      debit: "84,820,000.00",
      credit: "26,964,000.00",
      balance: "57,856,000.00"
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
          SUBSIDIARY LEDGER REPORT
        </Text>
        <Text style={styles.subtitle}>
          {asOfText}
        </Text>

        <Text style={styles.generalLedger}>
          General Ledger Account :
        </Text>
        <Text style={styles.generalLedger}>
          Subsidiary Ledger Account :
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

export default React.memo(SubsidiaryLedgerReport);