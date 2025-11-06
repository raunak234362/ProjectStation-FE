/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "../index";
import Service from "../../config/Service";
import toast from "react-hot-toast";

const EditBankAccount = ({ bankData, isOpen, onClose, refreshBanks }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (bankData) {
      reset({
        bankInfo: bankData.bankInfo || "",
        bankAddress: bankData.bankAddress || "",
        accountNumber: bankData.accountNumber || "",
        accountType: bankData.accountType || "",
        abaRoutingNumber: bankData.abaRoutingNumber || "",
        beneficiaryInfo: bankData.beneficiaryInfo || "",
        beneficiaryAddress: bankData.beneficiaryAddress || "",
      });
    }
  }, [bankData]);

    const onSubmit = async (formData) => {
      console.log(formData)
    try {
      const payload = {
        bankInfo: formData.bankInfo,
        bankAddress: formData.bankAddress,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        abaRoutingNumber: formData.abaRoutingNumber,
        beneficiaryInfo: formData.beneficiaryInfo,
        beneficiaryAddress: formData.beneficiaryAddress,
      };

      await Service.editBankDetails(bankData.id, payload);
      toast.success("Bank details updated successfully!");
      onClose();
      refreshBanks();
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Failed to update bank details. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-teal-700 mb-6 border-b pb-2">
          Edit Bank Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              {...register("bankInfo", { required: "Bank name is required" })}
            />
            <Input
              label="Bank Address"
              {...register("bankAddress", {
                required: "Bank address is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Account Number"
              {...register("accountNumber", {
                required: "Account number is required",
              })}
            />
            <Input
              label="Account Type"
              {...register("accountType", {
                required: "Account type is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ABA Routing Number"
              {...register("abaRoutingNumber", {
                required: "ABA Routing Number is required",
              })}
            />
            <Input
              label="Beneficiary Name"
              {...register("beneficiaryInfo", {
                required: "Beneficiary name is required",
              })}
            />
          </div>

          <Input
            label="Beneficiary Address"
            {...register("beneficiaryAddress", {
              required: "Beneficiary address is required",
            })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-700 hover:bg-teal-800 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBankAccount;
