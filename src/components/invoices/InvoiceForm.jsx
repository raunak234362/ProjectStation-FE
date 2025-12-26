import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../fields/Input";
import Button from "../fields/Button";
import { useSelector } from "react-redux";
import { CustomSelect } from "../index";
import Service from "../../config/Service";
import toast from "react-hot-toast";
import numWords from "num-words";
const InvoiceForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      invoiceItems: [],
      currencyType: "USD",
    },
  });
  const selectedCurrency = watch("currencyType");

  const projects = useSelector(
    (state) => state?.projectData?.projectData || []
  );
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankLoading, setBankLoading] = useState(true);

  const fabricatorID = watch("fabricatorId");

  const filteredProjects = projects?.filter(
    (proj) => proj.fabricatorID === fabricatorID
  );
  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );

  const fabricatorOptions = fabricatorData?.map((fab) => ({
    label: `${fab?.fabName}`,
    value: fab?.id,
  }));
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));
  const bankAccountOptions = bankAccounts?.map((bank) => ({
    label: `${bank.bankInfo || "Bank"
      } - A/C No: XXXX${bank.accountNumber?.slice(-4)}`,
    value: bank.id,
  }));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const isRelevantChange =
        name &&
        (name.endsWith(".rateUSD") ||
          name.endsWith(".unit") ||
          name === "currencyType");
      if (isRelevantChange) {
        const items = value.invoiceItems || [];
        let calculatedGrandTotal = 0;
        items.forEach((row, index) => {
          const rate = parseFloat(row.rateUSD) || 0;
          const unit = parseInt(row.unit) || 0;
          const totalUSD = rate * unit;
          setValue(`invoiceItems.${index}.totalUSD`, totalUSD, {
            shouldValidate: true,
          });
          calculatedGrandTotal += totalUSD;
        });
        setGrandTotal(calculatedGrandTotal);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const finalInvoiceValue = grandTotal;
  const convertToCurrencyWords = (amount, currency = "USD") => {
    if (!amount || isNaN(amount)) return "";

    const [whole, fraction] = amount.toFixed(2).split(".");
    const wholeInWords = numWords(parseInt(whole)).replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
    const fractionInWords = numWords(parseInt(fraction)).replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
    const currencyLabel =
      currency === "CAD" ? "Canadian Dollars" : "US Dollars";
    console.log("currency Selected-----", selectedCurrency);
    return `${wholeInWords} ${currencyLabel} And ${fractionInWords} Cents Only`;

  };
  const words = convertToCurrencyWords(finalInvoiceValue, selectedCurrency);


  useEffect(() => {
    const fetchAllBanks = async () => {
      setBankLoading(true);
      try {
        const response = await Service.FetchAllBanks();

        setBankAccounts(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Error fetching all bank accounts:", error);
        setBankAccounts([]);
      } finally {
        setBankLoading(false);
      }
    };
    fetchAllBanks();
  }, []);

  const selectedFabricator = fabricatorData?.find(
    (fab) => fab.id === fabricatorID
  );

  const addressOptions = selectedFabricator
    ? (() => {
      const hq = selectedFabricator.headquaters || {};
      const branchOptions =
        selectedFabricator.branches?.map((b) => ({
          label: `Branch - ${b.city || b.state || b.country}`,
          value: `Branch - ${b.city || ""}, ${b.state || ""}, ${b.country || ""
            }`,
        })) || [];

      return [
        {
          label: `Headquarters - ${hq.city || hq.state || hq.country}`,
          value: `Headquarters - ${hq.city || ""}, ${hq.state || ""}, ${hq.country || ""
            }`,
        },
        ...branchOptions,
      ];
    })()
    : [];

  useEffect(() => {
    const selectedAddress = watch("selectedAddress");
    if (selectedAddress) {
      setValue("address", selectedAddress.trim());
    }
  }, [watch("selectedAddress")]);

  const onSubmit = async (formData) => {
    const customer = fabricatorData?.find(
      (fab) => fab.id === formData?.fabricatorId
    );
    const client = clientData?.find(
      (client) => client.id === formData?.clientId
    );
    const selectedBankAccount = bankAccounts.find(
      (bank) => bank.id === formData.bankAccountId
    );
    console.log(formData);

    const formattedInvoiceItems = (formData.invoiceItems || []).map((item) => ({
      ...item,
      unit: parseInt(item.unit) || 0,
      rateUSD: parseFloat(item.rateUSD) || 0,
      totalUSD: parseFloat(item.totalUSD) || 0,
    }));

    const accountInfoPayload = {
      bankInfo: selectedBankAccount?.bankInfo,
      bankAddress: selectedBankAccount?.bankAddress,
      abaRoutingNumber: selectedBankAccount?.abaRoutingNumber,
      accountNumber: selectedBankAccount?.accountNumber,
      accountType: selectedBankAccount?.accountType,
      beneficiaryAddress: selectedBankAccount?.beneficiaryAddress,
      beneficiaryInfo: selectedBankAccount?.beneficiaryInfo,
    };

    const payload = {
      projectId: formData.projectId,
      fabricatorId: formData.fabricatorId,
      customerName: customer?.fabName,
      contactName: client?.f_name,
      clientId: formData?.clientId,
      address: formData.address,
      stateCode: formData.stateCode,
      GSTIN: formData.GSTIN,
      placeOfSupply: formData.placeOfSupply,
      jobName: formData.jobName,
      currencyType: formData.currencyType,
      TotalInvoiveValues: finalInvoiceValue.toFixed(2),
      TotalInvoiveValuesinWords: words,
      invoiceItems: formattedInvoiceItems,
      accountInfo: accountInfoPayload,
    };

    console.log("Final Payload ===>", payload);

    try {
      const response = await Service.AddInvoice(payload);
      toast.success("invoice created");
      console.log("Invoice Created:", response);
    } catch (error) {
      toast.error("Error creating invoice");
      console.error("Error creating invoice:", error);
    }
  };
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full mx-auto">
      <header className="mb-6 border-b pb-4 border-teal-200">
        <h1 className="text-3xl font-extrabold text-teal-700">
          <span role="img" aria-label="invoice"></span> New Tax Invoice
        </h1>
        <p className="text-gray-500">
          Fill in the details to generate the invoice.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Fabricator & Client Info */}
        <fieldset className="border p-4 rounded-lg shadow-inner bg-gray-50">
          <legend className="text-lg font-semibold text-teal-600 px-2">
            Supplier & Client Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              label={
                <span>
                  Fabricator <span className="text-red-500">*</span>
                </span>
              }
              placeholder="Select Fabricator"
              options={fabricatorOptions}
              {...register("fabricatorId", {
                required: "Fabricator is required",
              })}
              onChange={setValue}
            />

            <CustomSelect
              label={
                <span>
                  Client <span className="text-red-500">*</span>
                </span>
              }
              placeholder="Select Client"
              options={clientOptions}
              {...register("clientId", { required: "Client is required" })}
              onChange={setValue}
            />
          </div>

          {fabricatorID && (
            <div className="mt-4">
              <CustomSelect
                label={
                  <span>
                    Select Branch / Headquarter{" "}
                    <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Select Address"
                options={addressOptions}
                {...register("selectedAddress", {
                  required: "Address is required",
                })}
                onChange={setValue}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input label="GSTIN" placeholder="GSTIN" {...register("GSTIN")} />
            <Input
              label="State Code"
              placeholder="State Code"
              {...register("stateCode")}
            />
            <Input
              label="Address"
              placeholder="Address (Auto-filled)"
              {...register("address")}
              readOnly
              className="bg-gray-200 cursor-not-allowed"
            />
          </div>
        </fieldset>

        {/* Invoice & Project Details */}
        <fieldset className="border p-4 rounded-lg shadow-inner">
          <legend className="text-lg font-semibold text-teal-600 px-2">
            Invoice & Job Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Input
              label="Invoice Number"
              placeholder="Invoice Number"
              {...register("invoiceNumber")}
            /> */}
            <Input
              label="Job Name"
              placeholder="Job Name"
              {...register("jobName")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <CustomSelect
              label={
                <span>
                  Project <span className="text-red-500">*</span>
                </span>
              }
              placeholder="Select Project"
              options={filteredProjects?.map((proj) => ({
                label: proj.name,
                value: proj.id,
              }))}
              {...register("projectId", { required: "Project is required" })}
              onChange={setValue}
            />
            <Input
              label="Place of Supply"
              placeholder="Place of Supply"
              {...register("placeOfSupply")}
            />
            <CustomSelect
              label={
                <span>
                  Currency <span className="text-red-500">*</span>
                </span>
              }
              placeholder="Select Currency"
              options={[
                { label: "USD (United States Dollar)", value: "USD" },
                { label: "CAD (Canadian Dollar)", value: "CAD" },
              ]}
              {...register("currencyType", {
                required: "Currency is required",
              })}
              onChange={(field, value) => setValue("currencyType", value)}
            />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-lg shadow-inner bg-gray-50">
          <legend className="text-lg font-semibold text-teal-600 px-2">
            Bank Account for Payment
          </legend>
          <CustomSelect
            label={
              <span>
                Bank Account <span className="text-red-500">*</span>
              </span>
            }
            placeholder={
              bankLoading ? "Loading Banks..." : "Select Bank Account"
            }
            options={bankAccountOptions}
            {...register("bankAccountId", {
              required: "Bank Account is required",
            })}
            onChange={setValue}
            disabled={bankLoading || bankAccountOptions.length === 0}
          />
          {bankAccountOptions.length === 0 && !bankLoading && (
            <p className="text-sm text-red-500 mt-2">
              No bank accounts available.
            </p>
          )}
        </fieldset>

        {/* Items Table */}
        <div className="p-4 rounded-lg border-2 border-teal-300">
          <h2 className="text-lg font-bold text-teal-700 mb-4">
            Invoice Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2 border-spacing-x-0">
              <thead className="bg-teal-50 border-b border-gray-300 sticky top-0 z-0  ">
                <tr>
                  <th className="px-2 py-2 text-left">Sl. #</th>
                  <th className="px-2 py-2 text-left w-2/5">Description</th>
                  <th className="px-2 py-2">SAC</th>
                  <th className="px-2 py-2">Unit</th>
                  <th className="px-2 py-2">Rate (USD)</th>
                  <th className="px-2 py-2">Total (USD)</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr
                    key={field.id}
                    className="bg-white border-b hover:bg-teal-50 transition"
                  >
                    <td className="px-2 py-1 font-medium">{index + 1}</td>

                    <td className="px-2 py-1">
                      <Controller
                        name={`invoiceItems.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Service description"
                            size="sm"
                            className="bg-white"
                          />
                        )}
                      />
                    </td>

                    <td className="px-2 py-1">
                      <Controller
                        name={`invoiceItems.${index}.sacCode`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="SAC Code"
                            size="sm"
                            className="bg-white"
                          />
                        )}
                      />
                    </td>

                    <td className="px-2 py-1 w-20">
                      <Controller
                        name={`invoiceItems.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            size="sm"
                            className="text-center bg-white"
                          />
                        )}
                      />
                    </td>

                    <td className="px-2 py-1 w-28">
                      <Controller
                        name={`invoiceItems.${index}.rateUSD`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Rate"
                            step="0.01"
                            size="sm"
                            className="bg-white"
                          />
                        )}
                      />
                    </td>

                    <td className="px-2 py-1 w-28">
                      <Controller
                        name={`invoiceItems.${index}.totalUSD`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Total (USD)"
                            size="sm"
                            readOnly
                            className="bg-gray-100 font-semibold"
                          />
                        )}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove item"
                      >
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>
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
            + Add Item Row
          </Button>
        </div>

        {/* Totals and Submission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          {/* Total In Words */}
          <div className="flex flex-col justify-end">
            <Input
              label="Total Invoice Values in Words"
              value={words}
              readOnly
              className="bg-gray-100 font-semibold"
            />
          </div>

          {/* Calculated Totals */}
          <div className="bg-teal-50 p-4 rounded-lg shadow-md text-right">
            <div className="font-semibold text-gray-700 space-y-1">
              {/* <p className="flex justify-between">
                <span>Subtotal (Before Tax):</span>
                <span className="text-teal-700">${grandTotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between border-b pb-1 border-teal-200">
                <span>IGST (18%):</span>
                <span className="text-red-600">
                  ${(grandTotal * 0.18).toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between pt-1 text-xl font-extrabold">
                <span>Final Invoice Value:</span>
                <span className="text-teal-800">
                  ${(grandTotal * 1.18).toFixed(2)}
                </span>
              </p> */}
              <p className="flex justify-between pt-1 text-xl font-extrabold">
                <span>Final Invoice Value:</span>
                <span className="text-teal-800">
                  {selectedCurrency === "CAD" ? "C$" : "$"}
                  {grandTotal.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-8 bg-teal-700 hover:bg-teal-800 text-white w-full py-3 text-lg font-bold shadow-lg transition"
        >
          Generate & Submit Invoice
        </Button>
      </form>
    </div>
  );
};

export default InvoiceForm;
