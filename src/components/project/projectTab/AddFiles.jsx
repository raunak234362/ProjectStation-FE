/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Service from "../../../config/Service";
import { updateFabricator } from "../../../store/fabricatorSlice";
import MultipleFileUpload from "../../fields/MultipleFileUpload";
import Button from "../../fields/Button";
import JoditEditor from "jodit-react";
import { CustomSelect } from "../..";

const AddFiles = ({ projectId, onUpdate, onClose }) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const [joditContent, setJoditContent] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };
  //   const handleFileChange = (e) => {
  //     const file = e.target.files;

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       csv_upload: file,
  //     }));
  //   };

  // const onSubmit = async () => {
  //   const formData = new FormData();

  //   // Ensure data?.files is an array and has files
  //   if (fileData?.length) {
  //     // Append files to FormData
  //     for (let i = 0; i < fileData.length; i++) {
  //       console.log("File data:", fileData[i]);
  //       formData.append("files", fileData[i]);
  //     }

  //     // Log the formData content by iterating over its entries
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0] + ": " + pair[1]);
  //     }
  //     try {
  //       const response = await Service.addProjectFile(formData, projectId);
  //       dispatch(updateFabricator(response));
  //       onUpdate();
  //       toast.success("Files uploaded successfully");
  //       console.log("Files uploaded successfully:", response);
  //     } catch (error) {
  //       toast.error("Error uploading files");
  //       console.error("Error uploading files:", error);
  //     }
  //   } else {
  //     console.error("No files to upload.");
  //   }
  // };

  const addDocument = async (data) => {
    const formData = new FormData();

    // Append files
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const documentData = {
      ...data,
      files,
    };
    console.log("Sending Data:", documentData);

    const response = await Service.addFilesByProjectId(projectId, documentData);
    onUpdate();
    toast.success("Document uploaded successfully");
    console.log("Document uploaded successfully:", response);
  };

  return (
    <div className="my-5 ">
      <div className="w-full rounded-lg shadow-lg bg-white md:p-2 ">
        <div className="flex justify-between w-full items-center my-2 font-bold">
          <div>Upload Project Document</div>
          <div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
        <form onSubmit={handleSubmit(addDocument)} className="space-y-4">
          <JoditEditor
            value={joditContent}
            config={joditConfig}
            onBlur={(newContent) => {
              setJoditContent(newContent);
              setValue("description", newContent, {
                shouldValidate: true,
              });
            }}
            className="w-full border border-gray-300 rounded-md"
          />
          <CustomSelect
            label="Stage"
            name="stage"
            options={[
              { label: "KICKOFF", value: "KICKOFF" },
              { label: "RFI", value: "RFI" },
              { label: "IFA", value: "IFA" },
              { label: "BFA", value: "BFA" },
              { label: "BFA-Markup", value: "BFA_M" },
              { label: "RIFA", value: "RIFA" },
              { label: "RBFA", value: "RBFA" },
              { label: "IFC", value: "IFC" },
              { label: "BFC", value: "BFC" },
              { label: "RIFC", value: "RIFC" },
              { label: "REV", value: "REV" },
              { label: "CO#", value: "CO#" },
            ]}
            {...register("stage")}
            onChange={setValue}
          />
          <MultipleFileUpload
            label="Select Files"
            onFilesChange={onFilesChange}
            files={files}
            accept="image/*,application/pdf,.pdf,.pptx, .doc,.docx"
            {...register("files")}
          />
          {errors.files && (
            <div className="text-red-500">This field is required</div>
          )}
          <div className="flex justify-center w-full my-2">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFiles;
