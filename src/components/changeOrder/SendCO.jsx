/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Input,
  CustomSelect,
  Button,
  MultipleFileUpload,
} from "../index";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Service from "../../config/Service";
import SendCoTable from "./SendCoTable";

const SendCO = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);

  // Redux state
  const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  // Step 1 form
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  // Fabricator selection handling
  const fabricatorID = watch("fabricator_id");
  const recipientID = watch("recipient_id");

  const selectedFabricator = fabricatorData?.find(
    (fabricator) => fabricator.id === fabricatorID
  );

  const clientName = selectedFabricator
    ? clientData?.find((client) => client.id === selectedFabricator.clientID)
        ?.name
    : "";

  // Options for dropdowns
  const fabricatorOptions =
    fabricatorData?.map((fabricator) => ({
      label: fabricator.fabName,
      value: fabricator.id,
    })) || [];

  const filteredClients =
    clientData?.filter((client) => client.fabricatorId === fabricatorID) || [];

  const clientOptions =
    filteredClients?.map((client) => ({
      label: `${client.f_name} ${client.l_name}`,
      value: client.id,
    })) || [];

  const filteredProjects =
    projectData?.filter((project) => project.fabricatorID === fabricatorID) ||
    [];

  const projectOptions =
    filteredProjects?.map((project) => ({
      label: project.name,
      value: project.id,
    })) || [];

  // File upload handler
  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };
  const [dataCO, setDataCO] = useState();
  // Step 1 form submission handler
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();

      // Append files
      files?.forEach((file) => {
        formData.append("files", file);
      });
      console.log("Step 1 data:", data);
      const coData = {
        ...data,
        files,
        recepient_id: data.recipient_id,
        fabricator_id: data.fabricator_id,
      };
      const response = await Service.addCO(coData);
      toast.success("CO created successfully");
      // Move to step 2
      setDataCO(response.data);
      setStep(2);
      setSave(true);
      setClick(true);
    } catch (error) {
      toast.error("Error saving details");
      console.error("Error saving details:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [click, setClick] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [save, setSave] = useState(false);

  return (
    <>
      <div>
        <div
          className="overflow-x-auto overflow-y-auto h-fit"
        >
          <div className="container w-full py-6 mx-auto ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 bg-white rounded-lg shadow-md "
            >
              {/* Project Information Section */}
              <div className="px-2 py-2 mb-4 font-bold text-white rounded-lg bg-teal-500/50">
                Project Information:
              </div>

              <div className="space-y-4">
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
                  {errors.fabricator_id && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>

                <div className="w-full">
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
                  {errors.project_id && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>

                <div className="w-full">
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
                  {errors.recipient_id && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="px-2 py-2 mt-6 mb-4 font-bold text-white rounded-lg bg-teal-500/50">
                Details:
              </div>

              <div className="space-y-4">
                <div className="w-full">
                  <Input
                    label="Subject/Remarks:"
                    placeholder="Subject/Remarks"
                    size="lg"
                    color="blue"
                    {...register("remark", { required: true })}
                  />
                  {errors.remark && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>

                <div className="w-full">
                  <Input
                    type="number"
                    label="Change Order No. CO#"
                    placeholder="CO#"
                    size="lg"
                    color="blue"
                    min="0"
                    {...register("changeOrderNumber", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.changeOrder && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>

                <div className="w-full">
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

              <div className="mt-6">
                <Button
                  type="submit"
                  // onClick={handleSave}
                  className="w-full text-white bg-blue-500"
                >
                  Save
                </Button>
              </div>
              <div className="mt-6">
                <Button
                  // onClick={handleNext}
                  className="w-full text-white bg-blue-500"
                >
                  Next
                </Button>
              </div>
            </form>
            {/* {isModalOpen && <SendCoTable data={dataCO.id} onClose={handleModalClose} />} */}
            {click && save && (
              <SendCoTable data={dataCO?.id} onClose={handleModalClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SendCO;
