/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../fields/Input";
import Button from "../fields/Button";
import { useSelector } from "react-redux";
import { CustomSelect } from "../index";
import Service from "../../config/Service";
//onSubmit th
const AddBankAccount = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Redux data (Invoice list from store)
  const invoices = useSelector(
    (state) => state?.invoiceData?.invoiceData || []
  );

  // Dropdown options for invoices
  const invoiceOptions = invoices.map((inv) => ({
    label: `${inv.invoiceNumber} - ${inv.customerName}`,
    value: inv.id,
  }));

  const selectedInvoiceId = watch("invoiceId");

  // Auto-populate logic (optional, if you want to auto-fill fields when invoice changes)
  useEffect(() => {
    if (selectedInvoiceId) {
      console.log("Selected Invoice ID:", selectedInvoiceId);
    }
  }, [selectedInvoiceId]);

  // Submit logic
  const onSubmit = async (formData) => {
    const payload = {
      invoiceId: formData.invoiceId, 
      abaRoutingNumber: formData.abaRoutingNumber,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
      beneficiaryInfo: formData.beneficiaryInfo,
      beneficiaryAddress: formData.beneficiaryAddress,
      bankInfo: formData.bankInfo,
      bankAddress: formData.bankAddress,
      
    };

    console.log("Bank Account Payload ===>", payload);

    try {
      const response = await Service.AddBankAccount(payload);
      console.log("Bank details added successfully:", response);
      reset(); 
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-6 border-b pb-4 border-teal-200">
        <h1 className="text-3xl font-extrabold text-teal-700">
          Add Bank Account Details
        </h1>
        <p className="text-gray-500">
          Enter details to link a bank account to the invoice.
        </p>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Invoice selection */}
        {/* <fieldset className="border p-4 rounded-lg shadow-inner bg-gray-50">
          <legend className="text-lg font-semibold text-teal-600 px-2">
            Invoice Selection
          </legend>

          <CustomSelect
            label={
              <span>
                Select Invoice <span className="text-red-500">*</span>
              </span>
            }
            placeholder="Choose Invoice"
            options={invoiceOptions}
            {...register("invoiceId", {
              required: "Invoice selection is required",
            })}
            onChange={setValue}
          />
        </fieldset> */}

        {/* Bank Details Section */}
        <fieldset className="border p-4 rounded-lg shadow-inner">
          <legend className="text-lg font-semibold text-teal-600 px-2">
            Bank Details
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ABA Routing Number"
              placeholder="Enter ABA Routing Number"
              {...register("abaRoutingNumber", {
                required: "ABA Routing Number is required",
              })}
            />

            <Input
              label="Account Number"
              placeholder="Enter Account Number"
              {...register("accountNumber", {
                required: "Account Number is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Account Type"
              placeholder="Savings / Current"
              {...register("accountType", {
                required: "Account Type is required",
              })}
            />
            <Input
              label="Beneficiary Info"
              placeholder="Enter Beneficiary Name or Info"
              {...register("beneficiaryInfo", {
                required: "Beneficiary Info is required",
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Beneficiary Address"
              placeholder="Enter Beneficiary Address"
              {...register("beneficiaryAddress", {
                required: "Beneficiary Address is required",
              })}
            />
            <Input
              label="Bank Info"
              placeholder="Enter Bank Name or Info"
              {...register("bankInfo", { required: "Bank Info is required" })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Bank Address"
              placeholder="Enter Bank Address"
              {...register("bankAddress", {
                required: "Bank Address is required",
              })}
            />
          </div>
        </fieldset>

        {/* Submit */}
        <Button
          type="submit"
          className="mt-8 bg-teal-700 hover:bg-teal-800 text-white w-full py-3 text-lg font-bold shadow-lg transition"
        >
          Save Bank Account Details
        </Button>
      </form>
    </div>
  );
};

export default AddBankAccount;
