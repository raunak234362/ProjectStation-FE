/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomSelect } from "../index";
import Input from "../fields/Input";
import Button from "../fields/Button";
import Service from "../../config/Service";
import toast from "react-hot-toast";

const EditInvoice = ({ invoiceId, isOpen, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceItems: [],
      currencyType: "USD",
    },
  });

  const [grandTotal, setGrandTotal] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankLoading, setBankLoading] = useState(true);

  const projects = useSelector((state) => state.projectData?.projectData || []);
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const clientData = useSelector((state) => state.fabricatorData?.clientData);

  const fabricatorID = watch("fabricatorId");

  // Filtered dropdowns
  const filteredProjects = projects?.filter(
    (p) => p.fabricatorID === fabricatorID
  );
  const filteredClients = clientData?.filter(
    (c) => c.fabricatorId === fabricatorID
  );

  // Dropdown options
  const fabricatorOptions = fabricatorData?.map((fab) => ({
    label: fab?.fabName,
    value: fab?.id,
  }));
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client?.f_name} ${client?.l_name}`,
    value: client?.id,
  }));
  const bankAccountOptions = bankAccounts?.map((bank) => ({
    label: `${
      bank.bankInfo || "Bank"
    } - A/C No: XXXX${bank.accountNumber?.slice(-4)}`,
    value: bank.id,
  }));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  // 🧾 Fetch existing invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await Service.InvoiceByID(invoiceId);
        const invoiceData = response?.data;

        if (invoiceData) {
          // Pre-fill form with existing data
          reset({
            ...invoiceData,
            invoiceItems: invoiceData.invoiceItems || [],
          });

          // Calculate total
          let total = 0;
          (invoiceData.invoiceItems || []).forEach((item) => {
            total += parseFloat(item.totalUSD) || 0;
          });
          setGrandTotal(total);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error("Failed to load invoice data.");
      }
    };
    if (invoiceId && isOpen) fetchInvoice();
  }, [invoiceId, isOpen, reset]);

  // 🏦 Fetch bank accounts
  useEffect(() => {
    const fetchAllBanks = async () => {
      setBankLoading(true);
      try {
        const response = await Service.FetchAllBanks();
        setBankAccounts(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      } finally {
        setBankLoading(false);
      }
    };
    fetchAllBanks();
  }, []);

  // 💰 Calculate totals
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && (name.endsWith(".rateUSD") || name.endsWith(".unit"))) {
        const items = value.invoiceItems || [];
        let total = 0;
        items.forEach((row, index) => {
          const rate = parseFloat(row.rateUSD) || 0;
          const unit = parseInt(row.unit) || 0;
          const totalUSD = rate * unit;
          setValue(`invoiceItems.${index}.totalUSD`, totalUSD.toFixed(2));
          total += totalUSD;
        });
        setGrandTotal(total);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // 🧾 Update invoice
    const onSubmit = async (data) => {
      console.log("-========================",data)
    const formattedItems = data.invoiceItems.map((i) => ({
      ...i,
      unit: parseInt(i.unit) || 0,
      rateUSD: parseFloat(i.rateUSD) || 0,
      totalUSD: parseFloat(i.totalUSD) || 0,
    }));

   const payload = {
     fabricatorId: data.fabricatorId,
     clientId: data.clientId,
     GSTIN: data.GSTIN,
     stateCode: data.stateCode,
     address: data.address,
     invoiceNumber: data.invoiceNumber,
     jobName: data.jobName,
     placeOfSupply: data.placeOfSupply,
     currencyType: data.currencyType,
     totalInvoiceValueInWords: data.totalInvoiceValueInWords,
     invoiceItems: formattedItems,
     TotalInvoiveValues: (grandTotal * 1.18).toFixed(2),
   };

console.log(payload,"============")
    try {
        const response = await Service.editInvoice(invoiceId, payload);
        console.log("-------------",response);
        
      toast.success("Invoice updated successfully!");
      onSave?.();
      onClose?.();
    } catch (error) {
      toast.error("Failed to update invoice.");
      console.error("Error updating invoice:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl my-10">
        <h2 className="text-3xl font-extrabold text-teal-700 mb-6">
          ✏️ Edit Invoice
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Supplier & Client */}
          <fieldset className="border p-4 rounded-lg bg-gray-50">
            <legend className="text-lg font-semibold text-teal-600">
              Supplier & Client Details
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelect
                label="Fabricator"
                options={fabricatorOptions}
                {...register("fabricatorId")}
                onChange={setValue}
              />
              <CustomSelect
                label="Client"
                options={clientOptions}
                {...register("clientId")}
                onChange={setValue}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="GSTIN" {...register("GSTIN")} />
              <Input label="State Code" {...register("stateCode")} />
              <Input label="Address" {...register("address")} />
            </div>
          </fieldset>

          {/* Invoice Details */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold text-teal-600">
              Invoice & Job Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Invoice Number" {...register("invoiceNumber")} />
              <Input label="Job Name" {...register("jobName")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="Place of Supply" {...register("placeOfSupply")} />
              <Input label="Currency" {...register("currencyType")} readOnly />
            </div>
          </fieldset>

          {/* Items Table */}
          <div className="border-2 border-teal-300 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-teal-700 mb-4">
              Invoice Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-teal-50">
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>SAC</th>
                    <th>Unit</th>
                    <th>Rate (USD)</th>
                    <th>Total (USD)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-b">
                      <td>{index + 1}</td>
                      <td>
                        <Controller
                          name={`invoiceItems.${index}.description`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`invoiceItems.${index}.sacCode`}
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`invoiceItems.${index}.unit`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              className="text-center"
                            />
                          )}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`invoiceItems.${index}.rateUSD`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} type="number" step="0.01" />
                          )}
                        />
                      </td>
                      <td>
                        <Controller
                          name={`invoiceItems.${index}.totalUSD`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              readOnly
                              className="bg-gray-100"
                            />
                          )}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              onClick={() =>
                append({
                  description: "",
                  sacCode: "",
                  unit: 1,
                  rateUSD: "",
                  totalUSD: "",
                })
              }
              type="button"
              className="mt-4 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-lg"
            >
              + Add Item
            </Button>
          </div>

          {/* Totals + Submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <Input
              label="Total Invoice Value (in Words)"
              {...register("totalInvoiceValueInWords")}
            />
            <div className="bg-teal-50 p-4 rounded-lg text-right font-semibold">
              <p>Subtotal: ${grandTotal.toFixed(2)}</p>
              <p>IGST (18%): ${(grandTotal * 0.18).toFixed(2)}</p>
              <p className="text-xl font-bold">
                Final: ${(grandTotal * 1.18).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              className="bg-gray-400 text-white hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 font-bold"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoice;
