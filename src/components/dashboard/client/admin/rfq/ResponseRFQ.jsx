"use client";

import React, { useState } from "react";
import { Button, MultipleFileUpload, Input } from "../../../../index";
import toast from "react-hot-toast";
import { useForm, Controller, set } from "react-hook-form";
import Service from "../../../../../config/Service";

const ResponseRFQ = ({ onClose, data }) => {
  const rfqID = data;
  const [submit, setSubmit] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [fileData, setFileData] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      files: [],
    },
  });

  const handleModalClose = () => {
    onClose(false);
    reset();
    setSubmit(false);
    setResponseTime(null);
  };
  const onFilesChange = (updatedFiles) => {
    console.log(updatedFiles);
    setFileData(updatedFiles);
  };
  const onSubmit = async (data) => {
    if (fileData.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    const formData = new FormData();
    console.log("Form data:", formData);

    for (let i = 0; i < fileData.length; i++) {
      formData.append("files", fileData[i]);
      console.log("File to send:", fileData[i]);
    }
    formData.append("description", data.description);
    // Log FormData entries properly
    for (const pair of formData.entries()) {
      console.log("FormDataaaaaaaaaaaaaaaaaaaa:", pair[0], pair[1]);
    }
    try {
      setSubmit(true);
      setResponseTime(new Date());
      const response = await Service.respondRfq(rfqID, formData);
      toast.success("RFQ files uploaded successfully", response);
      setSubmit(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
      setSubmit(false);
      setResponseTime(null);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full px-2 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-xl md:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-end p-2 ">
          <Button className="hover:bg-red-500" onClick={handleModalClose}>
            Close
          </Button>
        </div>
        <div className="w-full px-2 py-2 mb-4 text-xl font-bold text-center text-white bg-teal-400 rounded-lg">
          RESPONSE FORM
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-4">
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={fileData}
              accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx"
              {...register("files")}
            />
            {errors.files && (
              <div className="text-red-500">This field is required</div>
            )}
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              type="textarea"
              placeholder="Please enter the issue"
              className="w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
              rows={2}
              {...register("description", { required: true })}
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={submit}>
            {submit ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {submit && responseTime && (
          <p className="mt-4 text-sm text-gray-600">
            Submitted at: {responseTime.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResponseRFQ;
