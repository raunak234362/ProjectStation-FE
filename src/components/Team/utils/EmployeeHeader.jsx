/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import Button from "../../fields/Button";

const EmployeeHeader = ({ onClose }) => {
  return (
    <div className="sticky top-0 z-10 flex md:flex-row flex-col items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
      <h2 className="text-lg font-bold text-white">
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
