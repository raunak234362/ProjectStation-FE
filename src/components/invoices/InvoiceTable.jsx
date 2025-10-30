/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input, Button } from "../index";

const InvoiceTable = ({ headerData }) => {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      items: [{ description: "", sac: "", unit: 1, rate: "", total: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const [grandTotal, setGrandTotal] = useState(0);
  const rows = watch("items");

  useEffect(() => {
    const total = rows.reduce(
      (sum, row) =>
        sum + (parseFloat(row.rate) || 0) * (parseFloat(row.unit) || 1),
      0
    );
    setGrandTotal(total);
  }, [rows]);

  const onSubmit = (data) => {
    console.log("Final Invoice Data:", { ...headerData, ...data, grandTotal });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      <h2 className="text-lg font-semibold mb-4 text-teal-600">
        Services Details
      </h2>
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
                    name={`items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Description" size="sm" />
                    )}
                  />
                </td>

                <td className="border px-2 py-1">
                  <Controller
                    name={`items.${index}.sac`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="998333" size="sm" />
                    )}
                  />
                </td>

                <td className="border px-2 py-1">
                  <Controller
                    name={`items.${index}.unit`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="number" min="1" size="sm" />
                    )}
                  />
                </td>

                <td className="border px-2 py-1">
                  <Controller
                    name={`items.${index}.rate`}
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
                  $
                  {parseFloat(rows[index]?.rate || 0) *
                    parseFloat(rows[index]?.unit || 1).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={() =>
          append({ description: "", sac: "", unit: 1, rate: "", total: "" })
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

      <Button
        type="submit"
        className="w-full mt-6 bg-teal-500 text-white hover:bg-teal-600 font-semibold"
      >
        Generate Invoice
      </Button>
    </form>
  );
};

export default InvoiceTable;
