import socotecLogo from "@/assets/images/Socotec.png";
import { Image, Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const footerStyles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTop: '0.5pt solid #000',
        fontSize: 9,
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
    },
    link: {
        color: '#0066cc',
        textDecoration: 'underline',
    },
    certificationLogo: {
        width: 90,
        height: 50,
    },
    certificationText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0066cc',
    },
});

const PDFFooter = React.memo(({
    addressLine1 = process.env.REACT_APP_CUSTOMER_REPORT_FOOTER_ADDRESS_LINE_1,
    addressLine2 = process.env.REACT_APP_CUSTOMER_REPORT_FOOTER_ADDRESS_LINE_2,
    websiteLabel = process.env.REACT_APP_CUSTOMER_REPORT_FOOTER_WEBSITE_LABEL,
    websiteUrl = process.env.REACT_APP_CUSTOMER_REPORT_FOOTER_WEBSITE_URL,
    contactNo = process.env.REACT_APP_CUSTOMER_REPORT_FOOTER_CONTACT_NO,
    certificationLogo = socotecLogo,
}) => (
    <View style={footerStyles.footerContainer} fixed>
        <View>
            <Text>{addressLine1}</Text>
            <Text>{addressLine2}</Text>
            <Text>
                {websiteLabel} <Link src={websiteUrl} style={footerStyles.link}>{websiteUrl}</Link>
            </Text>
            <Text>{contactNo}</Text>
        </View>

        <View>
            {certificationLogo && (
                <Image src={certificationLogo} style={footerStyles.certificationLogo} />
            )}
        </View>
    </View>
));

export default PDFFooter;
