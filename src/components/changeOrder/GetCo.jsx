/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import CoDetail from "./details/CoDetail";
import CoListTable from "./details/CoListTable";
import SendCoTable from "./SendCoTable";

const GetCo = ({ selectedCO, onClose }) => {
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
          <CoDetail selectedCO={selectedCO} />
          {selectedCO.CoRefersTo <1 ?(
            <div>
              <h3 className="text-lg font-semibold mb-2">Related Change Orders</h3>
              <CoListTable selectedCO={selectedCO} />
            </div>
          ):(
            <SendCoTable data={selectedCO} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetCo;
