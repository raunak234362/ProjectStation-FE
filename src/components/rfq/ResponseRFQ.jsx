/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, MultipleFileUpload, Input } from "../index";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Service from "../../config/Service";

const ResponseRFQ = ({ onClose, rfqID }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const handleModalClose = useCallback(() => {
    onClose(false);
    reset();
    setIsSubmitting(false);
    setFiles([]);
  }, [onClose, reset]);

  const onFilesChange = useCallback((updatedFiles) => {
    setFiles(updatedFiles);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("description", data.description);
      
      try {
        await Service.respondRfq(rfqID, formData);
        toast.success("RFQ response submitted successfully");
      } catch (err) {
        console.error("RFQ submission error:", err);
        toast.error("Failed to submit RFQ. Please try again.");
      }
    },
    [files, rfqID, handleModalClose]
  );

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="sticky top-0 z-10 flex flex-row items-center justify-between p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
        <div className="text-lg font-semibold text-white">Response To RFQ</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MultipleFileUpload
          label="Upload Files"
          onFilesChange={onFilesChange}
          files={files}
          accept="image/*,application/pdf,.doc,.docx,.pptx"
        />
        <div>
          <Input
            label="Description"
            type="textarea"
            rows={3}
            className="w-full mt-1 rounded-md focus:ring-2 "
            disabled={isSubmitting}
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

     
    </div>
  );
};

ResponseRFQ.propTypes = {
  onClose: PropTypes.func.isRequired,
  rfqID: PropTypes.string.isRequired,
};

export default ResponseRFQ;
