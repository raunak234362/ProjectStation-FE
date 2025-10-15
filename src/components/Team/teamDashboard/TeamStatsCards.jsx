/* eslint-disable react/prop-types */
import { Clock, CheckCircle, ArrowUp } from "lucide-react";

const TeamStatsCards = ({ teamStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Hours Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800">Hours</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Assigned:</span>
            <span className="font-medium">{teamStats.totalAssignedHours || "0.00"} hrs</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Worked:</span>
            <span className="font-medium">{teamStats.totalWorkedHours || "0.00"} hrs</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, teamStats.efficiency || 0)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tasks Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-800">Tasks</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">{teamStats.totalTasks || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed:</span>
            <span className="font-medium">{teamStats.completedTasks || 0}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${teamStats.completionRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Efficiency Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
            <ArrowUp className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-800">Efficiency</h4>
        </div>
        <div className="mt-2 text-center">
          <div className="text-3xl font-bold text-gray-800">{teamStats.efficiency || 0}%</div>
          <div className="text-xs text-gray-500 mt-1">Hours worked vs assigned</div>
        </div>
      </div>

      {/* Completion Rate Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-800">Completion Rate</h4>
        </div>
        <div className="mt-2 text-center">
          <div className="text-3xl font-bold text-gray-800">{teamStats.completionRate || 0}%</div>
          <div className="text-xs text-gray-500 mt-1">Tasks completed vs total</div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsCards;