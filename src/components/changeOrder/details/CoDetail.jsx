/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import Button from "../../fields/Button";
import EditCoDetail from "./EditCoDetail";
import { openCoListTableInNewTab } from "../../../util/coTableUtils";
import RenderFiles from "../../RenderFiles";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col w-full">
    <span className="text-sm font-semibold text-gray-500 uppercase">
      {label}
    </span>
    <span className="mt-1 text-gray-700">{value || "Not available"}</span>
  </div>
);

const CoDetail = ({ selectedCO, fetchCO }) => {
  const [editTab, setEditTab] = useState(false);
  const userType = sessionStorage.getItem("userType");

  const handleEdit = useCallback(() => {
    setEditTab(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditTab(false);
    fetchCO(); // Refresh details after editing
  }, [fetchCO]);

  const statusClass =
    selectedCO?.status?.toLowerCase() === "approved"
      ? "bg-green-100 text-green-700"
      : selectedCO?.status?.toLowerCase() === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700";

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="z-10 flex items-center justify-between p-4 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-200 rounded-xl shadow-md mb-6">
        <div className="flex flex-row items-center gap-5">
          <div className="text-xl font-bold text-white tracking-wide">
            Change Order Request
          </div>
          <div className="text-sm text-white/90">
            {selectedCO?.sentOn
              ? new Date(selectedCO.sentOn).toLocaleString()
              : "N/A"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${statusClass}`}
          >
            {selectedCO?.status || "N/A"}
          </span>
          {userType !== "client" && (
            <Button
              onClick={handleEdit}
              className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg shadow-sm"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <InfoItem label="Subject" value={selectedCO?.remarks} />
        <InfoItem
          label="Point of Contact"
          value={
            selectedCO?.Recipients
              ? `${selectedCO?.Recipients?.f_name} ${selectedCO?.Recipients?.l_name}`
              : "Not available"
          }
        />

        <InfoItem
          label="Approved"
          value={selectedCO?.isAproovedByAdmin ? "Yes" : "No"}
        />

        {/* Description Section */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-gray-500 uppercase">
            Description:
          </span>
          <div
            className="text-gray-700 text-sm md:text-base leading-relaxed p-3 bg-gray-50 rounded-lg border border-gray-200"
            dangerouslySetInnerHTML={{
              __html: selectedCO?.description || "N/A",
            }}
          />
        </div>

        {/* Files Section */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-gray-500 uppercase">
            Files:
          </span>
          <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <RenderFiles files={selectedCO.files} table="changeOrders" parentId={selectedCO.id} />
          </div>
        </div>

        {/* CO Reference Link */}
        <div className="md:col-span-2">
          <button
            onClick={() => openCoListTableInNewTab(selectedCO)}
            className="text-teal-500 hover:underline text-sm font-semibold"
          >
            View Change Order Reference List
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {userType !== "client" && editTab && (
        <EditCoDetail
          selectedCO={selectedCO}
          fetchCO={fetchCO}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
};

export default CoDetail;
