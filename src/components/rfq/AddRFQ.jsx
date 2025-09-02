/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  MultipleFileUpload,
  Toggle,
} from "../index";
import Service from "../../config/Service";
import toast, { Toaster } from "react-hot-toast";
import { showStaff } from "../../store/userSlice";
import SectionTitle from "../../util/SectionTitle";
import JoditEditor from "jodit-react";

const AddRFQ = () => {
  // Use form hook initialization
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm();

  // Dispatch variable for redux
  const dispatch = useDispatch();

  // managing the states
  const [joditContent, setJoditContent] = useState(""); // Local state for JoditEditor
  const [files, setFiles] = useState([]);
  // Text editor
  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p", // Use paragraph as default block element
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: "custom",
    link: {
      processPastedLink: true,
      openInNewTabCheckbox: true,
      noFollowCheckbox: true,
    },
    defaultValue: "", // Start with empty content
    removeEmptyBlocks: true, // Prevent empty <p><br></p>
    cleanHTML: {
      removeEmptyElements: true, // Additional cleanup for empty elements
    },
  };

  // Fetch staff data only once and store in Redux
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

  // Effect to clear "otherTool" if tools is NOT "OTHER"
  useEffect(() => {
    if (tools !== "OTHER" && otherTool) {
      setValue("otherTool", "");
      clearErrors("otherTool");
    }
  }, [tools, otherTool, setValue, clearErrors]);

  // Effect to enforce "otherTool" required validation only when "OTHER" is chosen
  useEffect(() => {
    if (tools === "OTHER" && (!otherTool || otherTool.trim() === "")) {
      setValue("otherTool", "", { shouldValidate: true });
    }
  }, [tools, otherTool, setValue]);

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };
  console.log(recipientOptions);

  const CreateRFQ = async (data) => {
    console.log("Form Data:", JSON.stringify(data, null, 2));
    const RFQData = {
      ...data,
      files,
      recipient_id: data.recipients,
      salesPersonId: data.recipients,
      status: "RECEIVED",
      estimationDate: data.estimationDate ? new Date().toISOString() : null,
    };

    try {
      const response = await Service.addRFQ(RFQData);
      toast.success("RFQ created successfully");
      console.log("RFQ Response:", response);
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
            <div className="w-full mt-3">
              <Input
                label="Project Name:"
                placeholder="Project Name:"
                size="lg"
                color="blue"
                {...register("projectName", {
                  required: "Project name is required",
                })}
              />
              {errors.projectName && (
                <div className="text-red-600">{errors.projectName.message}</div>
              )}
            </div>
            <div className="w-full mt-3">
              <Input
                label="Project Order No.:"
                placeholder="Project Order No.:"
                size="lg"
                color="blue"
                {...register("projectNumber")}
              />
              {errors.projectName && (
                <div className="text-red-600">{errors.projectName.message}</div>
              )}
            </div>

            <div className="w-full my-3">
              <CustomSelect
                label="Select Point of Contact:"
                placeholder="Select Recipients"
                options={recipientOptions}
                {...register("recipients", { required: true })}
                onChange={setValue}
              />

              {errors.recipients && (
                <div className="text-red-600">{errors.recipients.message}</div>
              )}
            </div>
          </div>

          {/* Details */}
          <SectionTitle title="Details" />
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
            {tools === "OTHER" ? (
              <div className="w-full my-3">
                <Input
                  label="Other Tool:"
                  placeholder="Other Tools"
                  size="lg"
                  color="blue"
                  {...register("otherTool", {
                    required:
                      tools === "OTHER" ? "Please specify the tool" : false,
                    validate: (value) =>
                      tools !== "OTHER" ||
                      (value && value.trim() !== "") ||
                      "Please specify the tool",
                  })}
                />
                {errors.otherTool && (
                  <div className="text-red-600">{errors.otherTool.message}</div>
                )}
              </div>
            ) : (
              <div className="w-full my-3">
                <CustomSelect
                  label="Tools"
                  options={["TEKLA", "SDS2", "PEMB", "OTHER"].map((tool) => ({
                    label: tool,
                    value: tool,
                  }))}
                  {...register("tools")}
                  onChange={setValue}
                />
                {errors.tools && (
                  <div className="text-red-600">{errors.tools.message}</div>
                )}
              </div>
            )}
            <div className="w-full my-3">
              <Input
                label="Due Date"
                type="date"
                {...register("estimationDate", { required: true })}
              />
            </div>
          </div>
          <SectionTitle title="Scope of Work" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Toggle label="Main Design" {...register("connectionDesign")} />
            <Toggle label="Misc Design" {...register("miscDesign")} />
            <Toggle label="Customer Design" {...register("customer")} />
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
