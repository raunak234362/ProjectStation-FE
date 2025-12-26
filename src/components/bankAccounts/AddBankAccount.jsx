/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../fields/Input";
import Button from "../fields/Button";
import Service from "../../config/Service";

const AddBankAccount = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const selectedInvoiceId = watch("invoiceId");

  useEffect(() => {
    if (selectedInvoiceId) {
      console.log("Selected Invoice ID:", selectedInvoiceId);
    }
  }, [selectedInvoiceId]);

  const onSubmit = async (formData) => {
    const payload = {
      invoiceId: formData.invoiceId,
      abaRoutingNumber: formData.abaRoutingNumber,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
      beneficiaryInfo: formData.beneficiaryInfo,
      institutionNumber: formData.institutionNumber,
      transitNumber: formData.transitNumber,
      beneficiaryAddress: formData.beneficiaryAddress,
      bankInfo: formData.bankInfo,
      bankAddress: formData.bankAddress,
    };

    console.log("Bank Account Payload ===>", payload);

    try {
      await Service.AddBankAccount(payload);
      reset();
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-teal-700">Add Bank Account Details</h1>
        <p className="text-gray-500 mt-1">
          Enter details to link a bank account to the invoice.
        </p>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        <fieldset className="border border-gray-200 p-6 rounded-lg space-y-6">
          <legend className="text-teal-600 font-semibold text-lg px-2">Bank Details</legend>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="ABA Routing Number"
              placeholder="Enter ABA Routing Number"
              {...register("abaRoutingNumber", { required: true })}
            />
            <Input
              label="Account Number"
              placeholder="Enter Account Number"
              {...register("accountNumber", { required: true })}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Account Name"
              placeholder="Enter Account Name"
              {...register("accountName")}
            />
            <Input
              label="Institution Number"
              placeholder="Enter Institution Number"
              {...register("institutionNumber")}
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Account Type"
              placeholder="Savings / Current"
              {...register("accountType", { required: true })}
            />
            <Input
              label="Beneficiary Info"
              placeholder="Enter Beneficiary Info"
              {...register("beneficiaryInfo", { required: true })}
            />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Beneficiary Address"
              placeholder="Enter Beneficiary Address"
              {...register("beneficiaryAddress", { required: true })}
            />
            <Input
              label="Bank Info"
              placeholder="Enter Bank Name or Info"
              {...register("bankInfo", { required: true })}
            />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Transit Number"
              placeholder="Enter Transit Number"
              {...register("transitNumber")}
            />
            <Input
              label="Bank Address"
              placeholder="Enter Bank Address"
              {...register("bankAddress", { required: true })}
            />
          </div>
        </fieldset>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-teal-700 hover:bg-teal-800 text-white w-full py-3 text-lg font-bold shadow-md transition"
        >
          Save Bank Account Details
        </Button>

      </form>
    </div>
  );
};

export default AddBankAccount;
