/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import AddFiles from "./AddFiles";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Service from "../../../config/Service";
import { updateProjectData } from "../../../store/projectSlice";
import Input from "../../fields/Input";
import { Button, CustomSelect, Toggle } from "../..";
import SectionTitle from "../../../util/SectionTitle";

const EditProject = ({ project, onUpdate, onClose }) => {
  const [teamOptions, setTeamOptions] = useState([]);
  const teams = useSelector((state) => state?.userData?.teamData);
  const [files, setFiles] = useState([]);
  console.log("Project", project);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.userData?.staffData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: project?.name || "",
      fabricatorID: project?.fabricator?.id || "",
      description: project?.description || "",
      duration: project?.duration || "",
      startDate: project?.startDate || "",
      approvalDate: project?.approvalDate || "",
      endDate: project?.endDate || "",
      estimatedHours: project?.estimatedHours || "",
      status: project?.status || "",
      stage: project?.stage || "",
      managerID: project?.manager?.id || "",
      fileData: project?.files || "",
    },
  });

  useEffect(() => {
    const options = teams?.map((team) => ({
      label: team?.name,
      value: team?.id,
    }));
    console.log(options);
    setTeamOptions(options);
  }, []);

  const onFilesChange = (updatedFiles) => {
    console.log(updatedFiles);
    setFiles(updatedFiles);
  };

  const onSubmit = async (data) => {
    console.log(data, "-=-=-=-=-==-=-=-=-=-=-=");
    const projectData = {
      ...data,
      approvalDate: data.approvalDate
        ? new Date(data.approvalDate).toISOString()
        : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    };

    try {
      const updatedProject = await Service.editProject(
        project?.id,
        projectData
      );
      dispatch(updateProjectData(updatedProject?.data));
      toast.success("Project updated successfully");

      if (onUpdate) {
        onUpdate();
      }
      onClose(); // Close modal
    } catch (error) {
      toast.error("Error updating project");
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await Service.deleteProject(project?.id);
      console.log("Delete response", response);
      toast.success("Project deleted successfully!");
      onClose(true);
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting project!");
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[93%] overflow-y-auto md:p-5 rounded-lg shadow-lg w-full md:w-6/12 ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
              <Input
                label="Project Name"
                type="text"
                defaultValue={project?.name}
                {...register("name")}
              />
            </div>
            <div className="my-2">
              <Input
                label="Project Description"
                type="text"
                defaultValue={project?.description}
                {...register("description")}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Manager:"
                color="blue"
                options={userData
                  ?.filter((user) => user.is_manager)
                  .map((user) => ({
                    label: `${user?.f_name} ${user?.m_name} ${user?.l_name}`,
                    value: user.id,
                  }))}
                {...register("managerID")}
                onChange={setValue}
              />
              {errors.managerID && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
            <div className="my-2">
              <Input
                label="Approval Date"
                type="date"
                defaultValue={project?.approvalDate}
                {...register("approvalDate")}
              />
            </div>
            <div className="my-2">
              <Input
                label="End Date"
                type="date"
                defaultValue={project?.endDate}
                {...register("endDate")}
              />
            </div>
            <div className="my-2">
              <Input
                type="number"
                label="Estimated Hours"
                placeholder="HH"
                size="lg"
                color="blue"
                defaultValue={project?.estimatedHours}
                min="0"
                {...register("estimatedHours", {
                  setValueAs: (value) => parseInt(value, 10) || 0,
                })}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Stage"
                name="stage"
                options={[
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
                defaultValue={project?.projectStatus}
                {...register("stage")}
                onChange={setValue}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Status"
                name="status"
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "ON-HOLD", value: "ONHOLD" },
                  { label: "REOPEN", value: "REOPEN" },
                  { label: "COMPLETE", value: "COMPLETE" },
                  { label: "CANCEL", value: "CANCEL" },
                ]}
                defaultValue={project?.projectStatus}
                {...register("status")}
                onChange={setValue}
              />
            </div>
            <div className="my-2 h-full z-50">
              <CustomSelect
                label="Team"
                name="teamID"
                options={teamOptions}
                className="w-full"
                {...register("teamID")}
                onChange={setValue}
              />
            </div>

            <SectionTitle title="Connection Design Scope" />
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Toggle
                label="Main Design"
                {...register("connectionDesign")}
                onChange={(value) => setValue("connectionDesign", value)}
              />
              <Toggle
                label="Misc Design"
                {...register("miscDesign")}
                onChange={(value) => setValue("miscDesign", value)}
              />
              <Toggle
                label="Custom Design"
                {...register("customerDesign")}
                onChange={(value) => setValue("customerDesign", value)}
              />
            </div>

            {/* Detailing Scope */}
            <SectionTitle title="Detailing Scope" />
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Toggle
                label="Main Steel"
                {...register("detailingMain")}
                onChange={(value) => setValue("detailingMain", value)}
              />
              <Toggle
                label="Miscellaneous Steel"
                {...register("detailingMisc")}
                onChange={(value) => setValue("detailingMisc", value)}
              />
            </div>

            {/* <div className="my-3">
              <MultipleFileUpload
                label="Select Files"
                defaultValue={project?.fileData}
                onFilesChange={onFilesChange}
                files={files}
                accept="image/*,application/pdf,.doc,.docx"
                {...register("files")}
              />
            </div> */}
            <div className="flex justify-between">
              <div>
                <Button type="submit">Update Project</Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this project?"
                      )
                    ) {
                      handleDelete();
                    }
                  }}
                  className="bg-red-500 text-white font-semibold"
                >
                  Delete Project
                </Button>
              </div>
            </div>
          </form>
        </div>
        {/* <AddFiles onUpdate={onUpdate} projectId={project?.id} /> */}
      </div>
    </div>
  );
};

export default EditProject;
