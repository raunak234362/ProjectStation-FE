/* eslint-disable react/prop-types */
const TaskDistribution = ({ teamStats }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Task Status Distribution
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        {teamStats.totalTasks > 0 ? (
          <div className="space-y-4">
            {/* Completed Tasks */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Completed
                </span>
                <span className="text-sm text-gray-500">
                  {teamStats.completedTasks} (
                  {Math.round(
                    (teamStats.completedTasks / teamStats.totalTasks) * 100
                  )}
                  %)
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      (teamStats.completedTasks / teamStats.totalTasks) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  In Progress
                </span>
                <span className="text-sm text-gray-500">
                  {teamStats.inProgressTasks} (
                  {Math.round(
                    (teamStats.inProgressTasks / teamStats.totalTasks) * 100
                  )}
                  %)
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      (teamStats.inProgressTasks / teamStats.totalTasks) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Other Tasks */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Other</span>
                <span className="text-sm text-gray-500">
                  {teamStats.totalTasks -
                    teamStats.completedTasks -
                    teamStats.inProgressTasks}{" "}
                  (
                  {Math.round(
                    ((teamStats.totalTasks -
                      teamStats.completedTasks -
                      teamStats.inProgressTasks) /
                      teamStats.totalTasks) *
                      100
                  )}
                  %)
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-500 rounded-full"
                  style={{
                    width: `${
                      ((teamStats.totalTasks -
                        teamStats.completedTasks -
                        teamStats.inProgressTasks) /
                        teamStats.totalTasks) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 italic">
            No task data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDistribution;
