/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    Input,
    CustomSelect,
    Button,
    MultipleFileUpload,
} from "../index";
import Service from "../../config/Service";
import toast from "react-hot-toast";

const AddSubmittals = ({ projectData }) => {
    const dispatch = useDispatch();
    const project = projectData;
    const fabricatorID = project?.fabricatorID;
    const projectID = project?.id;
    // const projectData = useSelector((state) => state.projectData.projectData);
    const fabricatorData = useSelector((state) => state.fabricatorData.fabricatorData);
    const clientData = useSelector((state) => state.fabricatorData.clientData);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [files, setFiles] = useState([]);


    const clientOptions = useMemo(() => {
        const filtered = clientData?.filter(
            (client) => client.fabricatorId === fabricatorID
        );
        return filtered?.map((client) => ({
            label: `${client.f_name} ${client.l_name}`,
            value: client.id,
        })) || [];
    }, [fabricatorID, clientData]);

    const onFilesChange = (updatedFiles) => {
        setFiles(updatedFiles);
    };

    const CreateSubmittals = async (data) => {
        const submittals = { ...data, files, project_id: projectID, fabricator_id: fabricatorID };

        try {
            const response = await Service.addSubmittal(submittals);
            toast.success("Submittals created successfully");
        } catch (error) {
            toast.error("Error creating Submittals");
            console.error("Error:", error);
        }
    };

    return (
        <div className="h-fit">
            <div className="flex justify-center w-full my-5 text-black">
                <div className="w-full h-full px-2 py-3 overflow-y-auto md:px-10">
                    <form onSubmit={handleSubmit(CreateSubmittals)}>
                        {/* Project Info */}
                        <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                            Project Information:
                        </div>
                        <div className="px-1 my-2 md:px-2">
                            {/* <div className="w-full">
                                    <CustomSelect
                                        label="Fabricator Name:"
                                        name="fabricator"
                                        options={[{ label: "Select Fabricator", value: "" }, ...fabricatorOptions]}
                                        {...register("fabricator_id", { required: true })}
                                        onChange={setValue}
                                    />
                                    {errors.fabricator_id && <div className="text-red-500 text-xs">This field is required</div>}
                                </div> */}

                            {/* <div className="w-full mt-3">
                                    <CustomSelect
                                        label="Project Name:"
                                        name="project"
                                        options={[{ label: "Select Project", value: "" }, ...projectOptions]}
                                        {...register("project_id", { required: true })}
                                        onChange={setValue}
                                    />
                                    {errors.project_id && <div className="text-red-500 text-xs">This field is required</div>}
                                </div> */}

                            <div className="w-full my-3">
                                <CustomSelect
                                    label="Select Recipients:"
                                    name="recipient"
                                    options={[{ label: "Select Recipient", value: "" }, ...clientOptions]}
                                    {...register("recepient_id", { required: true })}
                                    onChange={setValue}
                                />
                                {errors.recepient_id && <div className="text-red-500 text-xs">This field is required</div>}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                            Details:
                        </div>
                        <div className="px-1 my-2 md:px-2">
                            <div className="w-full my-3">
                                <Input
                                    label="Subject/Remarks:"
                                    placeholder="Subject/Remarks"
                                    {...register("subject", { required: true })}
                                />
                                {errors.subject && <div className="text-red-500 text-xs">This field is required</div>}
                            </div>

                            <div className="w-full my-3">
                                <Input
                                    type="textarea"
                                    label="Description:"
                                    placeholder="Description"
                                    {...register("description", { required: true })}
                                />
                                {errors.description && <div className="text-red-500 text-xs">This field is required</div>}
                            </div>

                            <div className="w-full my-3">
                                <CustomSelect
                                    label="Stage"
                                    name="Stage"
                                    options={[
                                        { label: "Select Stage", value: "" },
                                        { label: "(IFA) Issue for Approval", value: "IFA" },
                                        { label: "(RIFA) Re-issue for Approval", value: "RIFA" },
                                        { label: "(IFC) Issue for Construction", value: "IFC" },
                                        { label: "(RIFC) Re-issue for Construction", value: "RIFC" },
                                    ]}
                                    {...register("Stage", { required: true })}
                                    onChange={setValue}
                                />
                                {errors.Stage && <div className="text-red-500 text-xs">This field is required</div>}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                            Attach Files:
                        </div>
                        <div className="px-1 my-2 md:px-2">
                            <MultipleFileUpload
                                label="Select Files"
                                files={files}
                                onFilesChange={onFilesChange}
                                accept="image/*,application/pdf,.doc,.docx"
                            />
                        </div>

                        {/* Submit */}
                        <div className="w-full my-5">
                            <Button type="submit">Send Message</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSubmittals;
