/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../index.js";
import DataTable from "../DataTable";
import Service from "../../config/Service.js";
import GetBankAccount from "./GetBankAccount.jsx";
import toast from "react-hot-toast";

const AllBankAccounts = () => {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewClick = (id) => {
    setSelectedBank(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBank(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Bank Name",
        accessorKey: "bankInfo",
        enableColumnFilter: true,
      },
      {
        header: "Account Number",
        accessorKey: "accountNumber",
        enableColumnFilter: true,
      },
      {
        header: "Account Type",
        accessorKey: "accountType",
        filterType: "select",
        filterOptions: [...new Set(bankData.map(b => b.accountType).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Beneficiary Name",
        accessorKey: "beneficiaryInfo",
      },
      {
        header: "ABA Routing No",
        accessorKey: "abaRoutingNumber",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 text-xs"
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
    [bankData]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <DataTable
        columns={columns}
        data={bankData}
        onRowClick={(row) => handleViewClick(row.id)}
        searchPlaceholder="Search bank accounts..."
      />

      {selectedBank && (
        <GetBankAccount
          bankId={selectedBank}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllBankAccounts;
