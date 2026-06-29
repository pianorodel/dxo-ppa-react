import React from "react";

import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

const leftLogo = require(`@/${process.env.REACT_APP_CUSTOMER_REPORT_LEFT_LOGO}`);
const rightLogo = require(`@/${process.env.REACT_APP_CUSTOMER_REPORT_RIGHT_LOGO}`);

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "0.5pt solid #000",
  },
  logoLeft: { width: 70, height: 60 },
  logoRight: { width: 80, height: 80 },
  centerContent: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  documentCode: {
    position: "absolute",
    top: 0,
    right: 70,
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
  mainTitle: { fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 3 },
  subtitle: { fontSize: 10, textAlign: "center", marginBottom: 2 },
  organizationName: { fontSize: 12, fontWeight: "bold", textAlign: "center", marginBottom: 3 },
  tagalogText: { fontSize: 9, textAlign: "center", fontStyle: "italic", marginBottom: 3 },
  certification: { fontSize: 10, fontWeight: "bold", textAlign: "center" },
});

const PDFHeader = React.memo(({
  documentCode = "",
  line1 = process.env.REACT_APP_CUSTOMER_REPORT_HEADER_LINE_1,
  line2 = process.env.REACT_APP_CUSTOMER_REPORT_HEADER_LINE_2,
  line3 = process.env.REACT_APP_CUSTOMER_REPORT_HEADER_LINE_3,
  line4 = process.env.REACT_APP_CUSTOMER_REPORT_HEADER_LINE_4,
  line5 = process.env.REACT_APP_CUSTOMER_REPORT_HEADER_LINE_5,
}) => (
  <View style={headerStyles.headerContainer} fixed>
    <Text style={headerStyles.documentCode}>{documentCode}</Text>

    <Image src={leftLogo} style={headerStyles.logoLeft} />

    <View style={headerStyles.centerContent}>
      <Text style={headerStyles.mainTitle}>{line1}</Text>
      <Text style={headerStyles.subtitle}>{line2}</Text>
      <Text style={headerStyles.organizationName}>{line3}</Text>
      <Text style={headerStyles.tagalogText}>{line4}</Text>
      <Text style={headerStyles.certification}>{line5}</Text>
    </View>

    <Image src={rightLogo} style={headerStyles.logoRight} />
  </View>
));

export default PDFHeader;
