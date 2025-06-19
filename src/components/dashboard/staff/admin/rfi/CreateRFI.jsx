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
import { toast } from "react-toastify";
import socket from "../../../../../socket";

const CreateRFI = () => {
  const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(clientData);
  const dispatch = useDispatch();
  console.log(projectData);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);

  const fabricatorID = watch("fabricator_id");
  const recipientID = watch("recipient_id");
  console.log("Selected Fabricator ID:", fabricatorID);
  console.log("Selected Recipient ID:", recipientID);
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

  const CreateRFI = async (data) => {
    const formData = new FormData();

    // Append files
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const rfiData = { ...data, files, recepient_id: recipientID, fabricator_id:fabricatorID };
    console.log("Sending Data:", rfiData); // Debugging

    try {
      const response = await Service.addRFI(rfiData);
      toast.success("RFI created successfully");
      console.log("RFI created successfully:", response);
      if (response.user) {
        socket.emit("sendNotification", {
          userId: response.user, // should be the assigned user's ID
          message: `📌 New Task Assigned: ${projectData.name}`,
          title: "New Task",
        });
      }
    } catch (error) {
      toast.error("Error creating RFI");
      console.error("Error creating RFI:", error);
    }
  };

  return (
    <>
      <div className="h-screen">
        <div className="overflow-auto max-h-[70%]">
          <div className="flex justify-center w-full my-5 text-black">
            <div className="w-full h-full px-2 py-3 overflow-y-auto md:px-10">
              <form onSubmit={handleSubmit(CreateRFI)}>
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
                        { label: "Select Recipients", value: "" },
                        ...clientOptions,
                      ]}
                      {...register("recipient_id", { required: true })}
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
                      {...register("subject")}
                    />
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

export default CreateRFI;
