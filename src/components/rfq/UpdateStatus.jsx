/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form";
import Button from "../fields/Button";
import Select from "../fields/Select";
import MultipleFileUpload from "../fields/MultipleFileUpload";
import Input from "../fields/Input";
import { useCallback, useState } from "react";
import Service from "../../config/Service";
import { toast } from "react-toastify";

const UpdateStatus = ({ rfqID, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  // const handleFinalSubmit = () => {
  //   console.log("clicked");
  // };
  const rfqId = rfqID
  console.log("RFQ ID:", rfqId);
  const handleViewModal = () => {
    onClose();
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      files: [],
    },
  });

  const onFilesChange = useCallback((updatedFiles) => {
    setFiles(updatedFiles);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      if (!files.length) {
        toast.error("Please select at least one file.");
        return;
      }
      console.log("RFQ ID in UpdateStatus:", data);

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("description", data.description);

      try {
        setIsSubmitting(true);
        await Service.respondRfq(rfqID, formData);
        toast.success("RFQ response submitted successfully");
      } catch (err) {
        console.error("RFQ submission error:", err);
        toast.error("Failed to submit RFQ. Please try again.");
        setIsSubmitting(false);
      }
    },
    [files, rfqID]
  );

  return (
    <>
      {/* Optional: form elements can go here */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-60">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 sm:w-[90%] md:w-[70%] lg:w-[30%] h-auto">
          <Button
            className="absolute flex items-center justify-center px-3 py-1 text-white transition bg-red-600 rounded-full shadow-md top-4 right-4 hover:bg-red-700"
            onClick={handleViewModal}
          >
            Close
          </Button>
          <div className="p-5 mt-5 rounded-lg shadow-md bg-gray-100/50">
            <div>
              <h2 className="pb-2 mb-6 text-2xl font-extrabold text-teal-600 border-b border-teal-300">
                RFQ Status Update
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="w-full mb-4">
                  <label className="block mt-2 text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    label="status"
                    name="status"
                    color="blue"
                    options={[
                      // { label: "Select Status", value: ""},
                      { label: "Approved", value: "Approved" },
                      { label: "Re-Approval", value: "Re-Approval" },
                      { label: "Close", value: "Close" },
                    ]}
                  />
                  <label className="block mt-2 text-sm font-medium text-gray-700"></label>
                  <MultipleFileUpload
                    label="Select Files"
                    onFilesChange={onFilesChange}
                    files={files}
                    accept="image/*,application/pdf,.pdf,.pptx,.txt,.doc,.docx"
                    {...register("files")}
                  />
                  {errors.files && (
                    <div className="text-red-500">This field is required</div>
                  )}
                  <label className="block mt-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Input
                    type="textarea"
                    placeholder="Please enter the reason(optional)"
                    className="w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-teal-400"
                    rows={2}
                    {...register("description")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStatus;
