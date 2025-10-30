/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Button from "../../fields/Button";
import EstimationDetail from "./EstimationDetail";
import AddEstimationTask from "./AddEstimationTask";
import EstimationTaskList from "./EstimationTaskList";
import Service from "../../../config/Service";
import { useSignals } from "@preact/signals-react/runtime";
import { estimationSignal } from "../../../signals";

const GetEstimation = ({ estimation, onClose }) => {
  useSignals();
  const [estimationTaskData, setEstimationTaskData] = useState(null);
  const estimationTask = estimationTaskData 
  console.log("Selected Estimation:", estimationTaskData);
  const getEstimation = async () => {
    try {
      const data = await Service.getEstimationById(estimation.id);
      setEstimationTaskData(data);
      estimationSignal.value = data; // publish to signal for real-time subscribers
    } catch (error) {
      console.error("Error fetching estimation:", error);
    }
  };
  useEffect(() => {
    getEstimation();
  }, [estimation]);

  console.log("Estimation Detail-=-=-=-=-:", estimation);
  console.log("Estimation Detail Data:", estimationTaskData);

  const [activeTab, setActiveTab] = useState("estimationDetail");
  // Example: get user role from localStorage or context
  const userRole = sessionStorage.getItem("userType"); // adjust as needed

  // Define tabs based on role
  const tabs = [
    { key: "estimationDetail", label: "Estimation Details" },
    ...(userRole === "estimator-head" || userRole === "admin" || userRole === "department-manager"
      ? [{ key: "addEstimationTask", label: "Add Estimation Task" }]
      : []),
    { key: "estimationTaskList", label: "Estimation Task List" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="my-3 border-b flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === key
                    ? "bg-teal-500 text-white font-semibold rounded-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
        {activeTab === "estimationDetail" && (
          <EstimationDetail estimationFetch={getEstimation} estimationId={estimation.id} />
        )}
        {activeTab === "addEstimationTask" && (
          <AddEstimationTask estimationFetch={getEstimation} estimationId={estimation.id} />
        )}
        {activeTab === "estimationTaskList" && (
          <EstimationTaskList estimationFetch={getEstimation} estimation={estimationTask} />
        )}
      </div>
    </div>
  );
};

export default GetEstimation;
