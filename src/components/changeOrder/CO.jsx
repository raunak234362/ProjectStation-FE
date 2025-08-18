/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import SendCO from "./SendCO";
import Service from "../../config/Service";
import SendCoTable from "./SendCoTable";
import ListOfCO from "./ListOfCO";

const CO = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState("allCO");
  const [coData, setCoData] = useState([]);

  const projectID = projectData.id;

  const fetchCO = async () => {
    try {
      const response = await Service.getListOfAllCOByProjectId(projectID);
      setCoData(response.data);
    } catch (error) {
      console.error("Error fetching CO data:", error);
    }
  };
  useEffect(() => {
    fetchCO();
  }, [projectID]);

  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("sendCO")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sendCO"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Send CO
            </button>
            <button
              onClick={() => setActiveTab("allCO")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "allCO"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View CO
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "sendCO" && (
            <div>
              <SendCO projectData={projectData} />
            </div>
          )}
          {activeTab === 'allCO' && (
            <div>
              <ListOfCO coData={coData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CO;
