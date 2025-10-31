import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../fields/Input";
import Button from "../fields/Button";
import { useSelector } from "react-redux";
import { CustomSelect } from "../index";
import Service from "../../config/Service";

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceItems: [],
    },
  });

  // Redux data
  const projects = useSelector(
    (state) => state?.projectData?.projectData || []
  );
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  const fabricatorID = watch("fabricatorId");

  // filter projects and clients based on fabricator
  const filteredProjects = projects?.filter(
    (proj) => proj.fabricatorID === fabricatorID
  );
  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );

  // dropdown options
  const fabricatorOptions = fabricatorData?.map((fab) => ({
    label: `${fab?.fabName}`,
    value: fab?.id,
  }));
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));

  // invoice item table logic
  const { fields, append } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  const [grandTotal, setGrandTotal] = useState(0);
  const rows = watch("invoiceItems") || [];

  // calculate total
  useEffect(() => {
    if (!rows || rows.length === 0) {
      setGrandTotal(0);
      return;
    }

    const total = rows.reduce(
      (sum, row) =>
        sum + (parseFloat(row.rateUSD) || 0) * (parseFloat(row.unit) || 1),
      0
    );
    setGrandTotal(total);
  }, [rows]);

  // calculate totalUSD for each row
  useEffect(() => {
    const updatedRows = rows?.map((row) => {
      const rate = parseFloat(row.rateUSD) || 0;
      const unit = parseFloat(row.unit) || 1;
      const totalUSD = rate * unit;
      return { ...row, totalUSD };
    });

    if (updatedRows) {
      updatedRows.forEach((row, index) => {
        setValue(`invoiceItems.${index}.totalUSD`, row.totalUSD);
      });
    }

    const total = updatedRows?.reduce((sum, r) => sum + r.totalUSD, 0) || 0;
    setGrandTotal(total);
  }, [rows, setValue]);

  // handle HQ/Branch address
  const selectedFabricator = fabricatorData?.find(
    (fab) => fab.id === fabricatorID
  );

  // generate address options (HQ + branches)
  const addressOptions = selectedFabricator
    ? (() => {
        const hq = selectedFabricator.headquaters || {};
        const branchOptions =
          selectedFabricator.branches?.map((b) => ({
            label: `Branch - ${b.city || b.state || b.country}`,
            value: `Branch - ${b.city || ""}, ${b.state || ""}, ${
              b.country || ""
            }`,
          })) || [];

        return [
          {
            label: `Headquarters - ${hq.city || hq.state || hq.country}`,
            value: `Headquarters - ${hq.city || ""}, ${hq.state || ""}, ${
              hq.country || ""
            }`,
          },
          ...branchOptions,
        ];
      })()
    : [];

  // update address field when selected
  useEffect(() => {
    const selectedAddress = watch("selectedAddress");
    if (selectedAddress) {
      setValue("address", selectedAddress.trim());
    }
  }, [watch("selectedAddress")]);

  // final submit
 const onSubmit = async (invoiceData) => {
   console.log("formData======", invoiceData);

   const customer = fabricatorData?.find(
     (fab) => fab.id === invoiceData?.fabricatorId
   );
   const client = clientData?.find(
     (client) => client.id === invoiceData?.clientId
   );

   // 🔹 Convert invoiceItems fields to proper types
   const formattedInvoiceItems = (invoiceData.invoiceItems || []).map(
     (item) => ({
       ...item,
       unit: parseInt(item.unit) || 0, // convert to integer
       rateUSD: parseFloat(item.rateUSD) || 0, // convert to float
       totalUSD: parseFloat(item.totalUSD) || 0, // convert to float
     })
   );

   const payload = {
     projectId: invoiceData.projectId,
     fabricatorId: invoiceData.fabricatorId,
     customerName: customer?.fabName,
     contactName: client?.f_name,
     clientId: client?.clientId,
     address: invoiceData.address, // ✅ plain string
     stateCode: invoiceData.stateCode,
     GSTIN: invoiceData.GSTIN,
     invoiceNumber: invoiceData.invoiceNumber,
     placeOfSupply: invoiceData.placeOfSupply,
     jobName: invoiceData.jobName,
     currencyType: invoiceData.currencyType,
     TotalInvoiveValues: invoiceData.TotalInvoiveValues,
     TotalInvoiveValuesinWords: invoiceData.TotalInvoiveValuesinWords,
     invoiceItems: formattedInvoiceItems, // ✅ send number values
     accountInfo: invoiceData.accountInfo || [],
   };

   console.log("Final Payload ===>", payload);

   // send to backend
   try {
     const response = await Service.AddInvoice(payload);
     console.log("Invoice Created:", response);
   } catch (error) {
     console.error("Error creating invoice:", error);
   }
 };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Fabricator */}
        <CustomSelect
          label={
            <span>
              Fabricator <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Select Fabricator"
          options={fabricatorOptions}
          {...register("fabricatorId", { required: "Fabricator is required" })}
          onChange={setValue}
        />

        {/* Address (HQ/Branch) */}
        {fabricatorID && (
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
        )}

        {/* Client */}
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

        {/* Project */}
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

        {/* Auto-Filled Address */}
        <Input
          label="Address"
          placeholder="Address"
          {...register("address")}
          readOnly
        />

        {/* Other Fields */}
        <Input
          label="State Code"
          placeholder="State Code"
          {...register("stateCode")}
        />
        <Input label="GSTIN" placeholder="GSTIN" {...register("GSTIN")} />
        <Input
          label="Invoice Number"
          placeholder="Invoice Number"
          {...register("invoiceNumber")}
        />
        <Input
          label="Place of Supply"
          placeholder="Place of Supply"
          {...register("placeOfSupply")}
        />
        <Input
          label="Job Name"
          placeholder="Job Name"
          {...register("jobName")}
        />
        <Input
          label="Currency"
          placeholder="Currency"
          {...register("currencyType")}
        />
        <Input
          label="Total Invoice Values"
          placeholder="Total Invoice Values"
          {...register("TotalInvoiveValues")}
        />
        <Input
          label="Total Invoice Values in Words"
          placeholder="Total Invoice Values in Words"
          {...register("TotalInvoiveValuesinWords")}
        />

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Sl. #</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">SAC</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Rate (USD)</th>
                <th className="border px-2 py-1">Total (USD)</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border px-2 py-1">{index + 1}</td>

                  <td className="border px-2 py-1">
                    <Controller
                      name={`invoiceItems.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Description" size="sm" />
                      )}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <Controller
                      name={`invoiceItems.${index}.sacCode`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="998333" size="sm" />
                      )}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <Controller
                      name={`invoiceItems.${index}.unit`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="number" min="1" size="sm" />
                      )}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <Controller
                      name={`invoiceItems.${index}.rateUSD`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Rate"
                          size="sm"
                        />
                      )}
                    />
                  </td>

                  <td className="border px-2 py-1">
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
                        />
                      )}
                    />
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
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
        >
          + Add Row
        </Button>

        <div className="mt-6 text-right font-bold">
          <p>Total: ${grandTotal.toFixed(2)}</p>
          <p>IGST (18%): ${(grandTotal * 0.18).toFixed(2)}</p>
          <p>Final Invoice Value: ${(grandTotal * 1.18).toFixed(2)}</p>
        </div>

        <Button type="submit" className="mt-3 bg-blue-gray-900 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default InvoiceForm;
