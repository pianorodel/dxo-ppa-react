import PDFLandscape from "@/components/Common/PDFs/PDFLandscape";
import PDFTable from "@/components/Common/PDFs/PDFTable";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
    header: { marginBottom: 12 },
    title: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 8,
        marginBottom: 12,
        textAlign: "center",
    },
    infoRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        marginBottom: 10,
    },
    printedDate: {
        marginTop: 10,
        fontSize: 8,
    },
    pageNum: {
        position: "absolute",
        bottom: 20,
        right: 20,
        fontSize: 8,
    },
});

const IndexOfPayment = ({ pdfTitle }) => {
    const periodFrom = "2025-07-01";
    const periodTo = "2025-07-31";
    const printedDate = "12/02/2025 08:17:28 PM";

    const columns = [
        { field: "date", header: "CHECK / DV DATE", width: "12%" },
        { field: "ref", header: "REFERENCE / CHECK / DV NO", width: "15%" },
        { field: "particulars", header: "PARTICULARS", width: "33%" },
        { field: "code", header: "CODE / DESC", width: "10%" },
        { field: "gross", header: "GROSS", width: "10%" },
        { field: "deductions", header: "DEDUCTIONS", width: "10%" },
        { field: "net", header: "NET", width: "10%" },
    ];

    const data = [
        {
            date: "7/7/2025",
            ref: "9900009072",
            particulars: "No transactions found for selected payee",
            code: "N/A",
            gross: "0.00",
            deductions: "0.00",
            net: "",
        },
        {
            date: "TOTALS",
            ref: "",
            particulars: "",
            code: "",
            gross: "0.00",
            deductions: "0.00",
            net: "0.00",
        },
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>INDEX OF PAYMENTS</Text>
                <Text style={styles.subtitle}>
                    For the Period {periodFrom} to {periodTo}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Text>Employee Name: No Payee Selected</Text>
                <Text>Employee No.: 3020420</Text>
            </View>
            <PDFTable columns={columns} data={data} />
            <View style={styles.infoRow}>
                <Text> Date/Time Printed: {printedDate}</Text>
                <Text>Page 1 of 2</Text>
            </View>
        </PDFLandscape>
    );
};

export default React.memo(IndexOfPayment);
