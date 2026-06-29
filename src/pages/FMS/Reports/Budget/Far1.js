import React from 'react';

import PDFLandscape from '@/components/Common/PDFs/PDFLandscape';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { useGetFAR1ReportQuery } from '@/api/Endpoints/FMS/Reports/FAR1Report';

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

const Far1 = ({ pdfTitle }) => {
    const { data, isFetching } = useGetFAR1ReportQuery({}, { refetchOnMountOrArgChange: true });

    const columns = [
        { field: "particulars", header: "Particulars", width: "28%" },
        { field: "uacs", header: "UACS CODE", width: "18%" },
        { field: "approved", header: "Approved Appropriations", width: "18%", type: "number" },
        { field: "adjustedAppropriations", header: "Adjusted Appropriations", width: "18%", type: "number" },
        { field: "adjustments", header: "Adjustments", width: "18%", type: "number" },
        { field: "allotmentsReceived", header: "Allotments Received", width: "18%", type: "number" },
        { field: "allotmentsReleased", header: "Allotments Released", width: "18%", type: "number" },
        { field: "adjustmentsReleased", header: "Adjustments (Allotments Released)", width: "18%", type: "number" },
        { field: "transferTo", header: "Transfer To", width: "18%", type: "number" },
        { field: "transferFrom", header: "Transfer From", width: "18%", type: "number" },
        { field: "adjustedTotalAllotments", header: "Adjusted Total Allotments", width: "18%", type: "number" },
        { field: "q1", header: "1st Qtr", width: "18%", type: "number" },
        { field: "q2", header: "2nd Qtr", width: "18%", type: "number" },
        { field: "q3", header: "3rd Qtr", width: "18%", type: "number" },
        { field: "q4", header: "4th Qtr", width: "18%", type: "number" },
        { field: "total", header: "Total", width: "18%", type: "number" },
        { field: "unreleasedAppropriations", header: "Unreleased Appropriations", width: "18%", type: "number" },
        { field: "unobligatedAllotment", header: "Unobligated Allotment", width: "18%", type: "number" },
        { field: "dueAndDemandable", header: "Due and Demandable", width: "18%", type: "number" },
        { field: "notYetDue", header: "Not Yet Due and Demandable", width: "18%", type: "number" },
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    STATEMENT OF APPROPRIATIONS, ALLOTMENTS, OBLIGATIONS, DISBURSEMENTS AND BALANCES
                </Text>
                <Text style={styles.subtitle}>
                    As of 1st Quarter Ending March, 2025
                </Text>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Department:</Text>
                    <Text style={styles.infoValue}>D36</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Agency:</Text>
                    <Text style={styles.infoValue}>Philippine Sports Commission</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Operating Units:</Text>
                    <Text style={styles.infoValue}>Philippine Sports Commission</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Organization Code (UACS):</Text>
                    <Text style={styles.infoValue}>26048</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Funding Source Code (as clustered):</Text>
                    <Text style={styles.infoValue}></Text>
                </View>
            </View>

            <PDFTable columns={columns} data={data?.returnData || []} />
        </PDFLandscape>
    );
};

export default React.memo(Far1);