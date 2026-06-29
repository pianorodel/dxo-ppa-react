import React from 'react';

import PDFLandscape from '@/components/Common/PDFs/PDFLandscape';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { useGetRAOReportQuery } from '@/api/Endpoints/FMS/Reports/RAOReport';

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
    }
});

const Rao = ({ pdfTitle }) => {
    const { data, isFetching } = useGetRAOReportQuery({}, { refetchOnMountOrArgChange: true });

    const columns = [
        { field: "date", header: "Date", width: "10%" },
        { field: "reference", header: "Reference", width: "40%" },
        { field: "acctCode", header: "Acct. Code", width: "10%" },
        { field: "allotmentReceived", header: "Allotment Received", width: "13%", type: "number" },
        { field: "obligationIncurred", header: "Obligation Incurred", width: "13%", type: "number" },
        { field: "balance", header: "Balance", width: "13%", type: "number" }
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    REGISTRY OF ALLOTMENTS AND OBLIGATIONS
                </Text>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Personnel Services:</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>For the year 2025</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fund:</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Legal Basis:</Text>
                </View>
            </View>

            <PDFTable columns={columns} data={data} />
        </PDFLandscape>
    );
};

export default React.memo(Rao);