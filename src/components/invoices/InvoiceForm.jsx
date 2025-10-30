import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  } = useForm();
  const projects = useSelector(
    (state) => state?.projectData?.projectData || []
  );
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );

  const fabricatorID = watch("fabricatorId");
  console.log(fabricatorID);

  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(projects);

  const filteredproject = projects?.filter(
    (proj) => proj.fabricatorID === fabricatorID
  );
  console.log(filteredproject);

  const projectID = watch("projectID");

  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));
  console.log(clientOptions);

  const onSubmit = (invoiceData) => {
    console.log("formData======", invoiceData);
    const customerName = fabricatorData?.find(
      (customer) => customer.id === invoiceData?.fabricatorId
    );
    const clientName = clientData?.find(
      (client) => client.id === invoiceData?.clientId
    );
    const payload = {
      ...invoiceData,
      customerName: customerName?.fabName,
      clientName: clientName?.f_name,
    };
    console.log("payloadData--------", payload);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <CustomSelect
          label={
            <span>
              Fabricator <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Select Fabricator"
          options={fabricatorData?.map((fab) => ({
            label: fab.fabName,
            value: fab.id,
          }))}
          {...register("fabricatorId", { required: "Fabricator is required" })}
          onChange={setValue}
        />
        <CustomSelect
          label={
            <span>
              client <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Select client"
          options={clientOptions}
          {...register("clientId", { required: "client is required" })}
          onChange={setValue}
        />
        <CustomSelect
          label={
            <span>
              Project <span className="text-red-500">*</span>
            </span>
          }
          placeholder="Select Project "
          options={projects?.map((proj) => ({
            label: proj.name,
            value: proj.id,
          }))}
          {...register("projectID", { required: "projectname is required" })}
          onChange={setValue}
        />

        <Input label="Address" placeholder="Address" {...register("address")} />

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
          label="Place of supply"
          placeholder="Place of supply "
          {...register("placeOfSupply")}
        />

        <Input
          label="Job Name"
          placeholder=" Job Name"
          {...register("jobName")}
        />
        <Input
          label="Currency "
          placeholder=" Currency"
          {...register("currencyType")}
        />

        <Input
          label="Total Invoice in words"
          placeholder="Total Invoice in words"
          {...register("TotalInvoiceValues")}
        />

        <Input
          label="Total Invoice Values in Words"
          placeholder="Total Invoice Values in Words"
          {...register("TotalInvoiceValuesinWords")}
        />

        <Button type="submit">submit</Button>
      </form>
    </div>
  );
};

export default InvoiceForm;
