import React from 'react';

import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { useGetClientMasterListReportQuery } from '@/api/Endpoints/FMS/Reports/ClientMasterListReport';

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

const ClientMasterListReport = ({ pdfTitle }) => {
    const { data, isFetching } = useGetClientMasterListReportQuery({}, { refetchOnMountOrArgChange: true });

    const columns = [
        { field: "clientName", header: "Client Name", width: "25%" },
        { field: "contactPerson", header: "Contact Person", width: "20%" },
        { field: "tin", header: "TIN", width: "15%" },
        { field: "emailAddress", header: "Email Address", width: "25%" },
        { field: "mobileNo", header: "Mobile No.", width: "15%" }
    ];

    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>
                    CLIENT MASTERLIST REPORT
                </Text>
                <Text style={styles.subtitle}>
                    As of Nov 24 2025
                </Text>
            </View>

            <PDFTable columns={columns} data={data?.returnData || []} />
        </PDFPortrait >
    )
}

export default React.memo(ClientMasterListReport);