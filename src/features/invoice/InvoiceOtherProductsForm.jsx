import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://pharmacy-stocks-backend.onrender.com/api';

const InvoiceOtherProductsForm = ({ category }) => {
  // category: 'glassware' or 'others'
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [voucherId, setVoucherId] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [lineItems, setLineItems] = useState([
    { productId: '', name: '', unit: '', thresholdValue: '', quantity: '', totalPrice: '', pricePerUnit: '', expiryDate: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/vendors`).then(res => setVendors(res.data.vendors || res.data.data || []));
    axios.get(`${API_BASE}/products/category/${category}`).then(res => setProducts(res.data.data || []));
    axios.get(`${API_BASE}/vouchers/next?category=invoice`).then(res => setVoucherId(res.data.voucherId || res.data.nextVoucherId || ''));
  }, [category]);

  const handleVendorSelect = (e) => {
    const vendor = vendors.find(v => v._id === e.target.value);
    setSelectedVendor(vendor);
  };

  const handleProductSelect = (idx, productId) => {
    const product = products.find(p => p._id === productId);
    setLineItems(items => items.map((item, i) =>
      i === idx
        ? {
            ...item,
            productId: product._id,
            name: product.name,
            unit: product.unit,
            thresholdValue: product.thresholdValue,
            quantity: '',
            totalPrice: '',
            pricePerUnit: '',
            expiryDate: ''
          }
        : item
    ));
  };

  const selectedProductIds = lineItems.map(item => item.productId).filter(Boolean);

  const handleLineItemChange = (idx, field, value) => {
    setLineItems(items => items.map((item, i) => {
      if (i !== idx) return item;
      let updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'totalPrice') {
        const qty = Number(field === 'quantity' ? value : item.quantity);
        const total = Number(field === 'totalPrice' ? value : item.totalPrice);
        updated.pricePerUnit = qty && total ? (total / qty).toFixed(2) : '';
      }
      return updated;
    }));
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: '', name: '', unit: '', thresholdValue: '', quantity: '', totalPrice: '', pricePerUnit: '', expiryDate: '' }]);
  };

  const removeLineItem = (idx) => {
    setLineItems(items => items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    if (!selectedVendor) {
      setError('Please select a vendor.');
      setSubmitting(false);
      return;
    }
    if (!invoiceNumber || !invoiceDate) {
      setError('Invoice number and date are required.');
      setSubmitting(false);
      return;
    }
    if (lineItems.some(item => !item.productId || !item.quantity || !item.totalPrice || !item.expiryDate)) {
      setError('All line items must have a product, quantity, total price, and expiry date.');
      setSubmitting(false);
      return;
    }
    const payload = {
      vendorId: selectedVendor._id,
      vendorName: selectedVendor.name,
      invoiceNumber,
      invoiceDate,
      lineItems: lineItems.map(item => ({
        productId: item.productId,
        name: item.name,
        unit: item.unit,
        thresholdValue: item.thresholdValue,
        quantity: Number(item.quantity),
        totalPrice: Number(item.totalPrice),
        pricePerUnit: Number(item.pricePerUnit),
        expiryDate: item.expiryDate
      }))
    };
    try {
      const res = await axios.post(`${API_BASE}/invoices/${category}`, payload);
      setSuccess(`Invoice created successfully! Invoice ID: ${res.data.invoiceId || res.data.data?.invoiceId || ''}`);
      setLineItems([
        { productId: '', name: '', unit: '', thresholdValue: '', quantity: '', totalPrice: '', pricePerUnit: '', expiryDate: '' }
      ]);
      setInvoiceNumber('');
      setInvoiceDate('');
      setSelectedVendor(null);
      axios.get(`${API_BASE}/vouchers/next?category=invoice`).then(r => setVoucherId(r.data.voucherId || r.data.nextVoucherId || ''));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8 mt-8 relative">
      <div className="absolute top-6 right-8 text-sm font-mono bg-blue-100 text-blue-700 px-4 py-1 rounded-full shadow">
        Voucher ID: {voucherId || '...'}
      </div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Create Invoice for {category === 'glassware' ? 'Glassware' : 'Other Products'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            value={selectedVendor?._id || ''}
            onChange={handleVendorSelect}
            disabled={!!selectedVendor}
            required
          >
            <option value="">Select a vendor...</option>
            {vendors.map(v => (
              <option key={v._id} value={v._id}>{v.name}</option>
            ))}
          </select>
          {selectedVendor && (
            <div className="mt-2 text-xs text-gray-500">Vendor Code: <span className="font-mono">{selectedVendor.vendorCode}</span></div>
          )}
          {selectedVendor && (
            <button type="button" className="mt-2 text-xs text-blue-600 underline" onClick={() => setSelectedVendor(null)}>Change Vendor</button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={invoiceDate}
              onChange={e => setInvoiceDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Line Items ({category === 'glassware' ? 'Glassware' : 'Other Products'})</label>
          <div className="space-y-4">
            {lineItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-end bg-white/60 rounded-lg p-3 border border-gray-200 relative">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500">Product</label>
                  <select
                    className="w-full px-2 py-1 rounded border border-gray-300 bg-white/80 text-gray-800"
                    value={item.productId}
                    onChange={e => handleProductSelect(idx, e.target.value)}
                    required
                  >
                    <option value="">Select product...</option>
                    {products.filter(p => !selectedProductIds.includes(p._id) || p._id === item.productId).map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Unit</label>
                  <input type="text" className="w-full px-2 py-1 rounded border border-gray-200 bg-gray-100 text-gray-500" value={item.unit} readOnly tabIndex={-1} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Threshold</label>
                  <input type="text" className="w-full px-2 py-1 rounded border border-gray-200 bg-gray-100 text-gray-500" value={item.thresholdValue} readOnly tabIndex={-1} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-2 py-1 rounded border border-gray-300 bg-white/80 text-gray-800"
                    value={item.quantity}
                    onChange={e => handleLineItemChange(idx, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Total Price</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-2 py-1 rounded border border-gray-300 bg-white/80 text-gray-800"
                    value={item.totalPrice}
                    onChange={e => handleLineItemChange(idx, 'totalPrice', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Price/Unit</label>
                  <input type="text" className="w-full px-2 py-1 rounded border border-gray-200 bg-gray-100 text-gray-500" value={item.pricePerUnit} readOnly tabIndex={-1} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-2 py-1 rounded border border-gray-300 bg-white/80 text-gray-800"
                    value={item.expiryDate}
                    onChange={e => handleLineItemChange(idx, 'expiryDate', e.target.value)}
                    required
                  />
                </div>
                {lineItems.length > 1 && (
                  <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeLineItem(idx)} title="Remove">
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="mt-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-sm" onClick={addLineItem}>
              + Add Line Item
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
        {success && <div className="text-green-600 text-sm font-medium">{success}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full transition"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : `Create Invoice for ${category === 'glassware' ? 'Glassware' : 'Other Products'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceOtherProductsForm;
