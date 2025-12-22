/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import AddMilestone from "./AddMilestone";
import AllMilestone from "./AllMilestone";
import Service from "../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { showMilestones, addMilestone } from "../../store/projectSlice";
import { milestoneData } from "../../signals/projectData";
import { useSignals } from "@preact/signals-react/runtime";
import toast from "react-hot-toast";

const Milestone = ({ projectData }) => {
  useSignals();
  const dispatch = useDispatch();
  const milestones = useSelector((state) => state.projectData.milestones);
  const [activeTab, setActiveTab] = useState("allMilestone");
  const projectId = projectData?.id;
  const fabricationId = projectData?.fabricatorID;

  // Sync Redux state with signal
  useEffect(() => {
    milestoneData.value = milestones;
  }, [milestones]);

  const fetchMilestones = async () => {
    if (projectId) {
      try {
        const response = await Service.getMilestoneByProjectId(projectId);
        const data = response.data || [];
        dispatch(showMilestones(data));
        console.log("Fetched Milestones:", data);
      } catch (error) {
        console.error("Error fetching milestones:", error);
        dispatch(showMilestones([]));
      }
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId, fabricationId]);

  const onSubmit = async (data) => {
    try {
      console.log("Form Data Submitted:", data);
      const response = await Service.addMilestone(data, projectId, fabricationId);
      toast.success("Milestone added successfully");
      dispatch(addMilestone(response.data));
      console.log("Response from addMilestone API:", response.data);
      setActiveTab("allMilestone");
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("Failed to add milestone");
    }
  };
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start border-b rounded-md ">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("addMilestone")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "addMilestone"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Add Milestone
            </button>
            <button
              onClick={() => setActiveTab("allMilestone")}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "allMilestone"
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
