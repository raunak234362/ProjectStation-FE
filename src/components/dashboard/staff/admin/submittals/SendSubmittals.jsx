/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  Toggle,
  MultipleFileUpload,
} from "../../../../index";
import { addRFI } from "../../../../../store/projectSlice";
import Service from "../../../../../config/Service";
import toast from "react-hot-toast";

const SendSubmittals = () => {
  const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(clientData);
  const dispatch = useDispatch();
  // console.log(projectData);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);

  const fabricatorID = watch("fabricator_id");
  console.log("Selected Fabricator ID:", fabricatorID);

  const selectedFabricator = fabricatorData?.find(
    (fabricator) => fabricator.id === fabricatorID
  );
  const clientName = selectedFabricator
    ? clientData?.find((client) => client.id === selectedFabricator.clientID)
        ?.name
    : "";
  console.log("Client Name:", clientName);

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  const fabricatorOptions = fabricatorData?.map((fabricator) => ({
    label: fabricator.fabName,
    value: fabricator.id,
  }));

  const filteredClients = clientData?.filter(
    (client) => client.fabricatorId === fabricatorID
  );
  console.log("Filtered Clients:", filteredClients);
  const clientOptions = filteredClients?.map((client) => ({
    label: `${client.f_name} ${client.l_name}`,
    value: client.id,
  }));

  const filteredProjects = projectData?.filter(
    (project) => project.fabricatorID === fabricatorID
  );
  console.log("Filtered Projects:", filteredProjects);
  const projectOptions = filteredProjects?.map((project) => ({
    label: project.name,
    value: project.id,
  }));

  const CreateSubmittals = async (data) => {
    const formData = new FormData();

    // Append files
    // formData.append("stage", data.stage);
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const submittals = { ...data, files };
    console.log("Sending Data:", submittals); // Debugging

    try {
      const response = await Service.addSubmittal(submittals);
      toast.success("Submittals created successfully");
      console.log("Submittals created successfully:", response);
    } catch (error) {
      toast.error("Error creating Submittals");
      console.error("Error creating Submittals:", error);
    }
  };



  return (
    <>
      <div className="h-screen">
        <div className="overflow-auto max-h-[70%]">
          <div className="flex justify-center w-full my-5 text-black">
            <div className="w-full h-full px-2 py-3 overflow-y-auto md:px-10">
              <form onSubmit={handleSubmit(CreateSubmittals)}>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                  Project Information:
                </div>
                <div className="px-1 my-2 md:px-2">
                  <div className="w-full">
                    <CustomSelect
                      label="Fabricator Name:"
                      color="blue"
                      size="lg"
                      name="fabricator"
                      options={[
                        { label: "Select Fabricator", value: "" },
                        ...fabricatorOptions,
                      ]}
                      {...register("fabricator_id", { required: true })}
                      onChange={setValue}
                    />
                    {errors.fabricator && <div>This field is required</div>}
                  </div>
                  <div className="w-full mt-3">
                    <CustomSelect
                      label="Project Name:"
                      color="blue"
                      size="lg"
                      name="project"
                      options={[
                        { label: "Select Project", value: "" },
                        ...projectOptions,
                      ]}
                      {...register("project_id", { required: true })}
                      onChange={setValue}
                    />
                    {errors.project && <div>This field is required</div>}
                  </div>
                  <div className="w-full my-3">
                    <CustomSelect
                      label="Select Recipients:"
                      placeholder="Select Recipients"
                      size="lg"
                      color="blue"
                      options={[
                        { label: "Select Fabricator", value: "" },
                        ...clientOptions,
                      ]}
                      {...register("recepient_id", { required: true })}
                      onChange={setValue}
                    />
                    {errors.recipients && <div>This field is required</div>}
                  </div>
                </div>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                  Details:
                </div>
                <div className="px-1 my-2 md:px-2">
                  <div className="w-full my-3">
                    <Input
                      label="Subject/Remarks:"
                      placeholder="Subject/Remarks"
                      size="lg"
                      color="blue"
                      {...register("subject", { required: true })}
                    />
                  </div>
                  <div className="w-full my-3">
                    <Input
                      type="textarea"
                      label="Description:"
                      placeholder="Description"
                      size="lg"
                      color="blue"
                      {...register("description", { required: true })}
                    />
                  </div>
                  <div className="w-full my-3">
                    <CustomSelect
                      label="Stage"
                      name="Stage"
                      color="blue"
                      options={[
                        { label: "Select Stage", value: "" },
                        { label: "(IFA)Issue for Approval", value: "IFA" },
                        { label: "(RIFA)Re-issue for Approval", value: "RIFA" },
                        { label: "(IFC)Issue for Construction", value: "IFC" },
                        {
                          label: "(RIFC)Re-issue for Construction",
                          value: "RIFC",
                        },
                      ]}
                      {...register("Stage", { required: true })}
                      onChange={setValue}
                    />
                    {errors.Stage && <div>This field is required</div>}
                  </div>
                </div>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                  Attach Files:
                </div>
                <div className="px-1 my-2 md:px-2">
                  <MultipleFileUpload
                    label="Select Files"
                    onFilesChange={onFilesChange}
                    files={files}
                    accept="image/*,application/pdf,.doc,.docx"
                    {...register("files")}
                  />
                </div>

                <div className="w-full my-5">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendSubmittals;
