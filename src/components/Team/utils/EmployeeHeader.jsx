/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import Button from "../../fields/Button";

const EmployeeHeader = ({ onClose }) => {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <h2 className="text-lg font-bold bg-teal-400 px-3 py-2 rounded-lg shadow-md text-white">
        Employee Status
      </h2>
      <Button
        className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
        onClick={onClose}
      >
        <X size={16} /> Close
      </Button>
    </div>
  );
};

export default EmployeeHeader;
