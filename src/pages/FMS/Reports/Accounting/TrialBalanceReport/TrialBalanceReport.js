import React from 'react';

import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
});

const TrialBalanceReport = ({ pdfTitle }) => {



  const data = [
    {
      accountCode: "19902010",
      accountTitle: "Advances to Contractors",
      debit: "59,820,000.00",
      credit: ""
    },
    {
      accountCode: "10102010",
      accountTitle: "Cash - Treasury/Agency Deposit, Regular",
      debit: "125,000,000.00",
      credit: ""
    },
    {
      accountCode: "10205020",
      accountTitle: "Construction in Progress - Buildings",
      debit: "398,800,000.00",
      credit: ""
    },
    {
      accountCode: "10102030",
      accountTitle: "Cash - Modified Disbursement System (MDS)",
      debit: "750,000,000.00",
      credit: ""
    },
    {
      accountCode: "10102020",
      accountTitle: "Cash in Bank - Local Currency, Current Amount",
      debit: "",
      credit: "59,820,000.00"
    },
    {
      accountCode: "20101100",
      accountTitle: "Accounts Payable",
      debit: "",
      credit: "398,800,000.00"
    },
    {
      accountCode: "40202160",
      accountTitle: "Fines and Penalties - Traffic/Parking",
      debit: "",
      credit: "250,733,196.43"
    },
    {
      accountCode: "40202170",
      accountTitle: "Environmental/Sanitary Fees",
      debit: "",
      credit: "180,000,000.00"
    },
    {
      accountCode: "40202180",
      accountTitle: "Parking Fees",
      debit: "",
      credit: "125,000,000.00"
    },
    {
      accountCode: "",
      accountTitle: "TOTAL",
      debit: "1,333,620,000.00",
      credit: "1,014,353,196.43"
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
    { field: "accountCode", header: "Account Code", width: "15%" },
    { field: "accountTitle", header: "Account Title", width: "45%" },
    { field: "debit", header: "Debit", width: "20%" },
    { field: "credit", header: "Credit", width: "20%" }
  ];

  return (
    <PDFPortrait pdfTitle={pdfTitle}>
      <View style={styles.header} fixed>
        <Text style={styles.title}>
          TRIAL BALANCE REPORT
        </Text>
        <Text style={styles.subtitle}>
          {asOfText}
        </Text>
      </View>

      <PDFTable columns={columns} data={data} />
    </PDFPortrait >
  )
}

export default React.memo(TrialBalanceReport);