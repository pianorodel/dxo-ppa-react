import PDFLandscape from '@/components/Common/PDFs/PDFLandscape';
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
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 10,
        textAlign: 'left'
    },
    container: {
        padding: 20

    }, page: {
        padding: 30,
        fontSize: 8,
    },
    table: {
        marginTop: 4,
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 0.7,
        borderColor: '#dcdcdc',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        borderStyle: 'solid',
        borderWidth: 0.7,
        borderColor: '#dcdcdc',
        backgroundColor: '#fafafa',
        padding: 4,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#dcdcdc',
        padding: 4,
        textAlign: 'center',
    },
    col1: { width: '8%' },
    col2: { width: '6%' },
    col3: { width: '6%' },
    col4: { width: '4%' },
    col5: { width: '16%' },
    col6: { width: '4%' },
    col7: { width: '16%' },
    col8: { width: '4%' },
    col9: { width: '16%' },
    col10: { width: '4%' },
    col11: { width: '16%' },
    subHeader: {
        fontSize: 7,
        padding: 2,
    },
    mainHeader: {
        fontSize: 8,
        fontWeight: 'bold',
    },

});

const data = [
    {
        nameOfForm: '',
        number: '',
        faceValue: 'CHECK',
        beginningQty: '1237',
        beginningFrom: '1083110',
        beginningTo: '1081873',
        receiptQty: '1553',
        receiptFrom: '1072160',
        receiptTo: '1073900',
        issuanceQty: '188',
        issuanceFrom: '1072160',
        issuanceTo: '1072347',
        endingQty: '1553',
        endingFrom: '1072348',
        endingTo: '1073900',
    },
];

const AccountabilityReport = ({ pdfTitle }) => {
    return (
        <PDFLandscape pdfTitle={pdfTitle}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>REPORT OF ACCOUNTABILITY FOR ACCOUNTABLE FORMS</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontSize: 10, }}>

                    <Text style={{ width: '33%', textAlign: 'left' }}>
                        Period:
                    </Text>


                    <Text style={{ width: '33%', textAlign: 'center' }}>
                        Fund:
                    </Text>


                    <Text style={{ width: '33%' }}></Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, styles.col1, styles.col2, styles.col3, { width: '20%' }]}>
                            <Text style={styles.mainHeader}>ACCOUNTABLE FORMS</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '20%' }]}>
                            <Text style={styles.mainHeader}>BEGINNING BALANCE</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '20%' }]}>
                            <Text style={styles.mainHeader}>RECEIPT</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '20%' }]}>
                            <Text style={styles.mainHeader}>ISSUANCE</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '20%' }]}>
                            <Text style={styles.mainHeader}>ENDING BALANCE</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, styles.col1]}>
                            <Text style={styles.subHeader}>NAME OF FORM</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col2]}>
                            <Text style={styles.subHeader}>NUMBER</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col3]}>
                            <Text style={styles.subHeader}>FACE VALUE</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}>
                            <Text style={styles.subHeader}>QTY.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col5]}>
                            <Text style={styles.subHeader}>INCLUSIVE SERIAL NOS.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}>
                            <Text style={styles.subHeader}>QTY.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col7]}>
                            <Text style={styles.subHeader}>INCLUSIVE SERIAL NOS.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}>
                            <Text style={styles.subHeader}>QTY.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col9]}>
                            <Text style={styles.subHeader}>INCLUSIVE SERIAL NOS.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}>
                            <Text style={styles.subHeader}>QTY.</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col11]}>
                            <Text style={styles.subHeader}>INCLUSIVE SERIAL NOS.</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={[styles.tableColHeader, styles.col1]}></View>
                        <View style={[styles.tableColHeader, styles.col2]}></View>
                        <View style={[styles.tableColHeader, styles.col3]}></View>
                        <View style={[styles.tableColHeader, styles.col4]}></View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>FROM</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>TO</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}></View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>FROM</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>TO</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}></View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>FROM</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>TO</Text>
                        </View>
                        <View style={[styles.tableColHeader, styles.col4]}></View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>FROM</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <Text style={styles.subHeader}>TO</Text>
                        </View>
                    </View>

                    {data.map((row, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.col1]}>
                                <Text>{row.nameOfForm}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col2]}>
                                <Text>{row.number}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col3]}>
                                <Text>{row.faceValue}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col4]}>
                                <Text>{row.beginningQty}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.beginningFrom}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.beginningTo}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col4]}>
                                <Text>{row.receiptQty}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.receiptFrom}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.receiptTo}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col4]}>
                                <Text>{row.issuanceQty}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.issuanceFrom}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.issuanceTo}</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col4]}>
                                <Text>{row.endingQty}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.endingFrom}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text>{row.endingTo}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={{ fontSize: 10, marginTop: 20, textAlign: 'center', fontWeight: 'bold', }}>
                    CERTIFICATION
                </Text>
                <Text style={{ fontSize: 8, marginTop: 20, textAlign: 'center' }}>
                    I hereby certify that the foregoing is a true statement of all accountable forms received, issued and transferred by me during the period above-stated and that the beginning and ending balances are correct.
                </Text>

                <View style={{ marginTop: 40, alignItems: 'flex-end' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 9 }}>_______________________________</Text>
                        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 4 }}>JUAN DELA CRUZ</Text>
                        <Text style={{ fontSize: 8, textAlign: 'center' }}>Administrative Officer V</Text>
                    </View>
                </View>
            </View>
        </PDFLandscape>
    );
};

export default React.memo(AccountabilityReport);
