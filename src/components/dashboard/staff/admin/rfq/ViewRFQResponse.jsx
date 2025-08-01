import React from "react";
import { useState } from "react";
import Button from "../../../../fields/Button";

const ViewRFQResponse = ({ onClose }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const handleViewModal = () => {
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-60">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[70vh] overflow-y-auto p-6 sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[30%] h-auto">
          <Button
            className="absolute flex items-center justify-center px-3 py-1 text-white transition bg-red-600 rounded-full shadow-md top-4 right-4 hover:bg-red-700"
            onClick={handleViewModal}
          >
            Close
          </Button>

          <h2 className="pb-2 mb-6 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
            Client Response Display
          </h2>

          <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              {[
                { label: "Description", value: "description" },
                { label: "Date", value: "Date" },
                { label: "Files", value: "Files" },
                { label: "Status", value: "Status" },
              ].map(({ label, value }) => (
                <div key={label} className="flex space-x-2">
                  <span className="font-medium text-gray-700 whitespace-nowrap">
                    {label}:
                  </span>
                  <span className="text-gray-600 truncate">
                    {value || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional: form elements can go here */}
        </div>
      </div>
    </>
  );
};

export default ViewRFQResponse;
