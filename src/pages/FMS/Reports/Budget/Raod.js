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

const Raod = ({ pdfTitle }) => {

    const data = [
        {
            date: "2/12/2025",
            referenceDate: "2/12/2025",
            referenceSerialNumber: "AD2025-02-0001",
            uacsObjectCode: "50101010-01",
            allotments: 474093685.77,
            obligations: 0.00,
            unobligatedAllotments: 474093685.77,
            disbursements: 0.00,
            unpaidObligationsDueAndDemandable: 0.00,
            unpaidObligationsNotYetDue: 0.00
        },
        {
            date: "2/12/2025",
            referenceDate: "2/12/2025",
            referenceSerialNumber: "AD2025-02-0001",
            uacsObjectCode: "50102010-01",
            allotments: 20903031.81,
            obligations: 0.00,
            unobligatedAllotments: 494996717.58,
            disbursements: 0.00,
            unpaidObligationsDueAndDemandable: 0.00,
            unpaidObligationsNotYetDue: 0.00
        },
        {
            date: "2/12/2025",
            referenceDate: "2/12/2025",
            referenceSerialNumber: "AD2025-02-0001",
            uacsObjectCode: "50102020",
            allotments: 13865425.00,
            obligations: 0.00,
            unobligatedAllotments: 508862142.58,
            disbursements: 0.00,
            unpaidObligationsDueAndDemandable: 0.00,
            unpaidObligationsNotYetDue: 0.00
        },
        {
            date: "2/12/2025",
            referenceDate: "2/12/2025",
            referenceSerialNumber: "AD2025-02-0001",
            uacsObjectCode: "50102030-01",
            allotments: 13471925.00,
            obligations: 0.00,
            unobligatedAllotments: 522334067.58,
            disbursements: 0.00,
            unpaidObligationsDueAndDemandable: 0.00,
            unpaidObligationsNotYetDue: 0.00
        },
        {
            date: "2/12/2025",
            referenceDate: "2/12/2025",
            referenceSerialNumber: "AD2025-02-0001",
            uacsObjectCode: "50102040-01",
            allotments: 168000.00,
            obligations: 0.00,
            unobligatedAllotments: 522502067.58,
            disbursements: 0.00,
            unpaidObligationsDueAndDemandable: 0.00,
            unpaidObligationsNotYetDue: 0.00
        }
    ];

    const columns = [
        { field: "date", header: "Date", width: "8%" },
        { field: "referenceDate", header: "Reference Date", width: "10%" },
        { field: "referenceSerialNumber", header: "Reference Serial No.", width: "12%" },
        { field: "uacsObjectCode", header: "UACS Object Code", width: "10%" },
        { field: "allotments", header: "Allotments", width: "10%", type: "number" },
        { field: "obligations", header: "Obligations", width: "10%", type: "number" },
        { field: "unobligatedAllotments", header: "Unobligated Allotments", width: "12%", type: "number" },
        { field: "disbursements", header: "Disbursements", width: "10%", type: "number" },
        { field: "unpaidObligationsDueAndDemandable", header: "Unpaid Obligations - Due and Demandable", width: "12%", type: "number" },
        { field: "unpaidObligationsNotYetDue", header: "Unpaid Obligations - Not Yet Due and Demandable", width: "12%", type: "number" }
    ];

    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Registry of Allotments, Obligations and Disbursements (RAOD)
                </Text>
                <Text style={styles.subtitle}>
                    As of 2025
                </Text>
            </View>

            <PDFTable columns={columns} data={data} />
        </PDFLandscape>
    );
};

export default React.memo(Raod);