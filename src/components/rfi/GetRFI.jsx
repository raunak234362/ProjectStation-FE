/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Button } from "../index";
import api from "../../config/api";
import { toast } from "react-toastify";
import Service from "../../config/Service";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const FileLinks = ({ files, rfiId, isResponse = false, responseId = null }) => {
  if (!Array.isArray(files)) return "Not available";

  return files.map((file, index) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const fileUrl = isResponse
      ? `${baseURL}/api/RFI/rfi/response/viewfile/${responseId}/${file.id}`
      : `${baseURL}/api/RFI/rfi/viewfile/${rfiId}/${file.id}`;

    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-teal-600 hover:underline"
      >
        {file.originalName || `File ${index + 1}`}
      </a>
    );
  });
};

const GetRFI = ({ rfiId, isOpen, onClose }) => {
  const [rfi, setRFI] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const fetchRFI = async () => {
    try {
      const response = await Service.GetRFI;
      setRFI(response?.data?.data || null);
    } catch (error) {
      toast.error("Failed to fetch RFI");
      console.error("Error fetching RFI:", error);
    }
  };

  useEffect(() => {
    if (rfiId) fetchRFI();
  }, [rfiId]);

  if (!isOpen || !rfi) return null;

  const { recepients, rfiresponse, id: rfiID } = rfi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[90%] w-11/12 max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex md:flex-row flex-col items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-xl font-bold  text-white">
            Subject/Remarks: {rfi?.subject || "Unknown"}
          </div>
          <Button className="bg-red-500" onClick={() => onClose(true)}>
            Close
          </Button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto h-full space-y-6">
          {/* Subject */}


          {/* Client Details */}
          <div className="p-5 rounded-lg shadow bg-gray-100/50">
            <h2 className="text-lg font-semibold flex items-center justify-between">
              Client Details
              <button
                onClick={() => setShowClientDetails(!showClientDetails)}
                className="text-sm text-blue-600 underline"
              >
                {showClientDetails ? "Hide" : "Show"} client details
              </button>
            </h2>

            {showClientDetails && recepients && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Client Name" value={recepients.f_name} />
                <InfoItem label="Email" value={recepients.email} />
                <InfoItem label="Fabricator" value={recepients?.fabricator?.fabName} />
                <InfoItem label="Branch Address" value={recepients?.fabricator?.headquaters?.address} />
                <InfoItem label="Country" value={recepients.country} />
                <InfoItem label="State" value={recepients.state} />
                <InfoItem label="City" value={recepients.city} />
              </div>
            )}
          </div>

          {/* RFI Details */}
          <div className="p-5 rounded-lg shadow bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Subject" value={rfi.subject} />
              <InfoItem label="Description" value={rfi.description} />
              <InfoItem label="Date" value={rfi.date} />
              <InfoItem label="Status" value={rfi.status ? "No Reply" : "Replied"} />
              <InfoItem
                label="Files"
                value={<FileLinks files={rfi.files} rfiId={rfiID} />}
              />
            </div>
          </div>

          {/* RFI Response */}
          <div className="p-5 rounded-lg shadow bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Response</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Date" value={rfiresponse?.createdAt} />
              <InfoItem label="Description" value={rfiresponse?.reason} />
              <InfoItem label="Status" value={rfiresponse?.responseState} />
              <InfoItem
                label="Files"
                value={
                  <FileLinks
                    files={rfiresponse?.files}
                    rfiId={rfiID}
                    isResponse
                    responseId={rfiresponse?.id}
                  />
                }
              />
            </div>
          </div>

          {/* Future Section Placeholder */}
          <div className="p-5 bg-gray-200 rounded-lg shadow-md">
            <h2 className="font-bold text-sm">Respond to Status (coming soon)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetRFI;
