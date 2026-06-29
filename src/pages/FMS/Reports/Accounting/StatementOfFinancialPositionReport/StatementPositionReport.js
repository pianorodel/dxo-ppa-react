import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
    header: {
        marginBottom: 10,
    },
    title: {
        fontSize: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 8,
        marginBottom: 15,
        textAlign: 'center',
    },
    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 6,
    },
    subgroup: {
        marginLeft: 10,
        marginBottom: 10,
    },
    subgroupTitle: {
        fontSize: 8,
        fontWeight: 600,
        marginBottom: 4,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        marginLeft: 10,
        marginBottom: 3,
    },
    subtotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        marginLeft: 10,
        marginTop: 4,
        borderTopWidth: 1,
        paddingTop: 3,
        marginBottom: 8,
    },
    sectionTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        marginTop: 6,
        borderTopWidth: 1,
        paddingTop: 4,
    },
    grandTotalsWrapper: {
        marginTop: 10,
        borderTopWidth: 1,
        paddingTop: 6,
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 5,
    },
    grandTotalBold: {
        fontWeight: 700,
    },
});

const StatementPositionReport = ({ pdfTitle }) => {

    const date = new Date();

    const formattedDate = date
        .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        .replace(",", "");

    const asOfText = `As of ${formattedDate}`;



    const totals = {
        "totalAssets": 23530000.00,
        "totalLiabilitiesAndEquity": 23180000.00
    }

    const body = [
        {
            "group": "Current Assets",
            "subgroups": [
                {
                    "title": "Cash",
                    "items": [
                        { "accountCode": "1-01-01-010", "accountName": "Cash on Hand", "amount": 150000.00 },
                        { "accountCode": "1-01-01-020", "accountName": "Cash in Bank - Local Currency", "amount": 2350000.00 }
                    ],
                    "total": 2500000.00
                },
                {
                    "title": "Receivables",
                    "items": [
                        { "accountCode": "1-01-02-010", "accountName": "Accounts Receivable", "amount": 450000.00 },
                        { "accountCode": "1-01-02-020", "accountName": "Due from NGAs", "amount": 300000.00 },
                        { "accountCode": "1-01-02-030", "accountName": "Due from GOCCs", "amount": 180000.00 }
                    ],
                    "total": 930000.00
                },
                {
                    "title": "Inventories",
                    "items": [
                        { "accountCode": "1-01-03-010", "accountName": "Office Supplies", "amount": 75000.00 },
                        { "accountCode": "1-01-03-020", "accountName": "Accountable Forms", "amount": 25000.00 }
                    ],
                    "total": 100000.00
                }
            ],
            "total": 3530000.00
        },

        {
            "group": "Non-Current Assets",
            "subgroups": [
                {
                    "title": "Investments",
                    "items": [
                        { "accountCode": "1-02-01-010", "accountName": "Long-term Investments", "amount": 5000000.00 }
                    ],
                    "total": 5000000.00
                },
                {
                    "title": "Ppe",
                    "items": [
                        { "accountCode": "1-02-02-010", "accountName": "Land", "amount": 8000000.00 },
                        { "accountCode": "1-02-02-020", "accountName": "Buildings", "amount": 5500000.00 },
                        { "accountCode": "1-02-02-030", "accountName": "Office Equipment", "amount": 850000.00 },
                        { "accountCode": "1-02-02-040", "accountName": "Vehicles", "amount": 650000.00 }
                    ],
                    "total": 15000000.00
                }
            ],
            "total": 20000000.00
        }
    ]



    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>
                    STATEMENT OF FINANCIAL POSITION REPORT
                </Text>
                <Text style={styles.subtitle}>
                    {asOfText}
                </Text>
            </View>
            <View >
                {body.map((section, sIndex) => (
                    <View key={sIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.group}</Text>
                        {section.subgroups.map((sub, subIndex) => (
                            <View key={subIndex} style={styles.subgroup}>
                                <Text style={styles.subgroupTitle}>{sub.title}</Text>
                                {sub.items.map((item, itemIndex) => (
                                    <View key={itemIndex} style={styles.itemRow}>
                                        <Text>
                                            {item.accountCode} — {item.accountName}
                                        </Text>
                                        <Text>{item.amount.toLocaleString()}</Text>
                                    </View>
                                ))}
                                <View style={styles.subtotalRow}>
                                    <Text style={{ fontWeight: 600 }}>Total {sub.title}</Text>
                                    <Text style={{ fontWeight: 600 }}>
                                        {sub.total.toLocaleString()}
                                    </Text>
                                </View>

                            </View>
                        ))}
                        <View style={styles.sectionTotal}>
                            <Text style={{ fontWeight: 700 }}>Total {section.group}</Text>
                            <Text style={{ fontWeight: 700 }}>
                                {section.total.toLocaleString()}
                            </Text>
                        </View>

                    </View>
                ))}
                <View style={styles.grandTotalsWrapper}>
                    <View style={styles.grandTotalRow}>
                        <Text style={styles.grandTotalBold}>TOTAL ASSETS</Text>
                        <Text style={styles.grandTotalBold}>
                            {totals.totalAssets.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.grandTotalRow}>
                        <Text style={styles.grandTotalBold}>TOTAL LIABILITIES AND EQUITY</Text>
                        <Text style={styles.grandTotalBold}>
                            {totals.totalLiabilitiesAndEquity.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>
        </PDFPortrait >
    )
}

export default React.memo(StatementPositionReport);