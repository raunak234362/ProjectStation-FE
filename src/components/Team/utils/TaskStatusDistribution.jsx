/* eslint-disable react/prop-types */
import { PieChart } from "lucide-react";

const TaskStatusDistribution = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center mb-4">
        <PieChart className="h-5 w-5 text-teal-500 mr-2" />
        <h3 className="text-md font-medium text-gray-800">
          Task Status Distribution
        </h3>
      </div>
      {stats?.tasksByStatus && Object.keys(stats.tasksByStatus).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(stats.tasksByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {status}
                </span>
                <span className="text-xs text-gray-500">
                  {count} tasks ({Math.round((count / stats.taskCount) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    status === "COMPLETE"
                      ? "bg-green-500"
                      : status === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : status === "IN_REVIEW"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                  style={{
                    width: `${(count / stats.taskCount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No task data available for the selected period
        </p>
      )}
    </div>
  );
};

export default TaskStatusDistribution;