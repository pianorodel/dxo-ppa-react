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
        lineHeight: 1.5,
        fontSize: 8,
    },
});

const ObligationsPDF = ({ pdfTitle }) => {

    const columns = [
        { field: "responsibilityCenter", header: "Responsibility Center", width: "25%" },
        { field: "particulars", header: "Particulars", width: "20%" },
        { field: "mopPap", header: "MFO/PAP", width: "15%" },
        { field: "uacs", header: " UACS Object Code", width: "25%" },
        { field: "amount", header: "Amount", width: "15%" }
    ];

    const data = [
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
        { responsibilityCenter: "001", particulars: "Payment for the Flood Control Program for the rehabilitation of EDSA", mopPap: "1000000000", uacs: "1000000000", amount: "10,000,000.00" },
    ]

    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>
                    OBLIGATION REQUEST AND STATUS
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.subtitle}>
                        Entity Name:
                    </Text>
                    <View>
                        <Text style={styles.subtitle}>
                            Serial No.: OBL-2025-001
                        </Text>
                        <Text style={styles.subtitle}>
                            Date:
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.subtitle}>
                        Payee: DANYSONS CONSTRUCTION AND DEVELOPMENT CORPORATION
                    </Text>
                    <Text style={styles.subtitle}>
                        Office:
                    </Text>
                    <Text style={styles.subtitle}>
                        Address:
                    </Text>
                </View>
            </View>

            <PDFTable columns={columns} data={data} />

            <View style={{ display: 'flex', flexDirection: 'row', gap: 30, marginTop: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.subtitle}>
                        A. Certified:
                        Changes to appropriation/Allotment are necessary,
                        lawful and under my direct supervision, and
                        supporting documents valid, proper and legal
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.subtitle}>
                            Signature:
                        </Text>
                        <Text style={styles.subtitle}>
                            Printed Name:
                        </Text>
                        <Text style={styles.subtitle}>
                            Position:
                        </Text>
                        <Text style={styles.subtitle}>
                            Date:
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.subtitle}>
                        B. Certified:
                        Allotment available and obligated for the
                        purpose/adjustment necessary as indicated above
                    </Text>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.subtitle}>
                            Signature:
                        </Text>
                        <Text style={styles.subtitle}>
                            Printed Name:
                        </Text>
                        <Text style={styles.subtitle}>
                            Position:
                        </Text>
                        <Text style={styles.subtitle}>
                            Date:
                        </Text>
                    </View>
                </View>
            </View>
        </PDFPortrait>
    )
}

export default React.memo(ObligationsPDF);