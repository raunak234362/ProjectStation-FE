/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Button } from "../index.js";
import Service from "../../config/Service.js";
import GetInvoice from "./GetInvoice.jsx";
import toast from "react-hot-toast";

const AllInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllInvoices = async () => {
    try {
      const response = await Service.AllInvoice();
      console.log("Invoices fetched:", response);
      setInvoiceData(response?.data || []);
      setFilteredInvoices(response?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Component Mounted → Fetching invoices...");
    getAllInvoices();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInvoices(invoiceData);
      return;
    }

    const result = invoiceData.filter(
      (inv) =>
        inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInvoices(result);
  }, [searchQuery, invoiceData]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleViewClick = (id) => {
    setSelectedInvoice(id);
    setIsModalOpen(true);
  };
const handleDeleteInvoice = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this invoice?"
  );
  if (!confirmDelete) return;

  try {
    await Service.deleteInvoiceByID(id);
    toast.success("Invoice deleted successfully!");
    // Refresh invoice list
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

  const columns = useMemo(
    () => [
      {
        Header: "Invoice No",
        accessor: "invoiceNumber",
      },
      {
        Header: "Fabricator",
        accessor: "customerName",
      },
      {
        Header: "Client",
        accessor: "contactName",
        id: "clientName",
      },
      {
        Header: "Date",
        accessor: (row) =>
          row?.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
        id: "createdAt",
      },
      {
        Header: "Total (USD)",
       
        accessor: (row) => {
          const total =
            row?.invoiceItems?.reduce(
              (sum, item) => sum + (parseFloat(item.totalUSD) || 0),
              0
            ) || 0;
          return `$${total.toFixed(2)}`;
        },
        id: "totalUSD", 
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
        {columns.map((_, colIdx) => (
          <td key={colIdx} className="px-4 py-2 border">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </td>
        ))}
        <td className="px-4 py-2 border">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </td>
      </tr>
    ));

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="mt-5 bg-white h-auto p-4">
        <input
          type="text"
          placeholder="Search by fabricator, client, or invoice no."
          className="border p-2 rounded w-full mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="overflow-x-auto rounded-md border max-h-[75vh]">
          <table
            {...getTableProps()}
            className="min-w-[900px] w-full border-collapse text-sm text-center"
          >
            <thead className="sticky top-0 bg-teal-200/80 z-10">
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-teal-200/70"
                >
                  <th className="px-4 py-2 font-semibold border whitespace-nowrap">
                    S.No
                  </th>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-2 py-1 cursor-pointer"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                  <th className="px-2 py-1 border">Actions</th>
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {loading ? (
                renderSkeletonRows(8)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-4 text-center">
                    No Invoices Found
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-100 transition cursor-pointer"
                    >
                      <td className="px-4 py-2 border">{index + 1}</td>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                      {/* <td className="px-4 py-2 border">
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                          onClick={() => handleViewClick(row.original.id)}
                        >
                          View
                        </Button>
                      </td> */}
                      <td className="px-4 py-2 border">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                            onClick={() => handleViewClick(row.original.id)}
                          >
                            View
                          </Button>

                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteInvoice(row.original.id)}
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
      </div>
    </div>
  );
};

export default AllInvoice;
