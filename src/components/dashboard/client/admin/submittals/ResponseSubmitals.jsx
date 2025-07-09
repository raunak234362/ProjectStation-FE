/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button, Input, MultipleFileUpload, Toggle } from "../../../../index";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Service from "../../../../../config/Service";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const ResponseRFQ = ({ onClose, submittalsID }) => {
  const submittals = submittalsID;
  const [submit, setSubmit] = useState(false);
  const [fileData, setFileData] = useState([]);

  const {
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      files: [],
      status: "",
      description: "",
      reason: "",
    },
  });

  const watchStatus = watch("status");

  const handleModalClose = () => {
    onClose(false);
    reset();
    setSubmit(false);
    setFileData([]);
  };

  const onFilesChange = (files) => {
    setFileData(files);
  };

  const onSubmit = async (data) => {
    if (fileData.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const submittalResponse = {
      status: data.status,
      description: data.description || "",
      reason: data.reason || "",
      files: fileData,
      respondedAt: new Date(),
    };

    try {
      setSubmit(true);
      await Service.respondSubmittals(submittals, submittalResponse);
      toast.success("Submittals files uploaded successfully");
      setSubmit(false);
      handleModalClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
      setSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6 flex flex-col">
        <Button
          onClick={handleModalClose}
          className="absolute transition bg-red-500 top-4 right-4 hover:bg-red-800"
          aria-label="Close modal"
        >
          Close
        </Button>

        <h2 className="py-2 mb-6 text-2xl font-bold text-center text-white bg-teal-600 rounded-lg">
          Submittals Response
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <section>
            <div className="p-4 rounded-lg shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-teal-700">
                Description
              </h3>
              <Input
                type="textarea"
                placeholder="Please enter the description"
                className="w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
                rows={4}
                {...register("description")}
              />
            </div>
          </section>
          {/* File Upload Section */}
          <section>
            <h3 className="mb-3 text-lg font-semibold text-teal-700">
              Upload Files
            </h3>
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={fileData}
              accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx"
              {...register("files")}
            />
            {errors.files && (
              <p className="mt-1 text-sm text-red-600">
                This field is required
              </p>
            )}
          </section>

          {/* Status Section */}
          <section>
            <div className="p-4 rounded-lg shadow-lg">
              <FormControl>
                <FormLabel id="status-radio-buttons-label">
                  <h3 className="mb-3 text-lg font-semibold text-teal-700">
                    Status
                  </h3>
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="status-radio-buttons-label"
                  name="status"
                  value={watchStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("status", value);
                  }}
                >
                  <FormControlLabel
                    value="APPROVED"
                    control={<Radio />}
                    label="Approved"
                  />
                  <FormControlLabel
                    value="PARTIAL"
                    control={<Radio />}
                    label="Partially Approved"
                  />
                  <FormControlLabel
                    value="NOT_APPROVED"
                    control={<Radio />}
                    label="Not Approved"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Conditional Textarea */}
            {(watchStatus === "PARTIAL" || watchStatus === "NOT_APPROVED") && (
              <Input
                type="textarea"
                placeholder="Please enter the issue"
                className="w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
                rows={4}
                {...register("reason")}
              />
            )}
          </section>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
            disabled={submit}
          >
            {submit ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResponseRFQ;
