import React from "react";
import Button from "../../../../fields/Button";
import Input from "../../../../fields/Input";
import Select from "../../../../fields/Select";
import MultipleFileUpload from "../../../../fields/MultipleFileUpload";
import { useForm } from 'react-hook-form';


const UpdateStatus = ({ onClose }) => {
  const handleFinalSubmit = () => {
    console.log("clicked");
  };
  const handleViewModal = () => {
    onClose();
  };
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
                Respond to admin--response
              </h2>
              <form className="w-full">
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
                    // onFilesChange={onFilesChange}
                    // files={fileData}
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
                  />
                </div>
                {/* <Button type="submit" className="w-full mt-2" disabled={submit}>
                  {submit ? "Submitting..." : "Submit"}
                </Button> */}
              </form>
              <Button onClick={handleFinalSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStatus;
