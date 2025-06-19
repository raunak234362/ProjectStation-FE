/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import MultipleFileUpload from "../../../../fields/MultipleFileUpload";
import Input from "../../../../fields/Input";
import { AllRFQ, CustomSelect } from "../../../..";
import { Button } from "@material-tailwind/react";
import { NavLink, Outlet } from "react-router-dom";
import AddNewRFQ from "./AddNewRFQ";

const SalesRFQ = () => {
  const [activeTab, setActiveTab] = useState("rfqReceived")
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);


  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full h-[89vh] overflow-y-hidden ">
      {/* Menu Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto bg-white shadow-md">
          <button
            className={`px-4 py-2 font-medium text-md whitespace-nowrap ${activeTab === "addRFQ"
              ? "text-white border-b-2 border-teal-600 bg-teal-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setActiveTab("addRFQ")}
          >
            Add New RFQ
          </button>
          <button
            className={`px-4 py-2 font-medium text-md whitespace-nowrap ${activeTab === "rfqReceived"
              ? "text-white border-b-2 border-teal-600 bg-teal-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setActiveTab("rfqReceived")}
          >
            RFQ Received
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "addRFQ" && (
        <AddNewRFQ />
      )}
      {activeTab === "rfqReceived" && (
        <AllRFQ/>
      )

      }
    </div>
  );
};

export default SalesRFQ;
