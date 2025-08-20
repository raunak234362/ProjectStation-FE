/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CoDetail from "./details/CoDetail";
import CoListTable from "./details/CoListTable";
import SendCoTable from "./SendCoTable";
import Button from "../fields/Button";

const GetCo = ({ initialSelectedCO, onClose, fetchCO }) => {
  const [selectedCO, setSelectedCO] = useState(initialSelectedCO);

  // When initialSelectedCO changes, sync state
  useEffect(() => {
    setSelectedCO(initialSelectedCO);
  }, [initialSelectedCO]);

  // Function to refresh selectedCO from backend after editing
  const refreshSelectedCO = async () => {
    try {
      const freshData = await fetchCO(); // fetchCO returns updated list or item
      console.log("Refreshed CO Data:", freshData);
      const updatedCO = freshData?.find((co) => co.id === selectedCO.id);
      if (updatedCO) setSelectedCO(updatedCO);
    } catch (error) {
      console.error("Failed to refresh selected CO:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-2 md:p-1 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-t-md">
          <div className="text-lg text-white font-medium">
            <span className="font-bold">Subject:</span>{" "}
            {selectedCO?.remarks || "N/A"}
          </div>
          <button
            className="p-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-5 pb-6 overflow-y-auto h-full space-y-6">
          <CoDetail
            selectedCO={selectedCO}
            fetchCO={refreshSelectedCO} // Pass refresh to CoDetail
          />
          <div className="border-t pt-4">
            <Button>Approve & Procceed</Button>
          </div>
          {Array.isArray(selectedCO?.CoRefersTo) &&
          selectedCO.CoRefersTo.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Related Change Orders
              </h3>
              <CoListTable
                selectedCO={selectedCO}
                fetchCO={refreshSelectedCO}
              />
            </div>
          ) : (
            <SendCoTable data={selectedCO} fetchCO={fetchCO} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetCo;
