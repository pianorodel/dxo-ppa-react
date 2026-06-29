import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import * as moment from "moment";

import PDFPortrait from "@/components/Common/PDFs/PDFPortrait";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPeso(n) {
    return "\u20B1" + new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(n || 0);
}
function fmtDate(d) {
    if (!d) return "\u2014";
    return moment(new Date(d)).format("DD MMMM YYYY");
}
function toWords(n) {
    if (!n || n === 0) return "Zero Pesos Only";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function chunk(num) {
        if (num === 0) return "";
        if (num < 20) return ones[num] + " ";
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "") + " ";
        return ones[Math.floor(num / 100)] + " Hundred " + chunk(num % 100);
    }
    const pesos = Math.floor(n);
    const centavos = Math.round((n - pesos) * 100);
    let result = "";
    if (pesos >= 1000000) result += chunk(Math.floor(pesos / 1000000)) + "Million ";
    if (pesos >= 1000) result += chunk(Math.floor((pesos % 1000000) / 1000)) + "Thousand ";
    result += chunk(pesos % 1000);
    result = result.trim() + " Pesos";
    if (centavos > 0) result += " and " + chunk(centavos).trim() + " Centavos";
    return result + " Only";
}

var FUND_CLUSTERS = {
    "01": "Regular Agency Fund",
    "02": "Foreign-Assisted Projects Fund",
    "03": "Special Account in the General Fund",
    "04": "Internally Generated Funds",
    "05": "Business-Related Funds",
};
var UACS_OBJECTS = {
    "5-02-01-010": "Traveling Expenses \u2013 Local",
    "5-02-01-020": "Traveling Expenses \u2013 Foreign",
    "5-02-02-010": "Training Expenses",
    "5-02-03-010": "Office Supplies Expense",
    "5-02-03-090": "Other Supplies and Materials Expenses",
    "5-02-12-010": "Other Maintenance and Operating Expenses",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const BORDER = "0.5pt solid #000";
const FONT_SM = 7;
const FONT_MD = 8;
const PAD = 3;

const styles = StyleSheet.create({
    docTitle:    { fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 1 },
    docSubtitle: { fontSize: FONT_MD, textAlign: "center", marginBottom: 4 },

    refBar: {
        flexDirection: "row", border: BORDER, marginBottom: 5,
    },
    refCell: {
        flex: 1, padding: PAD, fontSize: FONT_MD, fontWeight: "bold", textAlign: "center",
    },
    refDivider: { borderRight: BORDER },

    sectionLabel: {
        fontSize: FONT_MD, fontWeight: "bold", backgroundColor: "#d9d9d9",
        border: BORDER, padding: PAD, marginBottom: 0,
    },

    table:    { width: "100%", borderLeft: BORDER, borderTop: BORDER, marginBottom: 5 },
    row:      { flexDirection: "row" },
    cell:     { borderRight: BORDER, borderBottom: BORDER, fontSize: FONT_SM, padding: PAD },
    cellGray: { backgroundColor: "#f2f2f2" },
    cellDark: { backgroundColor: "#d9d9d9" },
    cellBold: { fontWeight: "bold" },

    commentBox: {
        border: BORDER, minHeight: 28, padding: PAD,
        fontSize: FONT_SM, marginBottom: 5, color: "#555", fontStyle: "italic",
    },

    pageFooter: {
        flexDirection: "row", justifyContent: "space-between",
        marginTop: 6, fontSize: FONT_SM - 1, color: "#444",
    },
});

// ─── Primitives (same pattern as GlobalBasedReviewFormPDF) ────────────────────
const CT = ({ children, style }) => <View style={[styles.cell, style]}>{children}</View>;
const CText = ({ children, bold, center, italic, style }) => (
    <Text style={[bold && { fontWeight: "bold" }, center && { textAlign: "center" }, italic && { fontStyle: "italic" }, style]}>
        {children}
    </Text>
);
const SectionLabel = ({ children }) => <Text style={styles.sectionLabel}>{children}</Text>;

// ─── Document component ───────────────────────────────────────────────────────
const CashAdvanceRCAPDF = ({ pdfTitle, data = {} }) => {
    const {
        refNo        = "\u2014",
        date         = null,
        accountable  = "\u2014",
        position     = "\u2014",
        department   = "\u2014",
        fundCluster  = "\u2014",
        purpose      = "\u2014",
        destination  = "\u2014",
        travelDates  = "\u2014",
        uacsObject   = "\u2014",
        dvRefNo      = null,
        orNo         = null,
        amount       = 0,
        liquidated   = 0,
        status       = "\u2014",
        remarks      = "",
        modifiedDate = null,
        modifiedBy   = "\u2014",
    } = data;

    const today    = fmtDate(new Date().toISOString());
    const balance  = amount - liquidated;
    const liqPct   = amount > 0 ? Math.round((liquidated / amount) * 100) : 0;

    const fundLabel = FUND_CLUSTERS[fundCluster]
        ? fundCluster + " \u2014 " + FUND_CLUSTERS[fundCluster]
        : fundCluster;
    const uacsLabel = UACS_OBJECTS[uacsObject]
        ? uacsObject + "  (" + UACS_OBJECTS[uacsObject] + ")"
        : uacsObject;

    return (
        <PDFPortrait pdfTitle={pdfTitle || "Report of Cash Advance"}>

            {/* Title */}
            <Text style={styles.docTitle}>REPORT OF CASH ADVANCE (RCA)</Text>
            <Text style={styles.docSubtitle}>In accordance with COA Circular No. 97-002 and applicable accounting rules</Text>

            {/* Reference bar */}
            <View style={styles.refBar}>
                <View style={[styles.refCell, styles.refDivider]}>
                    <Text>REFERENCE NO.: {refNo}</Text>
                </View>
                <View style={[styles.refCell, styles.refDivider]}>
                    <Text>DATE: {fmtDate(date)}</Text>
                </View>
                <View style={styles.refCell}>
                    <Text>STATUS: {status.toUpperCase()}</Text>
                </View>
            </View>

            {/* Part I — Accountable Officer */}
            <SectionLabel>PART I \u2013 ACCOUNTABLE OFFICER INFORMATION</SectionLabel>
            <View style={styles.table}>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray, styles.cellBold]}>
                        <CText bold>Name of Officer:</CText>
                    </CT>
                    <CT style={[{ width: "30%" }, styles.cellBold]}>
                        <CText bold>{accountable}</CText>
                    </CT>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Position / Title:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{position}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Office / Division:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{department}</CText>
                    </CT>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Fund Cluster:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{fundLabel}</CText>
                    </CT>
                </View>
            </View>

            {/* Part II — CA Details */}
            <SectionLabel>PART II \u2013 CASH ADVANCE DETAILS</SectionLabel>
            <View style={styles.table}>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Purpose:</CText>
                    </CT>
                    <CT style={{ width: "80%" }}>
                        <CText>{purpose}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Destination / Activity:</CText>
                    </CT>
                    <CT style={{ width: "80%" }}>
                        <CText>{destination}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Travel / Activity Dates:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{travelDates}</CText>
                    </CT>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Date of CA:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{fmtDate(date)}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>UACS Object Code:</CText>
                    </CT>
                    <CT style={{ width: "80%" }}>
                        <CText>{uacsLabel}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>DV Reference No.:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{dvRefNo || "\u2014"}</CText>
                    </CT>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>OR Number:</CText>
                    </CT>
                    <CT style={{ width: "30%" }}>
                        <CText>{orNo || "\u2014"}</CText>
                    </CT>
                </View>
                <View style={styles.row}>
                    <CT style={[{ width: "20%" }, styles.cellGray]}>
                        <CText bold>Last Modified:</CText>
                    </CT>
                    <CT style={{ width: "80%" }}>
                        <CText>{fmtDate(modifiedDate)} by {modifiedBy}</CText>
                    </CT>
                </View>
            </View>

            {/* Part III — Financial Summary */}
            <View wrap={false}>
                <SectionLabel>PART III \u2013 FINANCIAL SUMMARY</SectionLabel>
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.row}>
                        <CT style={[{ width: "44%" }, styles.cellGray, styles.cellBold]}>
                            <CText bold center>Particulars</CText>
                        </CT>
                        <CT style={[{ width: "24%" }, styles.cellGray]}>
                            <CText bold center>Amount (\u20B1)</CText>
                        </CT>
                        <CT style={[{ width: "32%" }, styles.cellGray]}>
                            <CText bold center>Remarks</CText>
                        </CT>
                    </View>
                    {/* Rows */}
                    {[
                        {
                            label:  "Amount Granted",
                            value:  fmtPeso(amount),
                            remark: "As per DV " + (dvRefNo || "\u2014"),
                            highlight: false,
                        },
                        {
                            label:  "Amount Liquidated",
                            value:  fmtPeso(liquidated),
                            remark: orNo ? "OR No. " + orNo : liqPct > 0 ? "Partially liquidated" : "Pending liquidation",
                            highlight: false,
                        },
                        {
                            label:  "Unliquidated Balance",
                            value:  fmtPeso(balance),
                            remark: balance === 0 ? "Fully liquidated \u2014 no refund due" : "Subject to liquidation within prescribed period",
                            highlight: true,
                        },
                    ].map((r, i) => (
                        <View key={i} style={[styles.row, r.highlight ? { backgroundColor: "#fffde7" } : {}]}>
                            <CT style={[{ width: "44%" }, r.highlight ? styles.cellBold : {}]}>
                                <CText bold={r.highlight}>{r.label}</CText>
                            </CT>
                            <CT style={[{ width: "24%", textAlign: "right" }, r.highlight ? styles.cellBold : {}]}>
                                <CText bold={r.highlight} center>{r.value}</CText>
                            </CT>
                            <CT style={[{ width: "32%", fontSize: FONT_SM - 0.5 }]}>
                                <CText italic>{r.remark}</CText>
                            </CT>
                        </View>
                    ))}
                    {/* Amount in words */}
                    <View style={[styles.row, { backgroundColor: "#f5f5f5" }]}>
                        <CT style={[{ width: "44%" }, styles.cellGray]}>
                            <CText bold>Amount in Words:</CText>
                        </CT>
                        <CT style={[{ width: "56%", fontSize: FONT_SM - 0.5 }]}>
                            <CText italic>{toWords(amount)}</CText>
                        </CT>
                    </View>
                </View>

                {/* Liquidation progress bar */}
                <View style={{ marginBottom: 5 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ fontSize: FONT_SM, fontWeight: "bold" }}>Liquidation Progress</Text>
                        <Text style={{ fontSize: FONT_SM, color: liqPct === 100 ? "#0ab39c" : "#b8860b" }}>
                            {liqPct}% liquidated
                        </Text>
                    </View>
                    <View style={{ height: 7, backgroundColor: "#e0e0e0", border: "0.5pt solid #bbb" }}>
                        <View style={{
                            height: "100%",
                            width: liqPct + "%",
                            backgroundColor: liqPct === 100 ? "#0ab39c" : "#f7b84b",
                        }} />
                    </View>
                </View>
            </View>

            {/* Part IV — Remarks (conditional) */}
            {remarks ? (
                <View wrap={false}>
                    <SectionLabel>PART IV \u2013 REMARKS</SectionLabel>
                    <View style={[styles.commentBox]}>
                        <Text>{remarks}</Text>
                    </View>
                </View>
            ) : null}

            {/* Signatures */}
            <View wrap={false}>
                <SectionLabel>PART {remarks ? "V" : "IV"} \u2013 CERTIFICATIONS &amp; SIGNATURES</SectionLabel>
                <View style={[styles.table, { marginBottom: 8 }]}>
                    <View style={styles.row}>
                        {[
                            { name: accountable,          role: "Accountable Officer / Claimant" },
                            { name: "Immediate Supervisor", role: "Certifying Officer" },
                            { name: "Head of Accounting Unit", role: "Chief Accountant / Approving Authority" },
                        ].map((sig, i) => (
                            <View key={i} style={[styles.cell, { flex: 1, minHeight: 50, textAlign: "center" }]}>
                                <View style={{ borderBottom: "1px solid #000", width: "100%", marginTop: 15 }} />
                                <CText bold>{sig.name}</CText>
                                <CText style={{ fontSize: FONT_SM, color: "#444" }}>{sig.role}</CText>
                                <Text style={{ fontSize: FONT_SM, marginTop: 8 }}>Date: _______________</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* COA notice */}
            <View wrap={false} style={[styles.commentBox, { borderColor: "#f0c040", backgroundColor: "#fff8e1", marginTop: 2 }]}>
                <Text style={{ fontSize: FONT_SM, fontWeight: "bold", color: "#8a6000", marginBottom: 2 }}>
                    COA Reminder (Circular No. 97-002):
                </Text>
                <Text style={{ fontSize: FONT_SM - 0.5, color: "#555", lineHeight: 1.4 }}>
                    This cash advance must be liquidated within the prescribed period. A new cash advance shall not be granted unless the previous advance has been fully liquidated and accounts duly settled. Any unexpended balance must be immediately refunded to the Cashier.
                </Text>
            </View>

            {/* Page footer */}
            <View style={styles.pageFooter} fixed>
                <Text>RCA \u2014 {accountable} \u2014 {department} \u2014 {refNo}</Text>
                <Text render={({ pageNumber, totalPages }) =>
                    `FMS \u00b7 Generated: ${today} \u00b7 Page ${pageNumber} of ${totalPages}`
                } />
            </View>

        </PDFPortrait>
    );
};

export default React.memo(CashAdvanceRCAPDF);