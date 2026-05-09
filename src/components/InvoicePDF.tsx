import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { InvoiceData } from '../types';

// Register Inter font for Rupee symbol support
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.woff' },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-700-normal.woff', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#1a1a1a',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '1 solid #eaeaea',
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#000',
  },
  invoiceDate: {
    marginTop: 8,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  section: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
    textTransform: 'uppercase',
  },
  textRow: {
    marginBottom: 3,
    lineHeight: 1.2,
  },
  addressRow: {
    marginBottom: 0,
    lineHeight: 1.0,
  },
  boldText: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#000',
  },
  table: {
    width: 'auto',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottom: '1 solid #ddd',
    paddingVertical: 8,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #eee',
    paddingVertical: 8,
  },
  col1: { width: '12%', borderRight: '1 solid #eee', paddingHorizontal: 4 }, // Date
  col2: { width: '22%', borderRight: '1 solid #eee', paddingHorizontal: 4 }, // Series/Movie
  col3: { width: '28%', borderRight: '1 solid #eee', paddingHorizontal: 4 }, // Character(s)
  col4: { width: '17%', borderRight: '1 solid #eee', paddingHorizontal: 4 }, // Director
  col5: { width: '8%', borderRight: '1 solid #eee', paddingHorizontal: 4 }, // Ep(s)
  col6: { width: '13%', textAlign: 'right', paddingHorizontal: 4 }, // Amount
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  bankDetails: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#444',
    width: '60%',
  },
  signatureContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '40%',
  },
  signatureName: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export const InvoicePDF = ({ data }: { data: InvoiceData }) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>INVOICE</Text>
          <Text style={styles.invoiceDate}>Date: {data.invoiceDate}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={[styles.textRow, styles.boldText]}>Jullie Devaani</Text>
            <Text style={styles.textRow}>7506242650</Text>
            <Text style={styles.addressRow}>B-70, Vardhman Nagar</Text>
            <Text style={styles.addressRow}>Nursing Lane, Malad West</Text>
            <Text style={styles.addressRow}>Mumbai-64</Text>
            <Text style={[styles.textRow, { marginTop: 3 }]}>jullie.devaani@gmail.com</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={[styles.textRow, styles.boldText]}>{data.client.name || '-'}</Text>
            <Text style={styles.textRow}>{data.client.contact || ''}</Text>
            <Text style={styles.addressRow}>{data.client.address || ''}</Text>
            {data.client.gst && (
              <Text style={[styles.textRow, { marginTop: 3 }]}>
                <Text style={styles.boldText}>GSTIN: </Text>
                {data.client.gst}
              </Text>
            )}
          </View>
        </View>

        {/* Table starts here */}
        <View style={styles.tableHeader}>
            <Text style={styles.col1}>Date</Text>
            <Text style={styles.col2}>Series/Movie</Text>
            <Text style={styles.col3}>Character(s)</Text>
            <Text style={styles.col4}>Director</Text>
            <Text style={styles.col5}>Ep(s)</Text>
            <Text style={styles.col6}>Amount (₹)</Text>
          </View>

          {data.rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{row.date || '-'}</Text>
              <Text style={styles.col2}>{row.seriesName || '-'}</Text>
              <Text style={styles.col3}>{row.characters || '-'}</Text>
              <Text style={styles.col4}>{row.director || '-'}</Text>
              <Text style={styles.col5}>{(row.episodes || '-').replace(/,/g, ', ')}</Text>
              <View style={styles.col6}>
                <Text>{row.amount ? formatCurrency(Number(row.amount)) : '-'}</Text>
              </View>
            </View>
          ))}
        {/* Table ends here */}

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₹ {formatCurrency(data.total)}</Text>
        </View>

        <View wrap={false}>
          <View style={styles.footerWrapper}>
            <View style={styles.bankDetails}>
              <Text><Text style={styles.boldText}>Bank:</Text> Bank of Baroda</Text>
              <Text><Text style={styles.boldText}>A/C No:</Text> 99730100000419</Text>
              <Text><Text style={styles.boldText}>IFSC:</Text> BARB0DBMONT (fifth character is zero)</Text>
              <Text><Text style={styles.boldText}>Branch:</Text> Mount Poinsur</Text>
              <Text><Text style={styles.boldText}>UPI No:</Text> 7506242650</Text>
              <Text><Text style={styles.boldText}>PAN:</Text> AFRPD3548L</Text>
            </View>
  
            <View style={styles.signatureContainer}>
              <Text style={styles.signatureName}>Jullie Devaani</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
