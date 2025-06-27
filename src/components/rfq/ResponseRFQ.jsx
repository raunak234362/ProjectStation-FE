/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, MultipleFileUpload, Input } from "../index";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Service from "../../config/Service";

const ResponseRFQ = ({ onClose, rfqID }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [files, setFiles] = useState([]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      files: [],
    },
  });

  const handleModalClose = useCallback(() => {
    onClose(false);
    reset();
    setIsSubmitting(false);
    setResponseTime(null);
    setFiles([]);
  }, [onClose, reset]);

  const onFilesChange = useCallback((updatedFiles) => {
    setFiles(updatedFiles);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      if (files.length === 0) {
        toast.error("Please select at least one file.");
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("description", data.description);

      try {
        setIsSubmitting(true);
        setResponseTime(new Date());
        const response = await Service.respondRfq(rfqID, formData);
        toast.success("RFQ response submitted successfully");
        handleModalClose();
      } catch (error) {
        console.error("RFQ submission error:", error);
        toast.error("Failed to submit RFQ. Please try again.");
        setIsSubmitting(false);
        setResponseTime(null);
      }
    },
    [files, rfqID, handleModalClose]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-4 sm:p-6">
        <div className="flex justify-end mb-4">
          <Button
            className="hover:bg-red-500"
            onClick={handleModalClose}
            disabled={isSubmitting}
          >
            Close
          </Button>
        </div>
        <h2 className="mb-4 text-xl font-bold text-center text-white bg-teal-400 rounded-lg py-2">
          Response Form
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={files}
              accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx"
              disabled={isSubmitting}
              {...register("files")}
            />
            {errors.files && (
              <p className="mt-1 text-sm text-red-500">
                This field is required
              </p>
            )}
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              type="textarea"
              placeholder="Enter description"
              className="w-full mt-1 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              rows={2}
              disabled={isSubmitting}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {responseTime && (
          <p className="mt-4 text-sm text-gray-600">
            Submitted at: {responseTime.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

ResponseRFQ.propTypes = {
  onClose: PropTypes.func.isRequired,
  rfqID: PropTypes.string.isRequired,
};

export default ResponseRFQ;
