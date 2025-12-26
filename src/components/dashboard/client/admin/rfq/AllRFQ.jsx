import { useState, useEffect, useMemo } from "react";
import Button from "../../../../fields/Button";
import ViewRFQ from "./ViewRFQ";
import Service from "../../../../../config/Service";
import DataTable from "../../../../DataTable";

function AllRFQ() {
  const [rfq, setRfq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReceivedRFQ = async () => {
    try {
      setLoading(true);
      const rfqData = await Service.sentRFQ();
      setRfq(rfqData || []);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedRFQ();
  }, []);

  const handleModalClose = () => {
    setSelectedRFQ(null);
    setIsModalOpen(false);
  };

  const handleViewClick = (rfqItem) => {
    const updatedRfq = { ...rfqItem, status: "Opened" };
    setRfq((prevRfq) =>
      prevRfq.map((item) => (item.id === rfqItem.id ? updatedRfq : item))
    );
    setSelectedRFQ(updatedRfq);
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        header: "Project Name",
        accessorKey: "projectName",
        filterType: "select",
        filterOptions: [...new Set(rfq.map(r => r.projectName).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
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
        cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleString() : "N/A",
      },
      {
        header: "Response",
        accessorFn: (row) => row.status === "Opened" ? "Viewed" : "Closed",
        id: "response",
        filterType: "select",
        filterOptions: [
          { label: "Viewed", value: "Viewed" },
          { label: "Closed", value: "Closed" },
        ],
      },
      {
        header: "Action",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original)}>
            View
          </Button>
        ),
      },
    ],
    [rfq]
  );

  return (
    <div className="bg-white rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All RFQs</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rfq}
          searchPlaceholder="Search by remarks or recipient"
        />
      )}

      {selectedRFQ && (
        <ViewRFQ
          data={selectedRFQ}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default AllRFQ;
