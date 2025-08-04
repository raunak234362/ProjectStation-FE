/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import SendCO from "./SendCO";

const CO = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState('sendCO');


  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('sendCO')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "sendCO"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Send CO
            </button>
            <button
              onClick={() => setActiveTab('allCO')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "allCO"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              View CO
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === 'sendCO' && (
            <div>
              <SendCO projectData={projectData} />
            </div>
          )}
          {/* {activeTab === 'allCO' && (
            <div>
              <AllRFI projectData={projectData} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default CO
