import React, { useMemo, useState, useEffect } from "react";
import Service from "../../../../../config/Service";
import { Button } from "../../../../index";
import ViewRFI from "./ViewRFI";
import DataTable from "../../../../DataTable";

const AllReceivedRFI = () => {
  const [RFI, setRFI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFI, setSelectedRFI] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReceivedRfi = async () => {
    try {
      setLoading(true);
      const rfi = await Service.inboxRFI();
      if (rfi) {
        setRFI(rfi.data || []);
      }
    } catch (error) {
      console.error("Error fetching RFI:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRfi();
  }, []);

  const handleViewClick = (rfiId) => {
    setSelectedRFI(rfiId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedRFI(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Fabricator Name",
        accessorFn: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
        filterType: "select",
        filterOptions: [...new Set(RFI.map(r => r.fabricator?.fabName).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Client Name",
        accessorFn: (row) => row?.recepients?.username || "N/A",
        id: "clientName",
      },
      {
        header: "Project Name",
        accessorFn: (row) => row?.project?.name || "N/A",
        id: "projectName",
        filterType: "select",
        filterOptions: [...new Set(RFI.map(r => r.project?.name).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Mail ID",
        accessorFn: (row) => row?.recepients?.email || "N/A",
        id: "mailId",
      },
      {
        header: "Subject/Remarks",
        accessorKey: "subject",
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        header: "RFI Status",
        accessorFn: (row) => row?.status ? "No Reply" : "Replied",
        id: "status",
        filterType: "select",
        filterOptions: [
          { label: "No Reply", value: "No Reply" },
          { label: "Replied", value: "Replied" },
        ],
      },
      {
        header: "Action",
        id: "actions",
        cell: (info) => (
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-teal-300 rounded text-xs">
              Forward
            </button>
            <Button
              className="px-2 py-1 bg-blue-300 rounded text-xs"
              onClick={() => handleViewClick(info.row.original.id)}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [RFI]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Received RFIs</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={RFI}
          searchPlaceholder="Search RFIs..."
        />
      )}

      {isModalOpen && selectedRFI && (
        <ViewRFI
          rfiId={selectedRFI}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllReceivedRFI;
