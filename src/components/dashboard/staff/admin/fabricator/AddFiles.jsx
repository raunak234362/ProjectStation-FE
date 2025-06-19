/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Button, Input, MultipleFileUpload } from "../../../../index";
import Service from "../../../../../config/Service";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProjectData } from "../../../../../store/projectSlice";

const AddFiles = ({ fabricatorID }) => {
  const [fileData, setFileData] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFilesChange = (updatedFiles) => {
    console.log(updatedFiles);
    setFileData(updatedFiles);
  };

  //   const handleFileChange = (e) => {
  //     const file = e.target.files;

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       csv_upload: file,
  //     }));
  //   };

  const onSubmit = async () => {
    console.log(fileData, "udasdgasidsausdasuodaj");
    const formData = new FormData();

    // Ensure data?.files is an array and has files
    if (fileData?.length) {
      // Append files to FormData
      for (let i = 0; i < fileData.length; i++) {
        console.log("File data:", fileData[i]);
        formData.append("files", fileData[i]);
      }

      // Log the formData content by iterating over its entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      try {
        const response = await Service.addFabricatorFile(formData, fabricatorID);
        dispatch(updateProjectData(response)); 
        toast.success("Files uploaded successfully");
        console.log("Files uploaded successfully:", response);
      } catch (error) {
        toast.error("Error uploading files");
        console.error("Error uploading files:", error);
      }
    } else {
      console.error("No files to upload.");
    }
  };

  return (
    <div className="my-5 overflow-y-auto h-1/3">
      <div className="bg-teal-200/30 md:p-2 rounded-lg shadow-lg w-full ">
        <div className="flex w-full justify-center font-bold my-2">
          Upload Files
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Input
            type="file"
            name="files"
            label="Upload Files"
            placeholder="Upload Files"
            size="lg"
            accept=" image/* .zip .rar .iso"
            {...register("files")}
          /> */}
          <MultipleFileUpload
            label="Select Files"
            onFilesChange={onFilesChange}
            files={fileData}
            accept="image/*,application/pdf,.pdf,.pptx, .doc,.docx"
            {...register("files")}
          />
          {errors.files && (
            <div className="text-red-500">This field is required</div>
          )}
          <div className="my-2 w-full justify-center flex">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFiles;
