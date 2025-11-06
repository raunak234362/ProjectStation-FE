/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Service from "../../config/Service";
import { Button } from "../index";

const GetInvoice = ({ invoiceId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  // bankDetails state now holds the extracted object from invoice.accountInfo[0]
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Constants for design elements
  const PRIMARY_COLOR = "teal-700";
  const ACCENT_COLOR = "teal-500";

  // --- Fetch Invoice Data (MODIFIED LOGIC) ---
  const fetchInvoice = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const res = await Service.InvoiceByID(invoiceId);
      const invoiceData = res?.data;
      setInvoice(invoiceData);

      // Extract bank details directly from invoice.accountInfo
      if (invoiceData?.accountInfo && invoiceData.accountInfo.length > 0) {
        setBankDetails(invoiceData.accountInfo[0]);
      } else {
        setBankDetails(null);
      }
    } catch (err) {
      console.error("Error loading invoice:", err);
      // setBankDetails(null) will be triggered if accountInfo is missing/empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId && isOpen) fetchInvoice();
  }, [invoiceId, isOpen]);

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

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 md:pt-10">
      <div
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
            <header className="flex justify-between items-end mb-8 border-b-4 border-double border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-black leading-none text-gray-900">
                  <span className="text-4xl text-teal-600">WB</span> white
                  <br />
                  board
                </div>
                <div className={`text-xs text-${ACCENT_COLOR} italic`}>
                  Adding Life to Engineering
                </div>
              </div>

              {/* Right: Invoice No & Date Block (Small Table look) */}
              <div className="text-right border border-gray-300 p-2 text-xs bg-gray-50">
                <p className="mb-1">
                  <span className="font-semibold text-gray-700">
                    Invoice No:
                  </span>{" "}
                  {invoice?.invoiceNumber || "N/A"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-gray-700">
                    Invoice Date:
                  </span>{" "}
                  {formatDate(invoice?.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Job Name:</span>{" "}
                  {invoice?.jobName || "N/A"}
                </p>
              </div>
            </header>

            {/* --- INVOICE METADATA & RECIPIENT DETAILS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border border-gray-300 bg-gray-100 rounded-md">
                <h3 className={`text-xs font-bold text-gray-600 mb-1`}>
                  Details of Supplier (Billed From)
                </h3>
                <p className="font-bold text-base text-gray-900">
                  {invoice?.customerName || "Fabricator Name"}
                </p>
                <p className="text-xs text-gray-600">
                  Address: {invoice?.address}
                </p>
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
                <p className="text-xs">
                  Place of Supply:{" "}
                  <span className="font-semibold">
                    {invoice?.placeOfSupply || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {/* --- ITEMS TABLE --- */}
            <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg">
              <table className="min-w-full text-center text-sm">
                <thead className={`bg-${ACCENT_COLOR} text-white`}>
                  <tr>
                    <th className="px-3 py-2 font-semibold">Sl. #</th>
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
                  {/* Total Row (Matching PDF layout for totals) */}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                    <td colSpan={5} className="px-3 py-2 text-right">
                      Total (Before Tax)
                    </td>
                    <td className="px-3 py-2 font-mono text-lg">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* --- TOTALS SUMMARY & WORDS (Bottom Right) --- */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-2/5 border border-gray-400 rounded-lg overflow-hidden shadow-md">
                {/* GST Breakdown (Matching PDF) */}
                <div className="text-right text-sm">
                  <div className="flex justify-between px-3 py-1 bg-gray-50">
                    <span className="font-semibold">IGST Rate:</span>
                    <span className="font-mono">18.0%</span>
                  </div>
                  <div className="flex justify-between px-3 py-1 bg-gray-50 border-b border-gray-300">
                    <span className="font-semibold">IGST Amount:</span>
                    <span className="font-mono text-red-600">
                      ${igstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between px-3 py-1 font-extrabold bg-gray-200">
                    <span>Total GST:</span>
                    <span className="font-mono">${igstAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Value */}
                <div className="text-right text-base font-extrabold bg-teal-100 p-2">
                  <div className="flex justify-between">
                    <span>Total Invoice Value (in Figures):</span>
                    <span
                      className={`text-${PRIMARY_COLOR} font-black font-mono`}
                    >
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TOTAL IN WORDS (Footer Top) --- */}
            <div className="mb-4 p-2 border-b-2 border-teal-500">
              <p className="font-medium text-base">
                Total Invoice Value (in Words):{" "}
                <span className="font-bold italic text-teal-700">
                  {invoice?.totalInvoiceValueInWords ||
                    "US Dollars Not specified"}
                </span>
              </p>
            </div>

            {/* --- BANK DETAILS / INSTRUCTIONS (Footer) --- */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3
                className={`text-md font-bold text-gray-700 mb-3 border-b pb-1`}
              >
                Instructions / ACH/Wire Transfer ({invoice?.currencyType})
              </h3>
              {bankDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold">
                        Recipient / Beneficiary:
                      </span>{" "}
                      {bankDetails.beneficiaryInfo}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Beneficiary Address:
                      </span>{" "}
                      {bankDetails.beneficiaryAddress}
                    </p>
                    <p>
                      <span className="font-semibold">Account Number:</span>{" "}
                      {bankDetails.accountNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Account Type:</span>{" "}
                      {bankDetails.accountType}
                    </p>
                  </div>
                  <div className="space-y-1">
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
                      {bankDetails.abaRoutingNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500 p-4 bg-red-50 rounded-lg">
                  Bank account details not available or not linked to this
                  invoice.
                </p>
              )}
            </div>

            {/* --- SIGNATURE / FINAL FOOTER --- */}
            <div className="flex justify-between items-end mt-8">
              <p className="text-xs italic text-gray-500 w-1/2">
                Instructions:{" "}
                {invoice?.instructions ||
                  "All payments to be made via Wire Transfers within 15 days."}
              </p>
              <div className="text-center">
                <p className={`font-semibold text-md text-${PRIMARY_COLOR}`}>
                  For {invoice?.customerName}
                </p>
                <div className="h-10 border-b border-gray-400 w-32 mx-auto mt-4"></div>
                <p className="text-xs mt-1">
                  Authorised Signatory (
                  {invoice?.authorisingPerson || "Rajeshwari K"})
                </p>
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
