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
      setBankDetails(response?.data[0] || response);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bankId && isOpen) getBankDetails();
  }, [bankId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-3xl rounded-xl shadow-xl p-6 relative">
        
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-red-600">
          ✕
        </button>

        <h2 className="text-2xl font-bold text-teal-700 border-b pb-2 mb-6">
          Bank Account Details
        </h2>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : !bankDetails ? (
          <p className="text-center py-8 text-red-500">No data found.</p>
        ) : (
          <div className="space-y-6">

            {/* Beneficiary */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">Beneficiary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Name:</span> {bankDetails.accountName || "N/A"}</p>
                <p><span className="font-medium">Beneficiary Info:</span> {bankDetails.beneficiaryInfo || "N/A"}</p>
                <p><span className="font-medium">Address:</span> {bankDetails.beneficiaryAddress || "N/A"}</p>
              </div>
            </div>

            {/* Bank */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Bank Name:</span> {bankDetails.bankInfo || "N/A"}</p>
                <p><span className="font-medium">Bank Address:</span> {bankDetails.bankAddress || "N/A"}</p>
                <p><span className="font-medium">Institution Number:</span> {bankDetails.institutionNumber || "N/A"}</p>
                <p><span className="font-medium">Transit Number:</span> {bankDetails.transitNumber || "N/A"}</p>
              </div>
            </div>

            {/* Account */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-teal-600 mb-2">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Account Number:</span> {bankDetails.accountNumber || "N/A"}</p>
                <p><span className="font-medium">Account Type:</span> {bankDetails.accountType || "N/A"}</p>
                <p><span className="font-medium">ABA Routing Number:</span> {bankDetails.abaRoutingNumber || "N/A"}</p>
              </div>
            </div>

          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button onClick={onClose} className="bg-teal-600 text-white hover:bg-teal-700 px-6 py-2 rounded-lg">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetBankAccount;
