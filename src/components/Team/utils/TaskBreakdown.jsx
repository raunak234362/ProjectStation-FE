/* eslint-disable react/prop-types */
import { useState } from "react";

const TasksBreakdown = ({ tasks, parseDurationToMinutes }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-800">Tasks</h3>
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
          {tasks.length} total
        </span>
      </div>

      <div className="overflow-y-auto max-h-96">
        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200 px-5">
            {tasks.map((task, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <li
                  key={index}
                  className="py-3 text-sm cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {task.title || `Task ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.description?.substring(0, 60) || "No description"}
                        {task.description?.length > 60 ? "..." : ""}
                      </p>
                      {task.created_on && (
                        <p className="text-xs text-gray-400 mt-1">
                          Created:{" "}
                          {new Date(task.created_on).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "COMPLETE"
                            ? "bg-green-100 text-green-800"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "IN_REVIEW"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Total Assigned Hours:{" "}
                        {task.duration
                          ? (
                              parseDurationToMinutes(task.duration) / 60
                            ).toFixed(2)
                          : 0}{" "}
                        hrs
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Total Working Hours:{" "}
                        {task.workingHourTask
                          ? task.workingHourTask
                              .reduce(
                                (total, hour) =>
                                  total + (hour.duration / 60 || 0),
                                0
                              )
                              .toFixed(2)
                          : "0.00"}{" "}
                        hrs
                      </span>
                    </div>
                  </div>

                  {/* Expandable Comments */}
                  {isExpanded && task["taskcomment"]?.length > 0 && (
                    <div className="mt-3 pl-4 pr-2 py-2 bg-gray-50 border-l-4 border-teal-400 rounded shadow-sm space-y-2 text-xs text-gray-700">
                      {task["taskcomment"].map((comment, i) => (
                        <div key={i}>
                          <span className="font-semibold text-gray-800">
                            {`${comment.user?.f_name || ""} ${
                              comment.user?.m_name || ""
                            } ${comment.user?.l_name || ""}`.trim()}
                            :
                          </span>{" "}
                          {comment.data}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No tasks found for the selected period
          </p>
        )}
      </div>
    </div>
  );
};

export default TasksBreakdown;
