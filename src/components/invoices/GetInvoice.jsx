/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Service from "../../config/Service";
import { Button } from "../index";

const GetInvoice = ({ invoiceId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  // bankDetails state now holds the extracted object from invoice.accountInfo[0]
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
console.log(invoice);
  // Constants for design elements (Keeping your originals)
  const PRIMARY_COLOR = "teal-700";
  const ACCENT_COLOR = "teal-500";
  const PRIMARY_COLOR_BG = "bg-teal-700";
  const PRIMARY_COLOR_TEXT = "text-teal-700";
  const ACCENT_COLOR_BG = "bg-teal-100";
  const ACCENT_COLOR_TEXT = "text-teal-500"; // Used this less, replaced with teal-800 for better contrast

  // --- Fetch Invoice Data (ORIGINAL LOGIC PRESERVED) ---
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

  // --- Calculations for Totals (ORIGINAL LOGIC PRESERVED) ---
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
    // Matching the format from the PDF: May 29, 2025 [cite: 21]
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Default Instruction/Notes from PDF [cite: 40, 41]
  const defaultInstructions =
    "Consulting Proforma Invoice for Steel Detailing of The 25-job- Cobb P.O #. All payments to be made to WHITEBOARD TECHNOLOGIES LLC in US Dollars via Wire Transfers within 15 days.";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 md:pt-10 font-sans">
      <div
        className={`bg-white w-[95vw] max-w-4xl rounded-xl shadow-2xl relative transition-all duration-300 transform max-h-[95vh] overflow-y-auto ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close Button - Moved slightly up to be outside the main padding */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-light text-gray-500 hover:text-red-500 z-50 transition bg-white rounded-full p-2 shadow-lg"
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
            className="p-8 md:p-12 text-sm text-gray-800"
          >
            {/* --- HEADER: LOGO, BRANDING & INVOICE DETAILS (Redesign based on PDF) --- */}
            <header className="flex justify-between items-end mb-10 pb-4 border-b-2 border-green-700">
              {/* Left: Logo & Tagline (Whiteboard Technologies LLC) [cite: 1, 50] */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <img
                    src="/src/assets/logo.png"
                    alt="Whiteboard Technologies LLC Logo"
                    className="h-24 w-auto"
                  />
                </div>
              </div>
            </header>

            {/* --- SUPPLIER (Billed From) & RECIPIENT (Billed To) DETAILS (Clean Vertical Split) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="p-4 border-l-4 border-gray-300 bg-gray-50 rounded-r-md">
                <h3 className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wider">
                  Details of Reciever (Billed To)
                </h3>

                <p className="text-xs text-gray-900 font-semibold">
                  Name:
                  {invoice?.customerName || "Whiteboard Technologies LLC"}
                </p>
                <p className="text-xs text-gray-900 font-semibold mt-1">
                  Address: {invoice?.address}
                </p>
                <div className="text-xs mt-1">
                  <div className="font-semibold w-full inline-block">
                    GSTIN/UNIQUE-ID:
                    {invoice?.GSTIN || "N/A"}
                  </div>
                  <p>
                    <div className="font-semibold w-full inline-block mt-1">
                      Place of Supply:
                      {invoice?.placeOfSupply || "Electronic"}
                    </div>
                  </p>
                </div>
              </div>

              {/* Right: Recipient Details (Billed To) - Highlighted with brand color [cite: 4] */}
              <div className="p-4 border-l-4 border-grey-600 bg-gray-50 rounded-r-md ">
                <div className="text-xs mt-3 space-y-1">
                  <p>
                    <div className="font-semibold w-full inline-block text-gray-900 mt-1">
                      Contact Name:
                      {invoice?.contactName || "Mr."}
                    </div>
                  </p>
                  <p>
                    <div className="font-semibold w-full inline-block text-gray-900">
                      Invoice No:
                      {invoice?.invoiceNumber || "Mr."}
                    </div>
                  </p>
                  <p className="mb-1 text-gray-900">
                    <span className="font-semibold">Date of Supply:</span>{" "}
                    <span className="font-bold text-gray-900">
                      {formatDate(invoice?.createdAt)}
                    </span>
                  </p>
                  <p className="mb-1 text-gray-900">
                    <span className="font-semibold">place of Supply:</span>{" "}
                    <span className="font-bold text-gray-900">
                      {invoice?.placeOfSupply}
                    </span>
                  </p>
                  <p className="text-gray-900">
                    <span className="font-semibold">Job Name:</span>{" "}
                    <span className="font-bold">
                      {invoice?.jobName || "The 25 jobs"}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg shadow-md">
              <table className="min-w-full text-sm">
                <thead
                  className={`bg-green-600 text-white uppercase text-xs tracking-wider`}
                >
                  <tr>
                    <th className="px-4 py-3 font-bold w-1/12 text-center rounded-tl-lg">
                      Sl. #
                    </th>
                    <th className="px-4 py-3 text-left w-5/12">
                      Description of Engineering Services{" "}
                    </th>
                    <th className="px-4 py-3 w-1/12 text-center">SAC</th>{" "}
                    <th className="px-4 py-3 w-1/12 text-center">Unit</th>{" "}
                    <th className="px-4 py-3 text-right w-2/12">Rate (USD)</th>{" "}
                    <th className="px-4 py-3 text-right w-2/12 rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.invoiceItems?.length > 0 ? (
                    invoice.invoiceItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-center">{idx + 1}</td>
                        <td className="px-4 py-3 text-left">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.sacCode || "998333"}{" "}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.unit || 1}{" "}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {parseFloat(item.rateUSD)?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold">
                          ${parseFloat(item.totalUSD)?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500 italic"
                      >
                        No invoice items found.
                      </td>
                    </tr>
                  )}

                  <tr className={`bg-gray-100 border-t border-gray-400`}>
                    <td
                      colSpan={5}
                      className="px-4 py-2 text-right text-gray-700 font-medium"
                    >
                      Subtotal (Before Tax)
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-base text-gray-800 font-semibold">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between flex-wrap">
              <div className="w-full md:w-[55%] space-y-4">
                {/* Total in Words */}
                <div className="p-3 border border-dashed border-green-500 rounded-md bg-green-50">
                  <p className="font-medium text-sm">
                    Total Invoice Value (in Words):{" "}
                    <span className="font-bold italic text-green-800">
                      {invoice?.TotalInvoiveValuesinWords ||
                        "US Dollars Not specified"}{" "}
                    </span>
                  </p>
                </div>

                {/* Instructions */}
                <div className="p-3 text-xs bg-gray-50 rounded-md border border-gray-200">
                  <p className="font-semibold text-gray-700 mb-1">
                    * Instructions/Notes:
                  </p>
                  <p className="text-gray-600">
                    {/* Using combined default instructions from PDF [cite: 40, 41] */}
                    {invoice?.instructions || defaultInstructions}
                  </p>
                </div>
              </div>

              {/* Right: Tax and Grand Total Box */}
              <div className="w-full md:w-[40%] mt-6 md:mt-0">
                <div className="border border-gray-400 rounded-lg overflow-hidden shadow-xl">
                  <div className="text-right text-sm">
                    <div className="flex justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
                      <span className="font-semibold text-gray-600">
                        IGST @ 18%:
                      </span>
                      <span className="font-mono text-red-600 font-bold">
                        ${igstAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between px-3 py-2 bg-gray-50">
                      <span className="font-semibold text-gray-600">
                        Total GST:
                      </span>
                      <span className="font-mono text-red-600 font-bold">
                        ${igstAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  
                  <div
                    className={`text-right text-lg font-extrabold bg-green-800 text-white p-3`}
                  >
                    <div className="flex justify-between items-center">
                      <span>TOTAL DUE (USD):</span>
                      <span className={`font-black font-mono text-3xl`}>
                        $
                        {(invoice?.TotalInvoiveValues
                          ? parseFloat(invoice.TotalInvoiveValues)
                          : grandTotal
                        )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BANK DETAILS / PAYMENT INSTRUCTIONS (Structured Two-Column) --- */}
            <div className="mt-12 pt-6 border-t border-gray-300">
              <h3
                className={`text-md font-bold text-gray-800 mb-4 border-b pb-1 text-light-green-700`}
              >
                ACH/Domestic Wire Instructions (USD Currency){" "}
                {/* Matches PDF title [cite: 52, 51] */}
              </h3>
              {bankDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        Recipient / Beneficiary:
                      </span>{" "}
                      <span className="font-bold">
                        {/* Data from PDF [cite: 53] */}
                        {bankDetails.beneficiaryInfo ||
                          "Whiteboard Technologies LLC."}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        Beneficiary Address:
                      </span>{" "}
                      {/* Data from PDF [cite: 53] */}
                      {bankDetails.beneficiaryAddress ||
                        "2055, Limestone Rd STE 200-C, Wilmington, DE, 19808."}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        Account Number:
                      </span>{" "}
                      <span className="font-bold font-mono">
                        {/* Data from PDF [cite: 53] */}
                        {bankDetails.accountNumber || "201408414172365"}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        Bank Name:
                      </span>{" "}
                      {/* Data from PDF [cite: 53] */}
                      {bankDetails.bankInfo || "Column Bank"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        Bank Address:
                      </span>{" "}
                      {/* Data from PDF [cite: 53] */}
                      {bankDetails.bankAddress ||
                        "1110, Gorgas Ave Suite A4-700, San Francisco, CA 94129."}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700 w-40 inline-block">
                        ABA/Routing Number:
                      </span>{" "}
                      <span className="font-bold font-mono">
                        {/* Data from PDF [cite: 53] */}
                        {bankDetails.abaRoutingNumber || "121145349"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-700 p-4 bg-red-100 rounded-lg border border-red-300">
                  Bank account details not available or not linked to this
                  invoice.
                </p>
              )}
            </div>

            {/* --- SIGNATURE / FINAL FOOTER (Refined) --- */}
            <div className="flex justify-between items-start mt-12 pt-4 border-t border-gray-200">
              {/* Left: Contact Info (Taken directly from PDF) [cite: 45, 46, 47] */}
              <div className="text-xs text-gray-600 space-y-1 w-1/2">
                <p className="font-bold text-gray-800 mb-2">
                  For any questions please contact Raj:
                </p>
                <p>
                  <span className="font-semibold w-12 inline-block">Tel:</span>{" "}
                  USA: +1 612.605.5833 | INDIA: +1 770.256.6888
                </p>
                <p>
                  <span className="font-semibold w-12 inline-block">
                    Email:
                  </span>{" "}
                  raj@whiteboardtec.com
                </p>
                <p>
                  <span className="font-semibold w-12 inline-block">Web:</span>{" "}
                  www.whiteboardtec.com
                </p>
                <p className="mt-4 italic text-gray-500">
                  Thank you for your business!
                </p>
              </div>

              {/* Right: Signature */}
              <div className="text-center w-auto">
                <p className={`font-semibold text-md `}>
                  For{" "}
                  {invoice?.customerName || "Whiteboard Technologies Pvt Ltd"}{" "}
                  {/* Matches PDF text [cite: 42] */}
                </p>
                <div className="h-10 border-b-2 border-green-700 w-48 mx-auto mt-4">
                  {/* Placeholder for Signature image */}
                </div>
                <p className="text-xs mt-1 font-semibold text-gray-700">
                  Authorised Signatory (
                  {invoice?.authorisingPerson || "Rajeshwari K"}){" "}
                  {/* Matches PDF text [cite: 44, 43] */}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-12 space-x-4 print:hidden">
              <Button
                onClick={onClose}
                className={`bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition duration-150`}
              >
                Close View
              </Button>
              <Button
                onClick={() => window.print()}
                className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-150`}
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
