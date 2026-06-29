import PDFLandscape from "@/components/Common/PDFs/PDFLandscape";
import PDFPortrait from "@/components/Common/PDFs/PDFPortrait";
import PDFTable from "@/components/Common/PDFs/PDFTable";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
    header: { marginBottom: 12 },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },

    BottomTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
        marginBottom:10
    },
    subtitle: {
        fontSize: 9,
        marginBottom: 12,
        textAlign: "center",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 8,
    },

    certBox: {
        borderWidth: 1,
        padding: 20,
        marginTop: 20,
        fontSize: 8,
    },

    signRow: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 8,
    },
    signature: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 40
    },

    sigBlock: {
        width: '45%',
    },

    sigTopLabel: {
        fontSize: 8,
        marginBottom: 5,
        textAlign: 'left',
    },

    sigLine: {
        width: '70%',
        alignSelf: 'center',
        borderBottom: "0.5pt solid #000",
        marginTop: 20,
    },

    sigPosition: {
        marginTop: 5,
        fontSize: 8,
        textAlign: 'center',
    },
});

const CashDisbursement = ({ pdfTitle }) => {
    const period = "July 2025";

    const columns = [
        { field: "date", header: "Date", width: "10%" },
        { field: "dv", header: "DV/Payroll No.", width: "12%" },
        { field: "ors", header: "ORS/BURS No.", width: "12%" },
        { field: "center", header: "Responsibility Center Code", width: "12%" },
        { field: "payee", header: "Payee", width: "20%" },
        { field: "uacs", header: "UACS Object Code", width: "10%" },
        { field: "nature", header: "Nature of Payment", width: "14%" },
        { field: "amount", header: "Amount", width: "10%" },
    ];

    const data = [
        {
            date: "07/15/2025",
            dv: "DV-2025-07-001",
            ors: "ORS-2025-001",
            center: "AS-GSO",
            payee: "MONOBUILD CONSTRUCTION, INC.",
            uacs: "50213010",
            nature: "Payment for Mobilization Fee",
            amount: "9,820,000.00",
        },
        {
            date: "07/16/2025",
            dv: "DV-2025-07-002",
            ors: "ORS-2025-002",
            center: "AS-GSO",
            payee: "OFFICE DEPOT PHILIPPINES",
            uacs: "50213010",
            nature: "Office Supplies and Materials",
            amount: "25,000.00",
        },
        {
            date: "07/17/2025",
            dv: "DV-2025-07-003",
            ors: "ORS-2025-003",
            center: "AS-GSO",
            payee: "PETRON CORPORATION",
            uacs: "50211010",
            nature: "Fuel and Oil Expenses",
            amount: "35,000.00",
        },
        {
            date: "07/18/2025",
            dv: "DV-2025-07-004",
            ors: "ORS-2025-004",
            center: "AS-GSO",
            payee: "MAKATI DEVELOPMENT CORPORATION",
            uacs: "50214010",
            nature: "IT Equipment and Software",
            amount: "1,250,000.00",
        },
        {
            date: "07/19/2025",
            dv: "DV-2025-07-005",
            ors: "ORS-2025-005",
            center: "AS-GSO",
            payee: "SHELL PHILIPPINES",
            uacs: "50211010",
            nature: "Vehicle Maintenance and Repairs",
            amount: "752,279.39",
        },
        {
            date: "",
            dv: "",
            ors: "",
            center: "",
            payee: "TOTAL:",
            uacs: "",
            nature: "",
            amount: "96,847,279.39",
        }
    ];

    return (
        <PDFPortrait pdfTitle={pdfTitle}>
            <View style={styles.header} fixed>
                <Text style={styles.title}>REPORT OF CASH DISBURSEMENTS</Text>
                <Text style={styles.subtitle}>Period Covered: {period}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text>Entity Name: Philippine Sports Commission</Text>
                <Text>Report No.: ___________</Text>
            </View>
            <View style={styles.infoRow}>
                <Text>Fund Cluster: ___________</Text>
                <Text>Sheet No.: ___________</Text>
            </View>

            <PDFTable columns={columns} data={data} />

            <View style={styles.certBox}>
                 <Text style={styles.BottomTitle}>CERTIFICATION</Text>
                <Text>
                    I hereby certify on my official oath that this Report of Cash Disbursements is a full, true and correct statement of all cash disbursements during the period stated above made by me in payment for obligations shown in pertinent disbursement voucher/payroll.
                </Text>
            </View>

            <View style={styles.signature}>
                <View style={styles.sigBlock}>

                </View>

                <View style={styles.sigBlock}>
                    <View style={styles.sigLine} />
                    <Text style={styles.sigPosition}>Name and Signature of Disbursing Officer/Cashier</Text>
                </View>
            </View>

            <View style={styles.signature}>
                <View style={styles.sigBlock}>
                    <View style={styles.sigLine} />
                    <Text style={styles.sigPosition}>Official Designation</Text>
                </View>

                <View style={styles.sigBlock}>
                    <View style={styles.sigLine} />
                    <Text style={styles.sigPosition}>Date</Text>
                </View>
            </View>
        </PDFPortrait>
    );
};

export default React.memo(CashDisbursement);
