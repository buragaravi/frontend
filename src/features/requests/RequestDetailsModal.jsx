import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import RequestStatusBadge from './RequestStatusBadge';
import { Printer, FileText, X } from 'lucide-react';

// Constants for theming
const THEME = {
  background: 'bg-gradient-to-br from-[#F5F9FD] to-[#E1F1FF]',
  card: 'bg-white',
  border: 'border-[#BCE0FD]',
  primaryText: 'text-[#0B3861]',
  secondaryText: 'text-[#64B5F6]',
  primaryBg: 'bg-[#0B3861]',
  secondaryBg: 'bg-[#64B5F6]',
  hoverBg: 'hover:bg-[#1E88E5]',
  inputFocus: 'focus:ring-[#0B3861] focus:border-[#0B3861]'
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    color: '#0B3861',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    color: '#0B3861',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  infoBox: {
    marginBottom: 10
  },
  infoLabel: {
    fontSize: 10,
    color: '#64B5F6',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 12,
    color: '#0B3861'
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    backgroundColor: '#F5F9FD',
    padding: 8,
    fontSize: 10,
    color: '#0B3861',
    fontWeight: 'bold'
  },
  tableRow: {
    padding: 8,
    fontSize: 10,
    color: '#0B3861',
    backgroundColor: '#FFFFFF'
  },
  signature: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#0B3861',
    paddingTop: 5,
    alignSelf: 'flex-end'
  },
  signatureText: {
    fontSize: 10,
    color: '#64B5F6'
  }
});

// PDF Document for Download
const RequestPDF = ({ request }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Request Details</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Lab ID</Text>
            <Text style={styles.infoValue}>{request.labId}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{request.status}</Text>
          </View>
          {request.facultyId?.name && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Faculty</Text>
              <Text style={styles.infoValue}>{request.facultyId.name}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiments</Text>
        {request.experiments?.map((exp, index) => (
          <View key={exp._id} style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E1F1FF', paddingBottom: 8 }}>
            <Text style={styles.infoValue}>Experiment {index + 1}: {exp.experimentName}</Text>
            <Text style={styles.infoLabel}>{exp.date} - {exp.session}</Text>
            <View style={styles.table}>
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#BCE0FD' }}>
                <Text style={[styles.tableHeader, { flex: 2 }]}>Chemical</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Quantity</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Unit</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Status</Text>
              </View>
              {exp.chemicals?.map((chemical) => (
                <View key={chemical._id} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#F5F9FD' }}>
                  <Text style={[styles.tableRow, { flex: 2 }]}>{chemical.chemicalName}</Text>
                  <Text style={[styles.tableRow, { flex: 1 }]}>{chemical.quantity}</Text>
                  <Text style={[styles.tableRow, { flex: 1 }]}>{chemical.unit}</Text>
                  <Text style={[styles.tableRow, { flex: 1 }]}>{chemical.isAllocated ? 'Allocated' : 'Pending'}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
      <View style={styles.signature}>
        <Text style={styles.signatureText}>Authorized Signature</Text>
      </View>
    </Page>
  </Document>
);

// PrintableContent Component
const PrintableContent = React.forwardRef(({ request }, ref) => {
  if (!request) return null;

  return (
    <div ref={ref} className={`p-6 ${THEME.background}`}>
      <h2 className={`text-2xl font-bold ${THEME.primaryText} mb-4`}>Request Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`${THEME.card} p-4 rounded-lg ${THEME.border}`}>
          <p className={`text-sm font-medium ${THEME.secondaryText}`}>Lab ID</p>
          <p className={`font-medium ${THEME.primaryText}`}>{request.labId}</p>
        </div>
        <div className={`${THEME.card} p-4 rounded-lg ${THEME.border}`}>
          <p className={`text-sm font-medium ${THEME.secondaryText}`}>Status</p>
          <RequestStatusBadge status={request.status} />
        </div>
        {request.facultyId?.name && (
          <div className={`${THEME.card} p-4 rounded-lg ${THEME.border}`}>
            <p className={`text-sm font-medium ${THEME.secondaryText}`}>Faculty</p>
            <p className={`font-medium ${THEME.primaryText}`}>{request.facultyId.name}</p>
          </div>
        )}
      </div>

      <div className={`${THEME.card} p-4 rounded-lg ${THEME.border} mb-6`}>
        <h3 className={`text-lg font-semibold ${THEME.primaryText} mb-3`}>Experiments</h3>
        <div className="space-y-4">
          {request.experiments?.map((exp, index) => (
            <div key={exp._id} className={`p-4 rounded-lg ${THEME.border}`}>
              <p className={`font-medium ${THEME.primaryText} mb-2`}>
                Experiment {index + 1}: {exp.experimentName}
              </p>
              <p className={`text-sm ${THEME.secondaryText} mb-2`}>
                {exp.date} - {exp.session}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`${THEME.background}`}>
                    <tr>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${THEME.primaryText}`}>
                        Chemical
                      </th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${THEME.primaryText}`}>
                        Quantity
                      </th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${THEME.primaryText}`}>
                        Unit
                      </th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${THEME.primaryText}`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200" >
                    {exp.chemicals?.map((chemical) => (
                      <tr key={chemical._id}>
                        <td className={`px-4 py-2 text-sm ${THEME.primaryText}`}>
                          {chemical.chemicalName}
                        </td>
                        <td className={`px-4 py-2 text-sm ${THEME.primaryText}`}>
                          {chemical.quantity}
                        </td>
                        <td className={`px-4 py-2 text-sm ${THEME.primaryText}`}>
                          {chemical.unit}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${chemical.isAllocated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          `}>
                            {chemical.isAllocated ? 'Allocated' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right mt-8">
        <p className={`text-sm font-medium ${THEME.secondaryText}`}>Authorized Signature</p>
      </div>
    </div>
  );
});

const RequestDetailsModal = ({ request, open, onClose }) => {
  const [isPdfReady, setIsPdfReady] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    if (open && request) {
      setIsPdfReady(true);
    } else {
      setIsPdfReady(false);
    }
  }, [open, request]);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Request_${request?.labId || 'Details'}`
  });
  
  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${THEME.card} rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${THEME.border}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-2xl font-bold ${THEME.primaryText}`}>Request Details</h2>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handlePrint}
                className={`flex items-center p-2 text-[#64B5F6] hover:text-[#1E88E5] transition-colors`}
                title="Print Request"
              >
                <Printer size={20} />
              </button>
              {isPdfReady && (
                <PDFDownloadLink 
                  document={<RequestPDF request={request} />} 
                  fileName={`Request_${request.labId}.pdf`}
                  className={`flex items-center p-2 text-[#64B5F6] hover:text-[#1E88E5] transition-colors`}
                  title="Download PDF"
                >
                  {({ loading }) => (
                    loading ? <FileText size={20} className="animate-pulse" /> : <FileText size={20} />
                  )}
                </PDFDownloadLink>
              )}
              <button
                onClick={onClose}
                className={`flex items-center p-2 text-[#64B5F6] hover:text-[#1E88E5] transition-colors`}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <PrintableContent ref={componentRef} request={request} />
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;