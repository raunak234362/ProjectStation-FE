/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  CustomSelect,
  Button,
  Toggle,
  MultipleFileUpload,
} from "../../../../index";
import { addRFI } from "../../../../../store/projectSlice";
import Service from "../../../../../config/Service";
import { toast } from "react-toastify";

 export const ClientCreateRFI = () => {
  const[recipients, setRecipients] = useState([]);
  useEffect(()=>{
    const getRecipients = async()=>{
      const response = await Service.getRecipients();
      console.log(response);
      setRecipients(response.data);
    }
    getRecipients();
  },[])

  const recepientsOptions = recipients
  .filter(rec => rec.is_manager || rec.is_superuser) 
  .map(rec => ({
    label: `${rec.f_name} ${rec.m_name} ${rec.l_name}`,
    value: rec.id,
  })); 


 console.log(recepientsOptions)

  const projectData = useSelector((state) => state.projectData.projectData);
  const fabricatorData = useSelector(
      (state) => state?.fabricatorData?.fabricatorData
    );
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(projectData);

  const projectOpttions = projectData.map((pro) => {
    return {
      label: pro.name,
      value: pro.id,
    }
  })

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [files, setFiles] = useState([]);
  const [fileUpload, setFileUpload] = useState("");
  const [fileName, setFileName] = useState(null);

  const recipientID = watch("recipients");
  const projectID = watch("project");


  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   console.log(file);
  //   setFileUpload(file?.name);
  //   setFileName(URL.createObjectURL(file));
  // };

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  const CreateRFI = async (data) => {
    const formData = new FormData();

    // Append files
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const rfiData = { ...data, files, recipient_id: recipientID, project_id: projectID,};
    console.log("Sending Data:", rfiData); // Debugging

    try {
      const response = await Service.addRFI(rfiData);
      toast.success("RFI created successfully");
      console.log("RFI created successfully:", response);
    } catch (error) {
      toast.error("Error creating RFI");
      console.error("Error creating RFI:", error);
    }
  };

  return (
    <div className="flex w-full justify-center text-black my-5">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(CreateRFI)}>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Project Informationrtoin :
          </div>
          <div className="my-2 md:px-2 px-1">
             {/* <div className="w-full">
              <CustomSelect
                label="Fabricator Name:"
                color="blue"
                size="lg"
                name="fabricator"
                options={[
                  { label: "Select Fabricator", value: "" },
                  { label: "Fabricator 1", value: "Fabricator 1" },
                  { label: "Fabricator 2", value: "Fabricator 2" },
                ]}
                {...register("fabricator", { required: true })}
                onChange={setValue}
              />
              {errors.fabricator && <div>This field is required</div>}
            </div>  */}
            <div className="w-full mt-3">
              <CustomSelect
                label="Project Name:"
                color="blue"
                size="lg"
                name="project"
                options={projectOpttions}
                {...register("project", { required: true })}
                onChange={setValue}
              />
              {errors.project && <div>This field is required</div>}
            </div>
            <div className="w-full my-3">
              <CustomSelect
                label="Select Recipients:"
                placeholder="Select Recipients"
                size="lg"
                color="blue"
                options={recepientsOptions}
                {...register("recipients", { required: true })}
                onChange={setValue}
              />
              {errors.recipients && <div>This field is required</div>}
            </div>
          </div>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Details:
          </div>
          <div className="my-2 md:px-2 px-1">
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
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Attach Files:
          </div>
          <div className="my-2 md:px-2 px-1">
          <MultipleFileUpload
              label="Select Files"
              onFilesChange={onFilesChange}
              files={files}
              accept="image/*,application/pdf,.doc,.docx"
              {...register("files")}
            />
          </div>

          <div className="my-5 w-full">
            <Button type="submit">Send Message</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

