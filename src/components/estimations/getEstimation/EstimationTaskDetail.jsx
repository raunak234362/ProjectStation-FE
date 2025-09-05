/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import Service from "../../../config/Service";

// Helper to format date
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleString() : "—";

const EstimationTaskDetail = ({ estimation }) => {
  const [estimationTask, setEstimationTask] = useState();

  const fetchEstimation = async () => {
    try {
      const response = await Service.getEstimationTasksById(estimation.id);
      console.log("Fetched Estimation:", response);
      setEstimationTask(response);
    } catch (error) {
      console.error("Error fetching estimation:", error);
    }
  };
  useEffect(() => {
    fetchEstimation();
  }, []);

  console.log("Estimation Task Detail Data:", estimation);
  console.log("Estimation Task Detail Data:=========", estimationTask);

  // Display assigned user info fallback
  const assignedTo =
    estimation.assignedTo?.username || estimation.assignedToId || "—";

  return (
    <div className="w-full h-[60vh] overflow-y-auto mx-auto my-5 bg-white rounded-lg shadow border p-5">
      <h2 className="text-lg font-bold text-teal-700 mb-4">
        Estimation Task Details
      </h2>
      <div className="space-y-4">
        {/* Task Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Task Status:</span>
            <div className="text-gray-800 font-semibold">
              {estimationTask?.status}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Assigned To:</span>
            <div className="text-gray-800 font-semibold">
              {estimationTask?.assignedTo?.f_name}{" "}
              {estimationTask?.assignedTo?.m_name}{" "}
              {estimationTask?.assignedTo?.l_name}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Start Date:</span>
            <div className="text-gray-800">
              {formatDate(estimationTask?.startDate)}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">End Date:</span>
            <div className="text-gray-800">
              {formatDate(estimationTask?.endDate)}
            </div>
          </div>
        </div>

        {/* Estimation Info */}
        <div>
          <span className="font-medium text-gray-700">Estimation Number:</span>
          <div className="text-gray-800">
            {estimationTask?.estimation?.estimationNumber || "—"}
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Project Name:</span>
          <div className="text-gray-800">
            {estimationTask?.estimation?.projectName || "—"}
          </div>
        </div>
        {/* Additional Notes */}
        <div>
          <span className="font-medium text-gray-700">Notes:</span>
          <div className="text-gray-800">{estimationTask?.notes || "—"}</div>
        </div>
        {/* Working Hours */}
        <div>
          <span className="font-medium text-gray-700">Working Hours:</span>
          <div className="text-gray-800">
            {Array.isArray(estimationTask?.workinghours) &&
            estimationTask?.workinghours.length > 0
              ? estimation.workinghours
                  .map(
                    (wh) =>
                      `User: ${wh.user_id || "—"}, Hours: ${wh.hours || "—"}`
                  )
                  .join(" | ")
              : "—"}
          </div>
        </div>
        {/* Reviewed Info */}
        <div>
          <span className="font-medium text-gray-700">Reviewed By:</span>
          <div className="text-gray-800">
            {estimation.reviewedBy?.username || estimation.reviewedById || "—"}
          </div>
        </div>
        {/* Review Notes */}
        <div>
          <span className="font-medium text-gray-700">Review Notes:</span>
          <div className="text-gray-800">{estimation.reviewNotes || "—"}</div>
        </div>
        {/* Files */}
        <div>
          <span className="font-medium text-gray-700">Files:</span>
          <div className="text-gray-800">
            {Array.isArray(estimation.files) && estimation.files.length > 0
              ? estimation.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mr-2"
                  >
                    {file.name || "File"}
                  </a>
                ))
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationTaskDetail;
