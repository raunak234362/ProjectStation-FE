/* eslint-disable react/prop-types */

import { useState } from "react";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import AllInvoice from "../../components/invoices/AllInvoice";

const RFQ = () => {
  //   console.log("RFQ Component Rendered with projectData:", projectData);
  const [activeTab, setActiveTab] = useState("allInvoice");
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">Invoice Detail</h1>
          <div className="flex space-x-4 overflow-x-auto">
            {userType === "client" ? null : (
              <button
                onClick={() => setActiveTab("addInvoice")}
                className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "addInvoice"
                    ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                    : "md:text-base text-sm bg-white"
                  }`}
              >
                Add Projects Invoice
              </button>
            )}
            <button
              onClick={() => setActiveTab("allInvoice")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allInvoice"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
                }`}
            >
              All Invoices
            </button>
          </div>
        </div>
        <div className="flex-grow p-2">
          {activeTab === "addInvoice" && (
            <div>
              <InvoiceForm />
            </div>
          )}
          {activeTab === "allInvoice" && (
            <div>
              {" "}
              <AllInvoice />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQ;
