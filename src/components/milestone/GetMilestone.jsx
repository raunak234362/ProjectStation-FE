/* eslint-disable react/prop-types */

import { useState } from "react";
import { useSelector } from "react-redux";
import { useSignals } from "@preact/signals-react/runtime";
import EditMileston from "./EditMileston";

const GetMilestone = ({ milestone, onClose, onUpdate }) => {
  useSignals();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!milestone) return null;

  const formatAssignedHours = (duration) => {
    if (!duration) return "0.00";
    const [h = 0, m = 0] = String(duration).split(":").map(Number);
    return (h + m / 60).toFixed(2);
  };

  const formatTakenHours = (workingHourTask) => {
    if (!workingHourTask || !workingHourTask[0]) return "0.00";
    const minutes = Number(workingHourTask[0].duration) || 0;
    return (minutes / 60).toFixed(2);
  };

  const staffData = useSelector((state) => state.userData?.staffData || []);

  const getUserName = (userId) => {
    const user = staffData.find((u) => u.id === userId);
    return user ? `${user.f_name} ${user.l_name}` : "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Milestone Details
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Subject
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {milestone.subject || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Description
              </label>
              <div
                className="mt-1 text-gray-900 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: milestone.description || "N/A",
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Stage
                </label>
                <p className="mt-1 text-gray-900">{milestone.stage || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${milestone.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-teal-100 text-teal-800"
                      }`}
                  >
                    {milestone.status || "N/A"}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Approval Date
              </label>
              <p className="mt-1 text-gray-900">
                {milestone.approvalDate
                  ? new Date(milestone.approvalDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Associated Tasks
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {(milestone.Tasks || milestone.tasks)?.length || 0}
            </span>
          </h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Hrs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taken Hrs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {((milestone.Tasks || milestone.tasks) && (milestone.Tasks || milestone.tasks).length > 0) ? (
                  (milestone.Tasks || milestone.tasks).map((task, idx) => (
                    <tr key={task.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {task.name || task.task_name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getUserName(task.user_id) || task.username || task.assigned_user?.username || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatAssignedHours(task.duration)} hrs
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatTakenHours(task.workingHourTask)} hrs
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {task.due_date || task.start_date || task.startDate
                          ? new Date(task.due_date || task.start_date || task.startDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.status === "COMPLETE"
                          ? "bg-green-100 text-green-800"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                          }`}>
                          {task.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-sm text-gray-500 italic"
                    >
                      No tasks associated with this milestone.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditMileston
          milestone={milestone}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(updatedMilestone) => {
            if (onUpdate) onUpdate(updatedMilestone);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GetMilestone;
