import React, { useEffect, useState, useMemo } from "react";
// Assuming Button component supports different colors/styles
import { Button } from "../index.js";
import DataTable from "../DataTable";
import Service from "../../config/Service.js";
import GetInvoice from "./GetInvoice.jsx";
import toast from "react-hot-toast";
import EditInvoice from "./EditInvoice.jsx";

// ... (State and Handler Functions remain the same from the previous step)
const AllInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);

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

  const handleDeleteInvoice = async (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;

    try {
      await Service.deleteInvoiceByID(id);
      toast.success("Invoice deleted successfully!");
      getAllInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  const handleModalClose = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (e, id) => {
    e.stopPropagation();
    setEditInvoiceId(id);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditInvoiceId(null);
    setIsEditModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Invoice No",
        accessorKey: "invoiceNumber",
      },
      {
        header: "Fabricator",
        accessorKey: "customerName",
      },
      {
        header: "Client",
        accessorKey: "contactName",
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: (info) => {
          const value = info.getValue();
          return value
            ? new Date(value).toLocaleDateString("en-IN", {
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
          const total =
            row?.invoiceItems?.reduce(
              (sum, item) => sum + (parseFloat(item.totalUSD) || 0),
              0
            ) || 0;
          return total.toFixed(2);
        },
        id: "totalUSD",
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-teal-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(e, info.row.original.id);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
              onClick={(e) => handleDeleteInvoice(e, info.row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-xl shadow-lg md:w-full w-[95vw] mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Invoices</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={invoiceData}
          onRowClick={(row) => handleViewClick(row.id)}
          searchPlaceholder="Search invoices..."
        />
      )}

      {selectedInvoice && (
        <GetInvoice
          invoiceId={selectedInvoice}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
      {isEditModalOpen && (
        <EditInvoice
          invoiceId={editInvoiceId}
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          onSave={getAllInvoices}
        />
      )}
    </div>
  );
};

export default AllInvoice;
