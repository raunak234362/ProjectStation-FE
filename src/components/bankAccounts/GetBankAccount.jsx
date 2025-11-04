/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Service from "../../config/Service.js";
import { Button } from "../index.js";

const GetBankAccount = ({ bankId, isOpen, onClose }) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBankDetails = async () => {
    try {
      const response = await Service.FetchBankById(bankId);
      console.log("Fetched Bank Details:", response.data);
      setBankDetails(response?.data[0] || response);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bankId && isOpen) {
      getBankDetails();
    }
  }, [bankId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-3xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">
          Bank Account Details
        </h2>

        {/* Loader */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : !bankDetails ? (
          <div className="text-center text-red-500 py-8">
            Failed to load bank details.
          </div>
        ) : (
          <div className="space-y-6 text-gray-700">
            {/* Invoice Info */}
            {/* <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">
                Linked Invoice
              </h3>
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {bankDetails.invoiceNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Invoice ID:</span>{" "}
                {bankDetails.invoiceId || "N/A"}
              </p>
            </div> */}

            {/* Beneficiary Info */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">
                Beneficiary Information
              </h3>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {bankDetails.beneficiaryInfo || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {bankDetails.beneficiaryAddress || "N/A"}
              </p>
            </div>

            {/* Bank Info */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <span className="font-medium">Bank Name:</span>{" "}
                  {bankDetails.bankInfo || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Bank Address:</span>{" "}
                  {bankDetails.bankAddress || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Account Number:</span>{" "}
                  {bankDetails.accountNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Account Type:</span>{" "}
                  {bankDetails.accountType || "N/A"}
                </p>
                <p>
                  <span className="font-medium">ABA Routing No:</span>{" "}
                  {bankDetails.abaRoutingNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="flex justify-end mt-8">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetBankAccount;
