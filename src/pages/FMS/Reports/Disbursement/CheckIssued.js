import PDFLandscape from '@/components/Common/PDFs/PDFLandscape';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
    header: {
        marginBottom: 15,
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    infoSection: {
        marginBottom: 15,
        fontSize: 7,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    infoLabel: {
        width: 150,
    },
    infoValue: {
        flex: 1,
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
    fontSize: 8,
    marginBottom: 5,
    textAlign: 'left',
  },

  sigLine: {
    width: '70%',
    alignSelf:'center',
    borderBottom: "0.5pt solid #000",
    marginTop: 20,
  },

  sigPosition: {
    marginTop: 5,
    fontSize: 8,
    textAlign: 'center',
  },
});

const CheckIssued = ({ pdfTitle }) => {

    const data = [
        {
            checkNo: "297086",
            checkDate: "06/03/2025",
            payee: "DELA CRUZ, JUAN CARLO R.",
            natureOfPayment: "Payment for training expenses",
            amount: 125000.00
        },
        {
            checkNo: "297087",
            checkDate: "06/03/2025",
            payee: "SANTOS, MARIA ELENA C.",
            natureOfPayment: "Reimbursement of office supplies",
            amount: 45750.00
        },
        {
            checkNo: "297088",
            checkDate: "06/03/2025",
            payee: "ABC COMPUTER SUPPLIES",
            natureOfPayment: "Purchase of IT equipment",
            amount: 876432.89
        },
        {
            checkNo: "297089",
            checkDate: "06/03/2025",
            payee: "XYZ TRADING",
            natureOfPayment: "Office furniture and fixtures",
            amount: 187385.00
        }
    ];


    const columns = [
        { field: "checkNo", header: "Check No.", width: "10%" },
        { field: "checkDate", header: "Check Date", width: "10%" },
        { field: "payee", header: "Payee", width: "30%" },
        { field: "natureOfPayment", header: "Nature of Payment", width: "35%" },
        { field: "amount", header: "Amount", width: "15%", type: "number" }
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Report of Checks Issued
                </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, marginBottom: 4 }}>
                <Text style={{ width: '33%', textAlign: 'left' }}>
                    Entity Name :  Agency Name
                </Text>
                <Text style={{ width: '33%', textAlign: 'center' }}>
                    Report No:  RCI-2024-07-001
                </Text>
                <Text style={{ width: '33%' }}></Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, marginBottom: 4 }}>
                <Text style={{ width: '33%', textAlign: 'left' }}>
                    Fund Cluster: 01 - Regular Fund
                </Text>
                <Text style={{ width: '33%', textAlign: 'center' }}>
                    Date: 2025-05-29
                </Text>
                <Text style={{ width: '33%' }}></Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, marginBottom: 4 }}>
                <Text style={{ textAlign: 'left', marginTop: 10 }}>
                    Bank Name / Account: LAND BANK OF THE PHILIPPINES
                </Text>
                <Text style={{ width: '33%' }}></Text>
            </View>
            <PDFTable columns={columns} data={data} />
            <Text style={{ width: '33%', textAlign: 'left' ,marginTop: 10 }}>
                Fund Cluster: 01 - Regular Fund
            </Text>
            <View style={{ marginLeft: 10, marginTop: 20 }} >
                <Text style={{ textAlign: 'left' }}>
                    1. Each check was drawn againts the bank account indicated above.
                </Text>
                <Text style={{ textAlign: 'left' }}>
                    2. The total checks issued is correcly summarized above.
                </Text>
            </View>

            <View style={styles.signature}>
                    <View style={styles.sigBlock}>
                      <View style={styles.sigLine} />
                      <Text style={styles.sigPosition}>Treasury Officer</Text>
                       <Text style={styles.sigPosition}>Position/Office</Text>
                    </View>
            
                    <View style={styles.sigBlock}>
                      <View style={styles.sigLine} />
                      <Text style={styles.sigPosition}>Date</Text>
                    </View>
                  </View>
        </PDFLandscape>
    );
};

export default React.memo(CheckIssued);