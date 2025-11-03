import React, { useEffect, useState } from "react";
import Service from "../../config/Service";
import { Button } from "../index"; // Assuming Button is imported correctly

const GetInvoice = ({ invoiceId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Constants for design elements
  const PRIMARY_COLOR = "teal-700";
  const ACCENT_COLOR = "teal-500";

  // Mock Bank Details based on the provided PDF, as this data is static/should be stored separately
//   const bankDetails = {
//     abaRouting: "121145349",
//     accountNumber: "201408414172365",
//     accountType: "Business checking",
//     recipient: "Whiteboard Technologies LLC.",
//     beneficiaryAddress:
//       "2055, Limestone Rd STE 200-C, Wilmington New Castle Country, Wilmington, DE, 19808.",
//     bankInfo: "Column Bank",
//     bankAddress: "1110, Gorgas Ave Suite A4-700, San Francisco, CA 94129.",
//   };

  useEffect(() => {
    if (invoiceId && isOpen) fetchInvoice();
  }, [invoiceId, isOpen]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      // Simulating a slight delay for better UX on fast networks
      await new Promise((resolve) => setTimeout(resolve, 300));
      const res = await Service.InvoiceByID(invoiceId);
      setInvoice(res?.data);
    } catch (err) {
      console.error("Error loading invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Calculations for Totals (Replicating InvoiceForm logic) ---
  const subtotal =
    invoice?.invoiceItems?.reduce((sum, item) => {
      // Safely calculate total USD, prioritizing existing totalUSD if available
      const totalUSD =
        parseFloat(item.totalUSD) ||
        (parseFloat(item.rateUSD) || 0) * (parseInt(item.unit) || 0);
      return sum + totalUSD;
    }, 0) || 0;

  const igstRate = 0.18; // 18% IGST
  const igstAmount = subtotal * igstRate;
  const grandTotal = subtotal + igstAmount;
  // -----------------------------------------------------------------

  if (!isOpen) return null;

  return (
    // Backdrop: Now allows scrolling if content is taller than the viewport
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 md:pt-10">
      <div
        // Inner Content Box: Constrained max height and internal scrolling
        className={`bg-white w-[95vw] max-w-4xl rounded-xl shadow-2xl relative transition-all duration-300 transform max-h-[95vh] overflow-y-auto ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 m-4 text-3xl font-light text-gray-500 hover:text-red-500 z-50 transition bg-white rounded-full p-1 shadow"
          aria-label="Close"
        >
          &times;
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <svg
              className={`animate-spin h-8 w-8 text-${ACCENT_COLOR}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-lg text-gray-600">
              Fetching invoice details...
            </p>
          </div>
        ) : (
          <div
            id="invoice-preview"
            className="p-8 md:p-12 text-sm text-gray-800 pt-0" /* Adjust padding top due to sticky close button */
          >
            {/* Logo and Main Header */}
            <header className="flex justify-between items-start mb-8 border-b-4 border-double border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src="../../src/assets/logo.png"
                  alt="Company Logo"
                  // Changed from rounded-full to rounded-lg
                  className="w-12 h-12 rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/60x60/cccccc/000000?text=Logo";
                  }}
                />
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">
                    {invoice?.customerName || "Fabricator Name"}
                  </h1>
                  <p className={`text-xs text-${ACCENT_COLOR}`}>
                    Adding Life to Engineering
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h2
                  className={`text-4xl font-black text-${PRIMARY_COLOR} mb-1`}
                >
                  TAX INVOICE
                </h2>
                <div className="text-xs text-gray-600">
                  <p>
                    Invoice No:{" "}
                    <span className="font-semibold text-gray-800">
                      {invoice?.invoiceNumber}
                    </span>
                  </p>
                  <p>
                    Invoice Date:{" "}
                    <span className="font-semibold">
                      {new Date(
                        invoice?.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </header>

            {/* Job and Supply Details */}
            <div
              className={`bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6 text-xs grid grid-cols-2 md:grid-cols-4 gap-4 font-medium`}
            >
              <p>
                Job Name:{" "}
                <span className="text-gray-700 font-semibold">
                  {invoice?.jobName || "N/A"}
                </span>
              </p>
              <p>
                Project ID:{" "}
                <span className="text-gray-700 font-semibold">
                  {invoice?.projectId || "N/A"}
                </span>
              </p>
              <p>
                Place of Supply:{" "}
                <span className="text-gray-700 font-semibold">
                  {invoice?.placeOfSupply || "N/A"}
                </span>
              </p>
              <p>
                Currency:{" "}
                <span className="text-gray-700 font-semibold">
                  {invoice?.currencyType || "USD"}
                </span>
              </p>
            </div>

            {/* Sender / Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Fabricator (From) */}
              <div className="p-4 border-l-4 border-gray-400 bg-gray-50 rounded-md">
                <h3 className={`text-xs font-bold text-gray-600 mb-1`}>
                  Details of Supplier (Billed From)
                </h3>
                <p className="font-bold text-base text-gray-900">
                  {invoice?.customerName}
                </p>
                <p className="text-xs text-gray-600">{invoice?.address}</p>
                <p className="text-xs mt-2">
                  GSTIN:{" "}
                  <span className="font-semibold">
                    {invoice?.GSTIN || "N/A"}
                  </span>
                </p>
                <p className="text-xs">
                  State Code:{" "}
                  <span className="font-semibold">
                    {invoice?.stateCode || "N/A"}
                  </span>
                </p>
              </div>

              {/* Client (To) */}
              <div className="p-4 border-l-4 border-teal-500 bg-teal-50 rounded-md">
                <h3 className={`text-xs font-bold text-gray-600 mb-1`}>
                  Details of Receiver (Billed To)
                </h3>
                <p className="font-bold text-base text-gray-900">
                  {invoice?.contactName}
                </p>
                <p className="text-xs text-gray-600">
                  Client ID: {invoice?.clientId || "N/A"}
                </p>
                <p className="text-xs text-gray-600">
                
                  {invoice?.contactAddress || "Address not provided"}
                </p>
                <p className="text-xs mt-2">
                  Country/State:{" "}
                  <span className="font-semibold">
                    {invoice?.clientState || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg">
              <table className="min-w-full text-center text-sm">
                <thead className={`bg-${ACCENT_COLOR} text-white`}>
                  <tr>
                    <th className="px-3 py-2 font-semibold">S.No</th>
                    <th className="px-3 py-2 text-left w-2/5">
                      Description of Services
                    </th>
                    <th className="px-3 py-2">SAC</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">
                      Rate ({invoice?.currencyType})
                    </th>
                    <th className="px-3 py-2">
                      Total ({invoice?.currencyType})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.invoiceItems?.length > 0 ? (
                    invoice.invoiceItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 text-left">
                          {item.description}
                        </td>
                        <td className="px-3 py-2">{item.sacCode}</td>
                        <td className="px-3 py-2">{item.unit}</td>
                        <td className="px-3 py-2 font-mono">
                          {parseFloat(item.rateUSD)?.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 font-mono font-semibold">
                          {parseFloat(item.totalUSD)?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-gray-500"
                      >
                        No invoice items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Summary & Words */}
            <div className="flex justify-end">
              <div className="w-full md:w-2/5">
                {/* Value in Words */}
                <div className="mb-4 p-2 border-b border-gray-300">
                  <p className="font-medium text-sm">
                    Total Invoice Value (in Words):{" "}
                    <span className="font-bold italic">
                      {invoice?.TotalInvoiveValuesinWords || "Not specified"}
                    </span>
                  </p>
                </div>

                {/* Financial Breakdown Table */}
                <div className="text-right text-sm">
                  <div className="flex justify-between font-medium py-1">
                    <span>Subtotal (Before Tax):</span>
                    <span className="font-mono text-gray-800">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium py-1 border-b border-gray-300">
                    <span>IGST (18.0%):</span>
                    <span className="font-mono text-red-600">
                      ${igstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-lg py-2 bg-teal-50 rounded-b-lg">
                    <span>Total Invoice Value:</span>
                    <span
                      className={`text-${PRIMARY_COLOR} font-black font-mono`}
                    >
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details / Footer */}
            {/* <div className="mt-12 pt-6 border-t border-gray-300">
              <h3
                className={`text-md font-bold text-${PRIMARY_COLOR} mb-3 border-b pb-1`}
              >
                ACH / Wire Transfer Instructions ({invoice?.currencyType})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <div>
                  <p>
                    <span className="font-semibold">Recipient:</span>{" "}
                    {bankDetails.recipient}
                  </p>
                  <p>
                    <span className="font-semibold">Beneficiary Address:</span>{" "}
                    {bankDetails.beneficiaryAddress}
                  </p>
                  <p>
                    <span className="font-semibold">Account Number:</span>{" "}
                    {bankDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Bank:</span>{" "}
                    {bankDetails.bankInfo}
                  </p>
                  <p>
                    <span className="font-semibold">Bank Address:</span>{" "}
                    {bankDetails.bankAddress}
                  </p>
                  <p>
                    <span className="font-semibold">ABA/Routing Number:</span>{" "}
                    {bankDetails.abaRouting}
                  </p>
                </div>
              </div>
            </div> */}

            <div className="flex justify-between items-end mt-8">
              <p className="text-xs italic text-gray-500">
                Instructions: Consulting Proforma Invoice. All payments to be
                made within 15 days.
              </p>
              <div className="text-center">
                <p className={`font-semibold text-md text-${PRIMARY_COLOR}`}>
                  For {invoice?.customerName}
                </p>
                <div className="h-10 border-b border-gray-400 w-32 mx-auto mt-4"></div>
                <p className="text-xs mt-1">Authorised Signatory</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-8 space-x-4">
              <Button
                onClick={onClose}
                className={`bg-gray-400 hover:bg-gray-500 text-white px-6 py-2`}
              >
                Close View
              </Button>
              <Button
                onClick={() => window.print()}
                className={`bg-${ACCENT_COLOR} hover:bg-teal-600 text-white px-6 py-2`}
              >
                Print Invoice
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetInvoice;
