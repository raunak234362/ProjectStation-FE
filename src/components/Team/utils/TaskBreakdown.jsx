/* eslint-disable react/prop-types */
import { useState } from "react";

const TasksBreakdown = ({ tasks, parseDurationToMinutes }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const formatDurationToHoursMinutes = (duration) => {
    if (!duration) return "00 hrs 00 mins";
  
    const [hours, minutes] = duration.split(":").map(Number);
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
  
    return `${formattedHours} hrs ${formattedMinutes} mins`;
  };
  
  const formatToHoursMinutes = (val) => {
    if (!val && val !== 0) return "00 hrs 00 mins";
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    return `${hrs.toString().padStart(2, "0")} hrs ${mins
      .toString()
      .padStart(2, "0")} mins`;
  };
  
  // Sort tasks by created_on date in descending order (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.created_on) - new Date(a.created_on);
  });

  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-800">Tasks</h3>
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
          {tasks.length} total
        </span>
      </div>

      <div className="overflow-y-auto max-h-96">
        {sortedTasks.length > 0 ? (
          <ul className="divide-y divide-gray-200 px-5">
            {sortedTasks.map((task, index) => {
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
                        {task.name || `Task ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.description?.substring(0, 60) || "No description"}
                        {task.description?.length > 60 ? "..." : ""}
                      </p>
                      {task.created_on && (
                        <p className="text-xs font-bold text-gray-600 mt-1">
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
                            : task.status === "ASSIGNED"
                            ? "bg-orange-100 text-orange-800"
                            : task.status === "IN_REVIEW"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Total Assigned Hours:{" "}
                        {formatDurationToHoursMinutes(task.duration)}
                      </span>
                      {(() => {
                        const assignedMinutes = task.duration
                          ? parseDurationToMinutes(task.duration)
                          : 0;
                        const workingMinutes = task.workingHourTask
                          ? task.workingHourTask.reduce(
                              (total, hour) =>
                                total + (hour.duration || 0),
                              0
                            )
                          : 0;
                        const diffMinutes = workingMinutes - assignedMinutes;
                        const workingHours = (workingMinutes / 60).toFixed(2);
                        const isOverLimit = diffMinutes > 20;
                        return (
                          <span
                            className={`text-xs mt-1 ${
                              isOverLimit ? "text-red-600" : "text-gray-500"
                            }`}
                          >   
                            Total Working Hours: {formatToHoursMinutes(workingHours)}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Expandable Comments */}
                  {isExpanded && (
                    task["taskcomment"]?.length > 0 ? (
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
                    ) : (
                      <div className="mt-3 pl-4 pr-2 py-2 bg-gray-50 border-l-4 border-teal-400 rounded shadow-sm text-xs text-gray-700">
                        No comments available for this task.
                      </div>
                    )
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