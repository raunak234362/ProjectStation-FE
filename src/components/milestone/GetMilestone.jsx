/* eslint-disable react/prop-types */

import { useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import EditMileston from "./EditMileston";

const GetMilestone = ({ milestone, onClose, onUpdate }) => {
  useSignals();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!milestone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Milestone Details
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Close
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <p className="mt-1 text-gray-900">{milestone.subject || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div
              className="mt-1 text-gray-900 prose"
              dangerouslySetInnerHTML={{
                __html: milestone.description || "N/A",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stage
            </label>
            <p className="mt-1 text-gray-900">{milestone.stage || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <p className="mt-1 text-gray-900">{milestone.status || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Approval Date
            </label>
            <p className="mt-1 text-gray-900">
              {milestone.approvalDate
                ? new Date(milestone.approvalDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end"></div>
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
