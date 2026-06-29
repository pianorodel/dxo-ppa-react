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

const Rbud = ({ pdfTitle }) => {

    const data = [
        {
            date: "2/12/2025",
            referenceNo: "RBUD2025-02-0001",
            uacsObjectCode: "50101010-01",
            budgetedAmount: 474093685.77,
            utilizedAmount: 0.00,
            disbursedAmount: 0.00,
            unutilizedBalance: 474093685.77,
            undisbursedBalance: 474093685.77,
            remarks: ""
        },
        {
            date: "2/12/2025",
            referenceNo: "RBUD2025-02-0002",
            uacsObjectCode: "50102010-01",
            budgetedAmount: 20903031.81,
            utilizedAmount: 0.00,
            disbursedAmount: 0.00,
            unutilizedBalance: 20903031.81,
            undisbursedBalance: 20903031.81,
            remarks: ""
        },
        {
            date: "2/12/2025",
            referenceNo: "RBUD2025-02-0003",
            uacsObjectCode: "50102020",
            budgetedAmount: 13865425.00,
            utilizedAmount: 0.00,
            disbursedAmount: 0.00,
            unutilizedBalance: 13865425.00,
            undisbursedBalance: 13865425.00,
            remarks: ""
        },
        {
            date: "2/12/2025",
            referenceNo: "RBUD2025-02-0004",
            uacsObjectCode: "50102030-01",
            budgetedAmount: 13471925.00,
            utilizedAmount: 0.00,
            disbursedAmount: 0.00,
            unutilizedBalance: 13471925.00,
            undisbursedBalance: 13471925.00,
            remarks: ""
        },
        {
            date: "2/12/2025",
            referenceNo: "RBUD2025-02-0005",
            uacsObjectCode: "50102040-01",
            budgetedAmount: 168000.00,
            utilizedAmount: 0.00,
            disbursedAmount: 0.00,
            unutilizedBalance: 168000.00,
            undisbursedBalance: 168000.00,
            remarks: ""
        }
    ];

    const columns = [
        { field: "date", header: "Date", width: "8%" },
        { field: "referenceNo", header: "Reference No.", width: "12%" },
        { field: "uacsObjectCode", header: "UACS Object Code", width: "10%" },
        { field: "budgetedAmount", header: "Budgeted Amount", width: "12%", type: "number" },
        { field: "utilizedAmount", header: "Utilized Amount", width: "10%", type: "number" },
        { field: "disbursedAmount", header: "Disbursed Amount", width: "12%", type: "number" },
        { field: "unutilizedBalance", header: "Unutilized Balance", width: "12%", type: "number" },
        { field: "undisbursedBalance", header: "Undisbursed Balance", width: "12%", type: "number" },
        { field: "remarks", header: "Remarks", width: "12%" }
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Registry of Budget, Utilization and Disbursements (RBUD)
                </Text>
                <Text style={styles.subtitle}>
                    As of 2025
                </Text>
            </View>

            <PDFTable columns={columns} data={data} />
        </PDFLandscape>
    );
};

export default React.memo(Rbud);