/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, CustomSelect, Button, MultipleFileUpload } from "../index";
import Service from "../../config/Service";
import { toast } from "react-toastify";
import { showStaff } from "../../store/userSlice";
import SectionTitle from "../../util/SectionTitle";

const AddRFQ = () => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
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

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };
  console.log(recipientOptions);

  const CreateRFQ = async (data) => {
    const RFQData = {
      ...data,
      files,
      recipient_id: data.recipients,
      salesPersonId: data.recipients,
      status: "RECEIVED",
    };
    console.log("RFQ Data:", RFQData);

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

            <div className="w-full my-3">
              <CustomSelect
                label="Select Recipients:"
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
