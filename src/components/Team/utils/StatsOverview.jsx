/* eslint-disable react/prop-types */
import { Clock, FileText, CheckCircle, Target } from "lucide-react";

const StatsOverview = ({ stats }) => {
  const formatToHoursMinutes = (val) => {
    if (!val && val !== 0) return "00 hrs 00 mins";
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    return `${hrs.toString().padStart(2, "0")} hrs ${mins
      .toString()
      .padStart(2, "0")} mins`;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Hours Assigned vs Worked */}
      <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-teal-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Hours</h3>
        </div>
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Assigned</span>
            <span className="text-xs font-medium">
              {formatToHoursMinutes(stats?.totalAssignedHours) || 0} 
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{
                width: `${
                  stats?.totalWorkedHours && stats.totalAssignedHours
                    ? Math.min(
                        100,
                        (stats.totalAssignedHours / stats.totalWorkedHours) * 100
                      )
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Worked</span>
            <span className="text-xs font-medium">
              {formatToHoursMinutes(stats?.totalWorkedHours) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Projects</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-gray-800">
            {stats?.projectCount || 0}
          </p>
          <p className="text-xs text-gray-500">Assigned projects</p>
        </div>
      </div>
              
      {/* Tasks */}
      <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Tasks</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-gray-800">
            {stats?.taskCount || 0}
          </p>
          <p className="text-xs text-gray-500">Total tasks</p>
        </div>
      </div>

      {/* Efficiency */}
      <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
        <div className="flex items-center">
          <Target className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Efficiency</h3>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-gray-800">
            {stats?.totalAssignedHours && stats.totalAssignedHours > 0
              ? Math.round(
                  (stats.totalAssignedHours / stats.totalWorkedHours) * 100
                )
              : 0}
            %
          </p>
          <p className="text-xs text-gray-500">Hours worked vs assigned</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;