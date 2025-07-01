/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button } from "../index";
import { toast } from "react-toastify";
import Service from "../../config/Service";
import RFIResponse from "./response/RFIResponse";
import { X } from "lucide-react";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "Not available"}</span>
  </div>
);

const FileLinks = ({ files, rfiId, isResponse = false, responseId = null }) => {
  if (!Array.isArray(files)) return "Not available";

  const baseURL = import.meta.env.VITE_BASE_URL;

  return files.map((file, index) => {
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
  const [loading, setLoading] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const fetchRFI = async () => {
    try {
      setLoading(true); // ✅ Correct
      const response = await Service.fetchRFIById(rfiId);
      console.log("Fetched RFI:", response?.data);
      setRFI(response?.data);
    } catch (error) {
      toast.error("Failed to fetch RFI");
      console.error("Error fetching RFI:", error);
    } finally {
      setLoading(false); // ✅ This should come after try/catch
    }
  };

  useEffect(() => {
    fetchRFI();
  }, [rfiId, isOpen]);

  if (!isOpen) return null;

  if (loading || !rfi) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          Loading RFI details...
        </div>
      </div>
    );
  }

  const { recepients, rfiresponse, id: rfiID } = rfi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[90%] w-11/12 max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-lg text-white">
            <span className="font-bold">Subject:</span> {rfi?.subject}
          </div>
          <button
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto h-full space-y-6">
          {/* Client Details */}
          {/* <div className="p-5 rounded-lg shadow bg-gray-100/50">
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
                <InfoItem
                  label="Fabricator"
                  value={recepients?.fabricator?.fabName}
                />
                <InfoItem
                  label="Branch Address"
                  value={recepients?.fabricator?.headquaters?.address}
                />
                <InfoItem label="Country" value={recepients.country} />
                <InfoItem label="State" value={recepients.state} />
                <InfoItem label="City" value={recepients.city} />
              </div>
            )}
          </div> */}

          {/* RFI Details */}
          <div className="p-5 rounded-lg shadow bg-gray-100/50">
            <h2 className="mb-4 text-lg font-semibold">RFI Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Subject" value={rfi.subject} />
              <InfoItem label="Description" value={rfi.description} />
              <InfoItem
                label="Date"
                value={new Date(rfi.date).toLocaleDateString()}
              />
              <InfoItem
                label="Status"
                value={rfi.status ? "No Reply" : "Replied"}
              />
              <InfoItem
                label="Files"
                value={<FileLinks files={rfi.files} rfiId={rfiID} />}
              />
            </div>
          </div>

          {/* RFI Response */}
          <RFIResponse rfiResponse={rfiresponse} rfi={rfi} />
        </div>
      </div>
    </div>
  );
};

export default GetRFI;
