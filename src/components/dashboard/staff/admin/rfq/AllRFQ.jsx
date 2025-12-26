import { useState, useEffect, useMemo } from "react";
import Button from "../../../../fields/Button";
import Service from "../../../../../config/Service";
import ViewRFQ from "./ViewRFQ";
import { useSelector } from "react-redux";
import DataTable from "../../../../DataTable";

function AllRFQ() {
  const [rfq, setRfq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clientData = useSelector((state) => state?.fabricatorData?.clientData || []);

  const fetchInboxRFQ = async () => {
    try {
      setLoading(true);
      const rfqDetail = await Service.inboxRFQ();
      setRfq(rfqDetail || []);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxRFQ();
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
        accessorFn: (row) => {
          const matchedClient = clientData.find(
            (client) => client.email === row.sender_id || client.id === row.sender_id
          );
          return matchedClient ? matchedClient.email : row.sender_id;
        },
        id: "mailId",
      },
      {
        header: "Subject/Remarks",
        accessorKey: "subject",
      },
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        header: "RFQ Status",
        accessorKey: "status",
        filterType: "select",
        filterOptions: [...new Set(rfq.map(r => r.status).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
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
    [rfq, clientData]
  );

  return (
    <div className="bg-white/80 rounded-lg md:w-full w-[90vw] p-4">
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
