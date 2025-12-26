/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../index.js";
import DataTable from "../DataTable";
import Service from "../../config/Service.js";
import GetBankAccount from "./GetBankAccount.jsx";
import EditBankAccount from "./EditBankAccount.jsx";
import toast from "react-hot-toast";

const AllBankAccounts = () => {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedBank, setSelectedBank] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getAllBanks = async () => {
    try {
      const response = await Service.FetchAllBanks();
      setBankData(response?.data || []);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBanks(bankData);
      return;
    }

    const result = bankData.filter(
      (bank) =>
        bank.bankInfo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.beneficiaryInfo
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        bank.accountNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBanks(result);
  }, [searchQuery, bankData]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  // Row click functionality: Exactly matches AllInvoice to open the view modal
  const handleViewClick = (bank) => {
    setSelectedBank(bank);
    setIsViewOpen(true);
  };

  // Click handler for Edit button (stops propagation)
  const handleEditClick = (e, bank) => {
    e.stopPropagation(); // Prevents row click
    setSelectedBank(bank);
    setIsEditOpen(true);
  };

  // Click handler for Delete button (stops propagation)
  const handleDeleteBank = async (e, id) => {
    e.stopPropagation(); // Prevents row click

    const confirmDelete = window.confirm("Delete this bank account?");
    if (!confirmDelete) return;
    setDeletingId(id);
    try {
      await Service.deleteBankByID(id);
      toast.success("Bank account deleted successfully!");
      getAllBanks();
    } catch (error) {
      toast.error("Failed to delete bank account.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Bank Name", accessor: "bankInfo" },
      { Header: "Account Number", accessor: "accountNumber" },
      { Header: "Account Type", accessor: "accountType" },
      { Header: "Beneficiary Name", accessor: "beneficiaryInfo" },
      { Header: "ABA Routing No", accessor: "abaRoutingNumber" },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: filteredBanks }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const renderSkeletonRows = (count = 8) =>
    Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="animate-pulse">
        {columns.map((column, colIdx) => (
          <td
            key={colIdx}
            className={`px-4 py-3 border-b border-gray-200 ${
              column.className || "text-center"
            }`}
          >
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        ))}
        <td className="px-4 py-3 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      </tr>
    ));

  return (
    // Container Styling: Matches AllInvoice
    <div className="bg-white rounded-xl shadow-lg md:w-full w-[95vw] mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Bank Accounts
      </h2>

      {/* Search Input Styling: Matches AllInvoice */}
      <input
        type="text"
        placeholder="Search by bank, beneficiary, or account no."
        className="border border-gray-300 p-2 rounded-lg w-full mb-6 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out shadow-sm"
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[75vh] shadow-inner">
        <table {...getTableProps()} className="min-w-[1000px] w-full text-sm">
          {/* Header Styling: NOW bg-teal-700 to match AllInvoice */}
          <thead className="sticky top-0 bg-teal-700 z-10 shadow-md">
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
              renderSkeletonRows()
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-12 text-center text-gray-500 text-lg bg-white"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">🏦</span>
                    No Bank Accounts Found matching the current search criteria.
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    // Row Click for View Modal
                    onClick={() => handleViewClick(row.original)}
                    className="bg-white hover:bg-teal-50 transition duration-100 ease-in-out cursor-pointer border-b border-gray-200 last:border-b-0" // Row hover match
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
                    {/* Action Buttons: Exact match to AllInvoice */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Edit Button - Matches AllInvoice style */}
                        <Button
                          size="sm"
                          className="bg-teal-400 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                          onClick={(e) => handleEditClick(e, row.original)}
                        >
                          Edit
                        </Button>

                        {/* Delete Button - Matches AllInvoice style */}
                        <Button
                          size="sm"
                          disabled={deletingId === row.original.id}
                          className={`
                            ${
                              deletingId === row.original.id
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }
                            px-3 py-1 rounded-md text-xs
                          `}
                          onClick={(e) => handleDeleteBank(e, row.original.id)}
                        >
                          {deletingId === row.original.id
                            ? "Deleting..."
                            : "Delete"}
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

      {selectedBank && (
        <>
          <GetBankAccount
            bankId={selectedBank.id}
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
          />
          <EditBankAccount
            bankData={selectedBank}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            refreshBanks={getAllBanks}
          />
        </>
      )}
    </div>
  );
};

export default AllBankAccounts;
