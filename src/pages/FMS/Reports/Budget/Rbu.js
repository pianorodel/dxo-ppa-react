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
    },
    subtitle: {
        fontSize: 8,
        marginBottom: 15,
    }
});

const Rbu = ({ pdfTitle }) => {

    const data = [
        {
            date: "2/12/2025",
            reference: "BUD2025-02-0001",
            uacsObjectCode: "50101010-01",
            budget: 474093685.77,
            utilization: 0.00,
            unutilizedBudget: 474093685.77,
            remarks: ""
        },
        {
            date: "2/12/2025",
            reference: "BUD2025-02-0002",
            uacsObjectCode: "50102010-01",
            budget: 20903031.81,
            utilization: 0.00,
            unutilizedBudget: 20903031.81,
            remarks: ""
        },
        {
            date: "2/12/2025",
            reference: "BUD2025-02-0003",
            uacsObjectCode: "50102020",
            budget: 13865425.00,
            utilization: 0.00,
            unutilizedBudget: 13865425.00,
            remarks: ""
        },
        {
            date: "2/12/2025",
            reference: "BUD2025-02-0004",
            uacsObjectCode: "50102030-01",
            budget: 13471925.00,
            utilization: 0.00,
            unutilizedBudget: 13471925.00,
            remarks: ""
        },
        {
            date: "2/12/2025",
            reference: "BUD2025-02-0005",
            uacsObjectCode: "50102040-01",
            budget: 168000.00,
            utilization: 0.00,
            unutilizedBudget: 168000.00,
            remarks: ""
        }
    ];

    const columns = [
        { field: "date", header: "Date", width: "10%" },
        { field: "reference", header: "Reference", width: "15%" },
        { field: "uacsObjectCode", header: "UACS Object Code", width: "15%" },
        { field: "budget", header: "Budget", width: "15%", type: "number" },
        { field: "utilization", header: "Utilization", width: "12%", type: "number" },
        { field: "unutilizedBudget", header: "Unutilized Budget", width: "15%", type: "number" },
        { field: "remarks", header: "Remarks", width: "18%" }
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Registry of Budgets and Utilizations (RBU)
                </Text>
                <Text style={styles.subtitle}>
                    As of 2025
                </Text>
            </View>

            <PDFTable columns={columns} data={data} />
        </PDFLandscape>
    );
};

export default React.memo(Rbu);