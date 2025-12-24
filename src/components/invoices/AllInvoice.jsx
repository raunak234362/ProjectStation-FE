/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../index.js";
import DataTable from "../DataTable";
import Service from "../../config/Service.js";
import GetInvoice from "./GetInvoice.jsx";
import toast from "react-hot-toast";

const AllInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await Service.AllInvoice();
      setInvoiceData(response?.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);

  const handleViewClick = (id) => {
    setSelectedInvoice(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Invoice No",
        accessorKey: "invoiceNumber",
        enableColumnFilter: true,
      },
      {
        header: "Fabricator",
        accessorKey: "customerName",
        enableColumnFilter: true,
      },
      {
        header: "Client",
        accessorKey: "contactName",
        enableColumnFilter: true,
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const val = getValue();
          return val
            ? new Date(val).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "N/A";
        },
      },
      {
        header: "Total (USD)",
        accessorFn: (row) => {
          return (
            row?.invoiceItems?.reduce(
              (sum, item) => sum + (parseFloat(item.totalUSD) || 0),
              0
            ) || 0
          );
        },
        cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
        id: "totalUSD",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(row.original.id);
              }}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <DataTable
        columns={columns}
        data={invoiceData}
        loading={loading}
        searchPlaceholder="Search invoices..."
      />

      {selectedInvoice && (
        <GetInvoice
          invoiceId={selectedInvoice}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllInvoice;
