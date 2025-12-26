/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
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

  // --- Start: Handler and API functions (Same as before) ---
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
  // --- End: Handler and API functions ---

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
        Header: "Total (USD)",
        // 💥 UI Improvement: Add className property to column definition for alignment
        className: "text-right",
        accessor: (row) => {
          const total =
            row?.invoiceItems?.reduce(
              (sum, item) => sum + (parseFloat(item.totalUSD) || 0),
              0
            ) || 0
          );
        },
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

  const tableInstance = useTable(
    { columns, data: filteredInvoices },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const renderSkeletonRows = (count = 10) =>
    Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="animate-pulse">
        {columns.map(
          (
            column,
            colIdx // Use column.className for alignment
          ) => (
            <td
              key={colIdx}
              className={`px-4 py-3 border-b border-gray-200 ${
                column.className || "text-center"
              }`}
            >
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          )
        )}
        <td className="px-4 py-3 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      </tr>
    ));

  return (
    <div className="bg-white rounded-xl shadow-lg md:w-full w-[95vw] mx-auto p-4">
      {" "}
      {/* Enhanced container style */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Invoices</h2>
      {/* Search Input - Cleaned up styling */}
      <input
        type="text"
        placeholder="Search by fabricator, client, or invoice no."
        className="border border-gray-300 p-2 rounded-lg w-full mb-6 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out shadow-sm"
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[75vh] shadow-inner">
        <table
          {...getTableProps()}
          className="min-w-[900px] w-full text-sm" // Removed border-collapse
        >
          <thead className="sticky top-0 bg-teal-700 z-10">
            {" "}
            {/* 💥 Darker, professional header */}
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th className="px-4 py-3 font-semibold text-white border-b border-gray-700 whitespace-nowrap text-center">
                  S.No
                </th>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`px-4 py-3 text-white font-semibold cursor-pointer border-b border-gray-700 whitespace-nowrap ${
                      column.className || "text-center"
                    }`} 
                  >
                    {column.render("Header")}
                    {/* Add sorting indicator if needed */}
                  </th>
                ))}
                <th className="px-4 py-3 text-white font-semibold border-b border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              renderSkeletonRows(8)
            ) : rows.length === 0 ? (
              <tr>
               
                <td
                  colSpan={columns.length + 2}
                  className="py-12 text-center text-gray-500 text-lg bg-white"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">📄</span>
                    No Invoices Found matching the current search criteria.
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => handleViewClick(row.original.id)}
                    className="bg-white hover:bg-teal-50 transition duration-100 ease-in-out cursor-pointer border-b border-gray-200 last:border-b-0" // Cleaned row style
                  >
                    <td className="px-4 py-3 text-center text-gray-700">
                      {index + 1}
                    </td>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className={`px-4 py-3 text-gray-700 ${
                          cell.column.className || "text-center"
                        }`} 
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
              
                          className="bg-teal-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                          onClick={(e) => handleEditClick(e, row.original.id)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          // 💥 Simplified button style (using less intense red)
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                          onClick={(e) =>
                            handleDeleteInvoice(e, row.original.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
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
