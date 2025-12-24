/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import { useMemo, useState } from "react";
import GetEstimation from "./getEstimation/GetEstimation";
import { useSignals } from "@preact/signals-react/runtime";
import { estimationsSignal } from "../../signals";
import DataTable from "../DataTable";

const AllEstimations = () => {
  useSignals();
  const estimationData = estimationsSignal.value;
  console.log("All Estimations Data:", estimationData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Estimation No.",
        accessorKey: "estimationNumber",
        enableColumnFilter: true,
      },
      {
        header: "Project Name",
        accessorKey: "projectName",
        enableColumnFilter: true,
      },
      {
        header: "Tools",
        accessorKey: "tools",
      },
      {
        header: "Status",
        accessorKey: "status",
        filterType: "select",
        filterOptions: [...new Set(estimationData.map(e => e.status).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Estimate Date",
        accessorKey: "estimateDate",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        header: "Created By",
        accessorKey: "createdBy.username",
      },
    ],
    [estimationData]
  );

  const handleViewClick = (row) => {
    setSelectedEstimation(row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEstimation(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={estimationData || []}
        onRowClick={handleViewClick}
        searchPlaceholder="Search estimations..."
      />
      {selectedEstimation && (
        <GetEstimation
          estimation={selectedEstimation}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllEstimations;
