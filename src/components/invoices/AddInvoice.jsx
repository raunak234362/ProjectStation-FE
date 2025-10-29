// BillingForm.jsx
import React, { useState } from 'react';

// A simple reusable input component for cleaner form structure
const FormInput = ({ label, id, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const BillingForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: 'WBLLC/2025/000',
    invoiceDate: '2025-05-29',
    jobName: 'The 25 jobs',
    recipientName: 'Cobb Industrial, Inc',
    recipientContact: 'Mr.',
    recipientAddress: '',
    recipientCountry: 'Country/State/State code',
    recipientGSTIN: '',
    paymentTerms: 'Wire Transfers within 15 days',
    // ... other invoice details as needed
  });

  const [serviceItems, setServiceItems] = useState([
    { id: 1, description: 'Approval drawings', sac: '998333', unit: 1, rate: 0, total: 0 },
    { id: 2, description: 'COR#1', sac: '998333', unit: 1, rate: 0, total: 0 },
  ]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (id, field, value) => {
    setServiceItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Basic calculation for Total (Rate * Unit)
          if (field === 'rate' || field === 'unit') {
            const rate = field === 'rate' ? parseFloat(value) || 0 : updatedItem.rate;
            const unit = field === 'unit' ? parseFloat(value) || 0 : updatedItem.unit;
            updatedItem.total = rate * unit;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateGrandTotal = () => {
    return serviceItems.reduce((acc, item) => acc + item.total, 0);
  };

  const grandTotal = calculateGrandTotal();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice Data:', invoiceData);
    console.log('Service Items:', serviceItems);
    // Add logic here to send data to your backend API
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Invoice/Billing Form 🧾
      </h1>
      <form onSubmit={handleSubmit}>

        {/* --- Invoice Details --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 border rounded-md bg-gray-50">
          <FormInput
            label="Invoice No."
            id="invoiceNo"
            value={invoiceData.invoiceNo}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="Invoice Date"
            id="invoiceDate"
            type="date"
            value={invoiceData.invoiceDate}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="Job Name"
            id="jobName"
            value={invoiceData.jobName}
            onChange={handleInvoiceChange}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Receiver Details (Billed to)</h2>
        {/* --- Receiver Details --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 border rounded-md">
          <FormInput
            label="Name"
            id="recipientName"
            value={invoiceData.recipientName}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="Contact Name"
            id="recipientContact"
            value={invoiceData.recipientContact}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="Address"
            id="recipientAddress"
            value={invoiceData.recipientAddress}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="Country/State"
            id="recipientCountry"
            value={invoiceData.recipientCountry}
            onChange={handleInvoiceChange}
          />
          <FormInput
            label="GSTIN/UNIQUE ID"
            id="recipientGSTIN"
            value={invoiceData.recipientGSTIN}
            onChange={handleInvoiceChange}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h2>
        {/* --- Service Items Table --- */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl. #</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAC</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (USD)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (USD)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 w-10">{item.id}.</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      value={item.sac}
                      onChange={(e) => handleItemChange(item.id, 'sac', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 w-20">
                    <input
                      type="number"
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm text-right"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium text-right w-32">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Totals and Payment --- */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-4">
              <span>Total Invoice Value (USD):</span>
              <span className="text-2xl">${grandTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              **Total Invoice Value (in Words):** US Dollars { /* Implement a number-to-words function here */ }
            </p>
          </div>
        </div>
        
        <hr className="my-6" />

        {/* --- Instructions --- */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions & Payment</h2>
        <div className="mb-6 p-4 border rounded-md bg-yellow-50 border-yellow-200">
            <p className="text-sm font-medium text-gray-700">
                <span className="font-bold">Payment Terms:</span> {invoiceData.paymentTerms}.
            </p>
            <p className="text-sm text-gray-700 mt-2">
                <span className="font-bold">Instructions:</span> Consulting Proforma Invoice for Steel Detailing of {invoiceData.jobName} - Cobb P.O #.
            </p>
            <p className="text-sm text-gray-700 mt-2">
                All payments to be made to **WHITEBOARD TECHNOLOGIES LLC** in US Dollars via **Wire Transfers** within 15 days.
            </p>
        </div>

        {/* --- Submit Button --- */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;