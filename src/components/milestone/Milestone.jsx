/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import AddMilestone from "./AddMilestone";
import AllMilestone from "./AllMilestone";
import Service from "../../config/Service";
// import { useSignal } from "@preact/signals-react";
import { milestoneData } from "../../signals/projectData";
import { useSignals } from "@preact/signals-react/runtime";
import toast from "react-hot-toast";

const Milestone = ({ projectData }) => {
  useSignals();
  const [activeTab, setActiveTab] = useState("allMilestone");
  const projectId = projectData?.id; // Accessing project ID from props
  const fabricationId = projectData?.fabricatorID; // Accessing fabrication ID from props

  const fetchMilestones = async () => {
    // Fetch milestones based on projectId
    if (projectId && fabricationId) {
      try {
        const response = await Service.getMilestoneByProjectId(projectId);
        milestoneData.value = response.data || []; // Ensure array is set
        console.log("Fetched Milestones:", response);
      } catch (error) {
        console.error("Error fetching milestones:", error);
        milestoneData.value = []; // Fallback to empty array on error
      }
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId, fabricationId]);

  const onSubmit = async (data) => {
    // Handle form submission from AddMilestone
    console.log("Form Data Submitted:", data);
    const response = await Service.addMilestone(data, projectId, fabricationId);
    toast.success("Milestone added successfully");
    milestoneData.value = [...milestoneData.value, response.data];
    console.log("Response from addMilestone API:", response.data);
  };
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("addMilestone")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "addMilestone"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Add Milestone
            </button>
            <button
              onClick={() => setActiveTab("allMilestone")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "allMilestone"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View Milestone
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "addMilestone" && (
            <div>
              <AddMilestone projectData={projectData} onSubmit={onSubmit} />
            </div>
          )}
          {activeTab === "allMilestone" && (
            <div>
              <AllMilestone
                projectData={projectData}
                milestoneData={milestoneData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Milestone;
