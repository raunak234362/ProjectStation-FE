/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback } from "react";
import Service from "../../config/Service";
import { useDispatch } from "react-redux";
import GetRFQ from "./GetRFQ";
import { showRFQs } from "../../store/rfqSlice";
import DataTable from "../DataTable";

function AllRFQ() {
  const [rfq, setRfq] = useState([]);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const dispatch = useDispatch();

  const fetchInboxRFQ = async () => {
    try {
      let rfqDetail;
      if (userType === "client") {
        rfqDetail = await Service.sentRFQ();
      } else {
        rfqDetail = await Service.inboxRFQ();
      }
      setRfq(rfqDetail || []);
      dispatch(showRFQs(rfqDetail || []));
    } catch (error) {
      console.error("Error fetching RFQ:", error);
    }
  };

  useEffect(() => {
    fetchInboxRFQ();
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "Project Name",
        accessorKey: "projectName",
        enableColumnFilter: true,
      },
      {
        header: "Mail ID",
        accessorFn: (row) => {
          if (userType === "client") {
            return row.recepients?.email || row.sender || "Null";
          } else {
            return row.sender?.email || row.recepients || "Null";
          }
        },
        id: "mailId",
      },
      {
        header: "Subject",
        accessorKey: "subject",
        enableColumnFilter: true,
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const yy = String(date.getFullYear()).slice(-2);
          const hh = String(date.getHours()).padStart(2, "0");
          const min = String(date.getMinutes()).padStart(2, "0");
          return `${mm}/${dd}/${yy} , ${hh}:${min}`;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        filterType: "select",
        filterOptions: [...new Set(rfq.map(r => r.status).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
    ];

    if (userType !== "client") {
      baseColumns.splice(3, 0, {
        header: "Fabricator",
        accessorFn: (row) => row?.sender?.fabricator?.fabName || "",
        id: "fabricator",
        filterType: "select",
        filterOptions: [...new Set(rfq.map(r => r?.sender?.fabricator?.fabName).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      });
    }
    return baseColumns;
  }, [userType, rfq]);

  const handleRowClick = useCallback((rfqItem) => {
    setSelectedRFQ(rfqItem);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedRFQ(null);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      <DataTable
        columns={columns}
        data={rfq}
        onRowClick={handleRowClick}
        searchPlaceholder="Search RFQs..."
      />

      {isModalOpen && (
        <GetRFQ
          data={selectedRFQ}
          onClose={handleModalClose}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}

export default AllRFQ;
