/* eslint-disable react/prop-types */

import { useState } from "react";
import AddRFQ from "../../components/rfq/AddRFQ";
import AllRFQ from "../../components/rfq/AllRFQ";

const RFQ = () => {
  //   console.log("RFQ Component Rendered with projectData:", projectData);
  const [activeTab, setActiveTab] = useState("InvoiceRemainder");

  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">Invoice Detail</h1>
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("addRFQ")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${
                activeTab === "addRFQ"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
              }`}
            >
              Invoice Projects
            </button>
            <button
              onClick={() => setActiveTab("allRFQ")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${
                activeTab === "allRFQ"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
              }`}
            >
              View Invoices
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "addRFQ" && (
            <div>
              <AddRFQ />
            </div>
          )}
          {activeTab === "InvoiceRemainder" && (
            <div>
              {" "}
              <AllRFQ />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQ;
