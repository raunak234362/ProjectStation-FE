import React, { useEffect, useState, useMemo } from "react";
import Service from "../../../../../config/Service";
import Button from "../../../../fields/Button";
import GetSentSubmittals from "./GetSentSubmittals";
import DataTable from "../../../../DataTable";

const AllReceivedSubmittals = () => {
  const [submittals, setSubmittals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmittal, setSelectedSubmittal] = useState(null);

  const fetchSubmittals = async () => {
    try {
      setLoading(true);
      const response = await Service.reciviedSubmittal();
      setSubmittals(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch submittals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmittals();
  }, []);

  const handleViewClick = (data) => {
    setSelectedSubmittal(data);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedSubmittal(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Fabricator Name",
        accessorFn: (row) => row.fabricator?.fabName || "N/A",
      },
      {
        header: "Project Name",
        accessorFn: (row) => row.project?.name || "N/A",
      },
      {
        header: "Subject/Remarks",
        accessorKey: "subject",
      },
      {
        header: "Recipients",
        accessorFn: (row) => row.sender?.username || "N/A",
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        header: "RFI Status",
        accessorFn: () => "Open",
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original)}>
            View
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Received Submittals
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={submittals}
          searchPlaceholder="Search submittals..."
        />
      )}

      {isModalOpen && selectedSubmittal && (
        <GetSentSubmittals
          submittalId={selectedSubmittal.id}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllReceivedSubmittals;

