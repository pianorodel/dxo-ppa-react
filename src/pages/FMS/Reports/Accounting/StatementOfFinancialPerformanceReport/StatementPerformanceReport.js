import PDFPortrait from '@/components/Common/PDFs/PDFPortrait';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
    header: { marginBottom: 10 },
    title: {
        fontSize: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: { fontSize: 8, marginBottom: 15, textAlign: 'center' },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 9, fontWeight: 700, marginBottom: 6 },
    subgroup: { marginLeft: 10, marginBottom: 10 },
    subgroupTitle: { fontSize: 8, fontWeight: 600, marginBottom: 4 },
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
    grandTotalsWrapper: { marginTop: 10, borderTopWidth: 1, paddingTop: 6 },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 5,
    },
    grandTotalBold: { fontWeight: 700 },
});

const StatementReport = ({ pdfTitle }) => {

    const date = new Date();
    const formattedDate = date
        .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        .replace(",", "");

    const asOfText = `As of ${formattedDate}`;

    const body = [
        {
            group: "Revenue",
            subgroups: [
                {
                    title: "Service Income",
                    items: [
                        { accountName: "Traffic Violation Fees", amount: 250733196.43 },
                        { accountName: "Parking Fees", amount: 125000000.00 },
                        { accountName: "Environmental Fees", amount: 180000000.00 },
                        { accountName: "Permit And License Fees", amount: 210000000.00 }
                    ],
                    total: 765733196.43
                },
                {
                    title: "Business Income",
                    items: [
                        { accountName: "Stall Rentals", amount: 85000000.00 },
                        { accountName: "Advertising Space", amount: 95000000.00 },
                        { accountName: "Waste Mgmt Services", amount: 75000000.00 }
                    ],
                    total: 255000000.00
                }
            ],
            total: 1020733196.43
        },

        {
            group: "Personnel Services",
            subgroups: [
                {
                    title: "Salaries and Wages",
                    items: [
                        { accountName: "Regular", amount: 2570281400.41 },
                        { accountName: "Casual", amount: 312000000.00 }
                    ],
                    total: 2882281400.41
                },
                {
                    title: "Other Compensation",
                    items: [
                        { accountName: "PERA", amount: 87208733.13 },
                        { accountName: "RA", amount: 60875688.75 },
                        { accountName: "TA", amount: 51268768.75 },
                        { accountName: "SUBSISTENCE", amount: 58700.00 },
                        { accountName: "LAUNDRY", amount: 12150.00 },
                        { accountName: "HAZARDPAY", amount: 752279.39 },
                        { accountName: "OVERTIME", amount: 365784.77 },
                        { accountName: "MIDYEARBONUS", amount: 531885750.00 }
                    ],
                    total: 732227854.79
                },
                {
                    title: "Personnel Benefits",
                    items: [
                        { accountName: "Pagibig", amount: 8563400.00 },
                        { accountName: "Philhealth", amount: 63335420.27 },
                        { accountName: "Ecip", amount: 4358600.00 },
                        { accountName: "Pension Benefits", amount: 26570636.00 },
                        { accountName: "Retirement Gratuity", amount: 15194140.00 },
                        { accountName: "Terminal Leave", amount: 161381297.28 },
                        { accountName: "Other Benefits", amount: 235716098.34 }
                    ],
                    total: 515771690.28
                }
            ],
            total: 4130080864.48
        },

        {
            group: "Maintenance and Other Operating Expenses",
            subgroups: [
                {
                    title: "Traveling",
                    items: [
                        { accountName: "Local", amount: 6969255.46 },
                        { accountName: "Foreign", amount: 774862.00 }
                    ],
                    total: 7744117.46
                },
                {
                    title: "Supplies",
                    items: [
                        { accountName: "Office", amount: 25637814.30 },
                        { accountName: "Accountable", amount: 8500000.00 },
                        { accountName: "Fuel", amount: 35000000.00 }
                    ],
                    total: 69137814.30
                }
            ],
            total: 515571609.28
        }
    ];


    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>
                    STATEMENT OF FINANCIAL PERFORMANCE REPORT
                </Text>
                <Text style={styles.subtitle}>{asOfText}</Text>
            </View>

            <View>
                {body.map((section, sIndex) => (
                    <View key={sIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.group}</Text>

                        {section.subgroups.map((sub, subIndex) => (
                            <View key={subIndex} style={styles.subgroup}>
                                <Text style={styles.subgroupTitle}>{sub.title}</Text>

                                {sub.items.map((item, itemIndex) => (
                                    <View key={itemIndex} style={styles.itemRow}>
                                        <Text>{item.accountName}</Text>
                                        <Text>{item.amount.toLocaleString()}</Text>
                                    </View>
                                ))}

                                <View style={styles.subtotalRow}>
                                    <Text>Total {sub.title}</Text>
                                    <Text>{sub.total.toLocaleString()}</Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.sectionTotal}>
                            <Text style={{ fontWeight: 700 }}>
                                Total {section.group}
                            </Text>
                            <Text style={{ fontWeight: 700 }}>
                                {section.total.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </PDFPortrait>
    );
};

export default React.memo(StatementReport);
