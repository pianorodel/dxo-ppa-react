import { Document, Page, StyleSheet } from "@react-pdf/renderer";

import React from "react";

import PDFFooter from "@/components/Common/PDFs/PDFFooter";
import PDFHeader from "@/components/Common/PDFs/PDFHeader";

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 7,
    fontFamily: "Helvetica",
  },
});

const MemoHeader = React.memo(PDFHeader);
const MemoFooter = React.memo(PDFFooter);

const PDFLandscape = React.memo(({ Header = MemoHeader, Footer = MemoFooter, size = [1123.2, 794.16], children, pdfTitle }) => (
  <Document title={pdfTitle}>
    <Page size={size} style={styles.page}>
      <Header />
      {children}
      <Footer />
    </Page>
  </Document>
));

export default PDFLandscape;
