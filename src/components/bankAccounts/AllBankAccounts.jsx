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
      setLoading(true);
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
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      { header: "Bank Name", accessorKey: "bankInfo" },
      { header: "Account Number", accessorKey: "accountNumber" },
      { header: "Account Type", accessorKey: "accountType" },
      { header: "Beneficiary Name", accessorKey: "beneficiaryInfo" },
      { header: "ABA Routing No", accessorKey: "abaRoutingNumber" },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-teal-400 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              onClick={(e) => handleEditClick(e, info.row.original)}
            >
              Edit
            </Button>

            <Button
              size="sm"
              disabled={deletingId === info.row.original.id}
              className={`
                ${deletingId === info.row.original.id
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
                }
                px-3 py-1 rounded-md text-xs
              `}
              onClick={(e) => handleDeleteBank(e, info.row.original.id)}
            >
              {deletingId === info.row.original.id
                ? "Deleting..."
                : "Delete"}
            </Button>
          </div>
        ),
      },
    ],
    [deletingId]
  );

  return (
    <div className="bg-white rounded-xl shadow-lg md:w-full w-[95vw] mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Bank Accounts
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={bankData}
          onRowClick={(row) => handleViewClick(row)}
          searchPlaceholder="Search by bank, beneficiary, or account no."
        />
      )}

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
