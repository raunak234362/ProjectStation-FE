/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import Button from "../../fields/Button";
import EstimationDetail from "./EstimationDetail";
import AddEstimationTask from "./AddEstimationTask";
import EstimationTaskList from "./EstimationTaskList";

const GetEstimation = ({ estimation, onClose }) => {
  const [activeTab, setActiveTab] = useState("estimationDetail");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="my-3 border-b flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {[
              { key: "estimationDetail", label: "Estimation Details" },
              { key: "addEstimationTask", label: "Add Estimation Task" },
              { key: "estimationTaskList", label: "Estimation Task List" },
            ].map(({ key, label }) => (
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
        {activeTab === "estimationDetail" && (<EstimationDetail estimationId={estimation.id} />)}
        {activeTab === "addEstimationTask" && (<AddEstimationTask estimationId={estimation.id} />)}
        {activeTab === "estimationTaskList" && (<EstimationTaskList estimationId={estimation.id} />)}

      </div>
    </div>
  );
};

export default GetEstimation;
