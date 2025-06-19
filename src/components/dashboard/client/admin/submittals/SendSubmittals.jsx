/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  MultipleFileUpload,
} from "../../../../index";
import { toast } from "react-toastify";
import Service from "../../../../../config/Service";

const SendSubmittals = () => {
  const [recipients, setRecipients] = useState([]);
  const [files, setFiles] = useState([]);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector((state) => state?.fabricatorData?.fabricatorData);
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
 
  // Fetch recipients on mount
  useEffect(() => {
    const getRecipients = async () => {
      try {
        const response = await Service.getRecipients();
        console.log("---------------------",response);
        setRecipients(response.data);
      } catch (error) {
        console.error("Error fetching recipients:", error);
      }
    };
    getRecipients();
  }, []);
  console.log("==================================",recipients)
const recipientID = watch("recepient_id");
console.log("==================================",recipientID)
  // Filter managers and superusers
  const recipientsOptions = recipients
    .filter((rec) => rec.is_manager || rec.is_superuser)
    .map((rec) => ({
      label: `${rec.f_name} ${rec.m_name} ${rec.l_name}`,
      value: rec.id,
    }));

    console.log("==================================",recipientsOptions)

  const fabricatorID = watch("fabricator_id");

  // Find selected fabricator and its client
  const selectedFabricator = fabricatorData?.find((fabricator) => fabricator.id === fabricatorID);
  const clientName = selectedFabricator
    ? clientData?.find((client) => client.id === selectedFabricator.clientID)?.name
    : "";

  // Filter and map fabricator, client, and project options
  const fabricatorOptions = fabricatorData?.map((fabricator) => ({
    label: fabricator.fabName,
    value: fabricator.id,
  }));

  const clientOptions = clientData
    ?.filter((client) => client.fabricatorId === fabricatorID)
    .map((client) => ({
      label: `${client.f_name} ${client.l_name}`,
      value: client.id,
    }));

  const projectOptions = projectData
    ?.filter((project) => project.fabricatorId === fabricatorID)
    .map((project) => ({
      label: project.name,
      value: project.id,
    }));

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  const CreateSubmittals = async (data) => {
    console.log("Submittals------------",data)
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const submittalData = { ...data, files };

    try {
      const response = await Service.addSubmittal(submittalData);
      toast.success("Submittal created successfully");
    } catch (error) {
      toast.error("Error creating submittal");
      console.error("Error creating submittal:", error);
    }
  };

  return (
    <div className="flex w-full justify-center text-black my-5">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(CreateSubmittals)}>
          {/* Project Information */}
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Project Information:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full mt-3">
              <CustomSelect
                label="Project Name:"
                color="blue"
                size="lg"
                name="project_id"
                options={[{ label: "Select Project", value: "" }, ...projectOptions]}
                {...register("project_id", { required: true })}
                onChange={setValue}
              />
              {errors.project_id && <div className="text-red-500">This field is required</div>}
            </div>
            <div className="w-full my-3">
              <CustomSelect
                label="Select Recipients:"
                placeholder="Select Recipients"
                size="lg"
                color="blue"
                options={[{ label: "Select Recipient", value: "" }, ...recipientsOptions]}
                {...register("recepient_id", { required: true })}
                onChange={setValue}
              />
              {errors.recipient_id && <div className="text-red-500">This field is required</div>}
            </div>
          </div>

          {/* Details */}
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Details:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full my-3">
              <Input
                label="Subject/Remarks:"
                placeholder="Subject/Remarks"
                size="lg"
                color="blue"
                {...register("subject", { required: true })}
              />
              {errors.subject && <div className="text-red-500">This field is required</div>}
            </div>
            <div className="w-full my-3">
              <Input
                type="textarea"
                label="Description:"
                placeholder="Description"
                size="lg"
                color="blue"
                {...register("description")}
              />
            </div>
          </div>

          {/* Attach Files */}
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Attach Files:
          </div>
          <div className="my-2 md:px-2 px-1">
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={files}
              accept="image/*,application/pdf,.doc,.docx"
            />
          </div>

          <div className="my-5 w-full">
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendSubmittals;
