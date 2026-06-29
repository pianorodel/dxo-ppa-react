import PDFFooter from '@/components/Common/PDFs/PDFFooter';
import PDFHeader from '@/components/Common/PDFs/PDFHeader';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 100,
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
});

const MemoHeader = React.memo(PDFHeader);
const MemoFooter = React.memo(PDFFooter);

const PDFPortrait = React.memo(({
    Header = MemoHeader,
    Footer = MemoFooter,
    size = 'A4',
    orientation = 'portrait',
    children,
    pdfTitle,
}) => (
    <Document title={pdfTitle}>
        <Page size={size} orientation={orientation} style={styles.page}>
            <Header />
            {children}
            <Footer />
        </Page>
    </Document>
));

export default PDFPortrait;
