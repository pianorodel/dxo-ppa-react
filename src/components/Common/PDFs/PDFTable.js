import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#dcdcdc',
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
        paddingVertical: 6,
        minHeight: 25,
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        minHeight: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eeeeee',
    },
    zebra: {
        backgroundColor: '#fafafa',
    },
    cellBase: {
        fontSize: 8,
        paddingHorizontal: 6,
    },
    headerText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
});

const formatValue = (value, col) => {
    if (value === null || value === undefined || value === '') return '';
    if (col.type === 'number') {
        const num = typeof value === 'string'
            ? parseFloat(value.replace(/,/g, ''))
            : value;
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    return String(value);
};

const PDFTable = React.memo(({ columns, data }) => {
    return (
        <View style={styles.tableContainer}>
            <View style={styles.headerRow} fixed>
                {columns.map((col, index) => (
                    <View key={index} style={col.width ? { width: col.width } : { flex: 1 }}>
                        <Text
                            style={[
                                styles.cellBase,
                                styles.headerText,
                                { textAlign: col.align || "left" }
                            ]}
                        >
                            {col.header}
                        </Text>
                    </View>
                ))}
            </View>

            {data.map((row, rowIndex) => (
                <View
                    key={row.id || rowIndex}
                    style={[
                        styles.dataRow,
                        rowIndex % 2 !== 0 ? styles.zebra : null
                    ]}
                    wrap={false}
                >
                    {columns.map((col, colIndex) => (
                        <View key={colIndex} style={col.width ? { width: col.width } : { flex: 1 }}>
                            <Text
                                style={[
                                    styles.cellBase,
                                    { textAlign: col.align || "left" }
                                ]}
                            >
                                {formatValue(row[col.field], col)}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
});

export default PDFTable;