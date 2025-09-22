/* eslint-disable react/prop-types */

const EstimationTaskDetail = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-teal-700">Task Details</h2>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Project:</strong> {task.estimation?.projectName || ""}
          </div>
          <div>
            <strong>Assigned To:</strong> {[
              task.assignedTo?.f_name,
              task.assignedTo?.m_name,
              task.assignedTo?.l_name,
            ].filter(Boolean).join(" ")}
          </div>
          <div>
            <strong>Start Date:</strong> {task.startDate ? new Date(task.startDate).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>End Date:</strong> {task.endDate ? new Date(task.endDate).toLocaleDateString() : ""}
          </div>
          <div>
            <strong>Status:</strong> {task.status}
          </div>
        </div>

        <div className="mt-4">
          <strong>Notes:</strong>
          <div className="whitespace-pre-wrap text-sm mt-1">{task.notes || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default EstimationTaskDetail;
