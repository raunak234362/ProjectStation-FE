/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  MultipleFileUpload,
  Toggle,
} from "../index";
import Service from "../../config/Service";
import toast from "react-hot-toast";
import { showStaff } from "../../store/userSlice";
import SectionTitle from "../../util/SectionTitle";
import JoditEditor from "jodit-react";

const AddRFQ = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm();

  const dispatch = useDispatch();
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const ClientData = useSelector((state) => state.fabricatorData?.clientData);
  const userData = useSelector((state) => state.userData?.staffData);
  const userType = sessionStorage.getItem("userType");

  const [joditContent, setJoditContent] = useState("");
  const [files, setFiles] = useState([]);

  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p",
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: "custom",
    link: {
      processPastedLink: true,
      openInNewTabCheckbox: true,
      noFollowCheckbox: true,
    },
    defaultValue: "",
    removeEmptyBlocks: true,
    cleanHTML: {
      removeEmptyElements: true,
    },
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await Service.allEmployee();
        dispatch(showStaff(staffData));
      } catch (err) {
        console.error("Failed to fetch staff data:", err);
      }
    };
    fetchStaff();
  }, [dispatch]);

  const staffData = useSelector((state) => state?.userData?.staffData) || [];

  const recipientOptions = staffData
    .filter((rec) => rec.is_sales || rec.is_superuser)
    .map((rec) => ({
      label: `${rec.f_name} ${rec.m_name || ""} ${rec.l_name}`,
      value: rec.id,
    }));

  const tools = watch("tools");
  const otherTool = watch("otherTool");

  useEffect(() => {
    if (tools !== "OTHER" && otherTool) {
      setValue("otherTool", "");
      clearErrors("otherTool");
    }
  }, [tools, otherTool, setValue, clearErrors]);

  useEffect(() => {
    if (tools === "OTHER" && (!otherTool || otherTool.trim() === "")) {
      setValue("otherTool", "", { shouldValidate: true });
    }
  }, [tools, otherTool, setValue]);

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  const CreateRFQ = async (data) => {
    const RFQData = {
      ...data,
      files,
      fabricatorId: data.fabricatorId || userData.fabricatorId,
      recipient_id: data.recipients,
      salesPersonId: data.recipients,
      status: "RECEIVED",
      sender_id: data.sender_id,
      estimationDate: data.estimationDate ? new Date().toISOString() : null,
    };

    try {
      const response = await Service.addRFQ(RFQData);
      toast.success("RFQ created successfully");
    } catch (error) {
      toast.error("Error creating RFQ");
      console.error("CreateRFQ Error:", error);
    }
  };

  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-full py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(CreateRFQ)} className="space-y-6">
          {/* Project Info */}
          <SectionTitle title="Project Information" />
          <div className="px-1 my-2 md:px-2">
            {userType === "client" ? null : (
              <div>
                <CustomSelect
                  label={
                    <>
                      Fabricator <span className="text-red-500">*</span>
                    </>
                  }
                  placeholder="Select Fabricator"
                  options={fabricatorData?.map((fab) => ({
                    label: fab.fabName,
                    value: fab.id,
                  }))}
                  {...register("fabricatorId", {
                    required: "Fabricator is required",
                  })}
                  onChange={setValue}
                />

                <div className="w-full my-3">
                  <CustomSelect
                    label={
                      <>
                        Fabricator Point of Contact{" "}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    placeholder="Select Fabricator Point of Contact"
                    options={ClientData?.map((fab) => ({
                      label: `${fab.f_name} ${fab.m_name || ""} ${fab.l_name}`,
                      value: fab.id,
                    }))}
                    {...register("sender_id", {
                      required: "Fabricator contact is required",
                    })}
                    onChange={setValue}
                  />
                  {errors.sender_id && (
                    <div className="text-red-600">
                      {errors.sender_id.message}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="w-full my-3">
              <CustomSelect
                label={
                  <>
                    WBT Point of Contact <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Select WBT Point of Contact"
                options={recipientOptions}
                {...register("recipients", {
                  required: "WBT contact is required",
                })}
                onChange={setValue}
              />
              {errors.recipients && (
                <div className="text-red-600">{errors.recipients.message}</div>
              )}
            </div>

            <div className="w-full mt-3">
              <Input
                label={
                  <>
                    Project Name <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Project Name"
                size="lg"
                color="blue"
                {...register("projectName", {
                  required: "Project name is required",
                })}
              />
              {errors.projectName && (
                <div className="text-red-600">
                  {errors.projectName.message}
                </div>
              )}
            </div>
            <div className="w-full mt-3">
              <Input
                label="Project Order No."
                placeholder="Project Order No."
                size="lg"
                color="blue"
                {...register("projectNumber")}
              />
            </div>
          </div>

          {/* Details */}
          <SectionTitle title="Details" />
          <div className="px-1 my-2 md:px-2">
            <div className="w-full my-3">
              <Input
                label="Subject/Remarks"
                placeholder="Subject/Remarks"
                size="lg"
                color="blue"
                {...register("subject")}
              />
            </div>
            <div className="w-full my-3">
              <JoditEditor
                value={joditContent}
                config={joditConfig}
                onBlur={(newContent) => {
                  setJoditContent(newContent);
                  setValue("description", newContent, { shouldValidate: true });
                }}
                className="w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full my-3">
              <CustomSelect
                label={
                  <>
                    Tools <span className="text-red-500">*</span>
                  </>
                }
                options={["TEKLA", "SDS2", "BOTH", "NO_PREFERENCE"].map(
                  (tool) => ({
                    label: tool,
                    value: tool,
                  })
                )}
                {...register("tools", { required: "Tools selection is required" })}
                onChange={setValue}
              />
              {errors.tools && (
                <div className="text-red-600">{errors.tools.message}</div>
              )}
            </div>
            <div className="w-full my-3">
              <Input
                label="BID Amount (in USD)"
                type="float"
                {...register("bidPrice")}
              />
            </div>
            <div className="w-full my-3">
              <Input
                label={
                  <>
                    Due Date <span className="text-red-500">*</span>
                  </>
                }
                type="date"
                {...register("estimationDate", {
                  required: "Due date is required",
                })}
              />
              {errors.estimationDate && (
                <div className="text-red-600">
                  {errors.estimationDate.message}
                </div>
              )}
            </div>
          </div>

          <SectionTitle title="Connection Design Scope" />
          <div className="grid md:grid-cols-3 gap-4 mx-3 mt-4">
            <Toggle label="Main Design" {...register("connectionDesign")} />
            <Toggle label="Misc Design" {...register("miscDesign")} />
            <Toggle label="Custom Design" {...register("customer")} />
          </div>

          <SectionTitle title="Detailing Scope" />
          <div className="grid md:grid-cols-3 gap-4 mt-4  mx-3">
            <Toggle label="Main Steel" {...register("detailingMain")} />
            <Toggle label="Miscellaneous Steel" {...register("detailingMisc")} />
          </div>

          {/* File Upload */}
          <SectionTitle title="Attach File" />
          <div className="px-1 my-2 md:px-2">
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={files}
              accept="image/*,application/pdf,.doc,.docx"
            />
          </div>

          <div className="text-center w-full">
            <Button type="submit">Create RFQ</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRFQ;
