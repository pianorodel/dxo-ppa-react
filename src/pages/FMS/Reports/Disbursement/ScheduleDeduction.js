import PDFLandscape from '@/components/Common/PDFs/PDFLandscape';
import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import PDFTable from '@/components/Common/PDFs/PDFTable';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({

    header: {
        marginBottom: 15,
        fontSize: 10,
    },
    title: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    page: {
        padding: 20,
        fontSize: 8,
    },
    table: {
        display: 'table',
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#dcdcdc',
        borderStyle: 'solid',
    },
    row: {
        flexDirection: 'row',

    },
    cell: {
        fontSize: 8,
        borderRightWidth: 0.5,
        borderRightColor: '#dcdcdc',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dcdcdc',
        padding: 3,
    },
    tableheader: {
        backgroundColor: '#fafafa',
        fontWeight: 'bold',
    },
    center: {
        textAlign: 'center',
    },
});

const sampleData = [
    {
        dvNo: "2025-06-0001",
        payee: "DELA CRUZ, JUAN P.",
        gross: 125000,
        bir: 25000,
        gsis: 15000,
        phic: 5000,
        hdmf: 5000,
        net: 75000
    },
    {
        dvNo: "2025-06-0002",
        payee: "SANTOS, MARIA C.",
        gross: 85000,
        bir: 17000,
        gsis: 10200,
        phic: 3400,
        hdmf: 3400,
        net: 51000
    },
    {
        dvNo: "2025-06-0003",
        payee: "REYES, ANTONIO M.",
        gross: 95000,
        bir: 19000,
        gsis: 11400,
        phic: 3800,
        hdmf: 3800,
        net: 57000
    },
    {
        dvNo: "2025-06-0004",
        payee: "GARCIA, ELENA R.",
        gross: 78000,
        bir: 15600,
        gsis: 9360,
        phic: 3120,
        hdmf: 3120,
        net: 46800
    },
    {
        dvNo: "2025-06-0005",
        payee: "CRUZ, ROBERTO L.",
        gross: 110000,
        bir: 22000,
        gsis: 13200,
        phic: 4400,
        hdmf: 4400,
        net: 66000
    }
];

const totals = {
    gross: sampleData.reduce((a, b) => a + b.gross, 0),
    bir: sampleData.reduce((a, b) => a + b.bir, 0),
    gsis: sampleData.reduce((a, b) => a + b.gsis, 0),
    phic: sampleData.reduce((a, b) => a + b.phic, 0),
    hdmf: sampleData.reduce((a, b) => a + b.hdmf, 0),
    net: sampleData.reduce((a, b) => a + b.net, 0),
};

const ScheduleDeduction = ({ pdfTitle }) => {

    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Schedule Of Deduction
                </Text>
            </View>

            <View style={styles.table}>

                <View style={[styles.row, styles.tableheader]}>
                    <Text style={[styles.cell, { width: '16%' }]}>DV No.</Text>
                    <Text style={[styles.cell, { width: '24%' }]}>Payee</Text>
                    <Text style={[styles.cell, { width: '12%' }]}>Gross Amount</Text>
                    <Text
                        style={[
                            styles.cell,
                            {
                                width: '36%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center'
                            }
                        ]}
                    >
                        Deductions
                    </Text>
                    <Text style={[styles.cell, { width: '12%' }]}>Net Amount</Text>
                </View>

                <View style={[styles.row, styles.tableheader]}>
                    <Text style={[styles.cell, { width: '12%' }]}></Text>
                    <Text style={[styles.cell, { width: '28%' }]}></Text>
                    <Text style={[styles.cell, { width: '12%' }]}></Text>

                    <Text style={[styles.cell, { width: '9%' }]}>BIR</Text>
                    <Text style={[styles.cell, { width: '9%' }]}>GSIS</Text>
                    <Text style={[styles.cell, { width: '9%' }]}>PHIC</Text>
                    <Text style={[styles.cell, { width: '9%' }]}>HDMF</Text>

                    <Text style={[styles.cell, { width: '12%' }]}></Text>
                </View>

                {sampleData.map((row, i) => (
                    <View style={styles.row} key={i}>
                        <Text style={[styles.cell, { width: '12%' }]}>{row.dvNo}</Text>
                        <Text style={[styles.cell, { width: '28%' }]}>{row.payee}</Text>
                        <Text style={[styles.cell, { width: '12%', textAlign: 'right' }]}>{row.gross.toLocaleString()}</Text>

                        <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{row.bir.toLocaleString()}</Text>
                        <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{row.gsis.toLocaleString()}</Text>
                        <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{row.phic.toLocaleString()}</Text>
                        <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{row.hdmf.toLocaleString()}</Text>

                        <Text style={[styles.cell, { width: '12%', textAlign: 'right' }]}>{row.net.toLocaleString()}</Text>
                    </View>
                ))}

                <View style={[styles.row, styles.header]}>
                    <Text style={[styles.cell, { width: '40%' }]}>Total</Text>
                    <Text style={[styles.cell, { width: '12%', textAlign: 'right' }]}>{totals.gross.toLocaleString()}</Text>

                    <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{totals.bir.toLocaleString()}</Text>
                    <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{totals.gsis.toLocaleString()}</Text>
                    <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{totals.phic.toLocaleString()}</Text>
                    <Text style={[styles.cell, { width: '9%', textAlign: 'right' }]}>{totals.hdmf.toLocaleString()}</Text>

                    <Text style={[styles.cell, { width: '12%', textAlign: 'right' }]}>{totals.net.toLocaleString()}</Text>
                </View>

            </View>
        </PDFPortrait>
    );
};

export default React.memo(ScheduleDeduction);