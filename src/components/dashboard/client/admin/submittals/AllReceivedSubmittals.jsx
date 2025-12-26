import React, { useEffect, useState, useMemo } from "react";
import Service from "../../../../../config/Service";
import GetSentSubmittals from "../../../client/admin/submittals/GetSentSubmittals";
import Button from "../../../../fields/Button";
import DataTable from "../../../../DataTable";

const AllReceivedSubmittals = () => {
  const [submittals, setSubmittals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmittal, setSelectedSubmittal] = useState(null);

  const handleViewClick = (submittal) => {
    setSelectedSubmittal(submittal);
  };

  const handleModalClose = () => {
    setSelectedSubmittal(null);
  };

  const fetchSubmittals = async () => {
    try {
      setLoading(true);
      const response = await Service.reciviedSubmittal();
      setSubmittals(response?.data || []);
    } catch (error) {
      console.error("Error fetching submittals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmittals();
  }, []);

  const columns = useMemo(
    () => [
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
        accessorKey: "Stage",
      },
      {
        header: "Stage",
        accessorFn: (row) =>
          row.submittalsResponse === null ? "Not Replied" : "Replied",
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

      {selectedSubmittal && (
        <GetSentSubmittals
          submittalId={selectedSubmittal.id}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllReceivedSubmittals;

