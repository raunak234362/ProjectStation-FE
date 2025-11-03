/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Button } from "../index.js";
import Service from "../../config/Service.js";
import GetBankAccount from "./GetBankAccount.jsx"; 

const AllBankAccounts = () => {
  const [bankData, setBankData] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // optional (for future modal)
  const [selectedBank, setSelectedBank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch all bank accounts
  const getAllBanks = async () => {
    try {
      const response = await Service.FetchAllBanks();
      console.log("All Banks fetched:", response);
      setBankData(response?.data || []);
      setFilteredBanks(response?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Component Mounted → Fetching Bank Accounts...");
    getAllBanks();
  }, []);

  // ✅ Search filter
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
        bank.accountNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBanks(result);
  }, [searchQuery, bankData]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  // ✅ (Optional) Modal handler
  const handleViewClick = (id) => {
    setSelectedBank(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBank(null);
    setIsModalOpen(false);
  };

  // ✅ Define columns
  const columns = useMemo(
    () => [
      {
        Header: "Bank Name",
        accessor: "bankInfo",
      },
      {
        Header: "Account Number",
        accessor: "accountNumber",
      },
      {
        Header: "Account Type",
        accessor: "accountType",
      },
      {
        Header: "Beneficiary Name",
        accessor: "beneficiaryInfo",
      },
      {
        Header: "ABA Routing No",
        accessor: "abaRoutingNumber",
      },
    ],
    []
  );

  // ✅ Table setup
  const tableInstance = useTable({ columns, data: filteredBanks }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // ✅ Skeleton loader
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
          placeholder="Search by bank, beneficiary, account no. or invoice no."
          className="border p-2 rounded w-full mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="overflow-x-auto rounded-md border max-h-[75vh]">
          <table
            {...getTableProps()}
            className="min-w-[1000px] w-full border-collapse text-sm text-center"
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
                    No Bank Accounts Found
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
                      <td className="px-4 py-2 border">
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                          onClick={() => handleViewClick(row.original.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {selectedBank && (
          <GetBankAccount
            bankId={selectedBank}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllBankAccounts;
