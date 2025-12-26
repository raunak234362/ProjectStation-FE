/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import SendCO from "./SendCO";
import Service from "../../config/Service";
import ListOfCO from "./ListOfCO";
import { useSignals } from "@preact/signals-react/runtime";
import { coList, coLoading, coError, setCOs } from "../../signals";

const CO = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState("allCO");
  const userType = sessionStorage.getItem("userType");
  useSignals();
  const projectID = projectData.id;

  // Fetch CO data from backend
  const fetchCO = useCallback(async () => {
    try {
      coLoading.value = true;
      const response = await Service.getListOfAllCOByProjectId(projectID);
      setCOs(response.data);
      coError.value = null;
      console.log("Fetched CO Data:", response.data);
    } catch (error) {
      console.error("Error fetching CO data:", error);
      setCOs([]);
      coError.value = "Failed to fetch CO";
    } finally {
      coLoading.value = false;
    }
  }, [projectID]);

  useEffect(() => {
    fetchCO();
  }, [fetchCO]);

  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            {userType === "client" || userType === "staff" ? null : (
              <button
                onClick={() => setActiveTab("sendCO")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "sendCO"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Send CO
              </button>
            )}
            <button
              onClick={() => setActiveTab("allCO")}
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
          {activeTab === "sendCO" && (
            <div>
              <SendCO projectData={projectData} fetchCO={fetchCO} setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "allCO" && (
            <div key={(coList.value || []).length}>
              <ListOfCO
                coData={
                  userType === "client"
                    ? (coList.value || []).filter((co) => co.isAproovedByAdmin === true)
                    : (coList.value || [])
                }
                fetchCO={fetchCO}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CO;
