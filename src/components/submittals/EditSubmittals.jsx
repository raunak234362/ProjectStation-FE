/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
    Input,
    CustomSelect,
    Button,
    MultipleFileUpload,
} from "../index";
import Service from "../../config/Service";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

const EditSubmittals = ({ submittal, onUpdate, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [joditContent, setJoditContent] = useState(submittal?.description || "");
    const [files, setFiles] = useState([]);

    const clientData = useSelector((state) => state?.fabricatorData?.clientData);
    const fabricatorID = submittal?.fabricator_id || submittal?.project?.fabricatorID;

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            recipient_id: submittal?.recepient?.id || "",
            subject: submittal?.subject || "",
            description: submittal?.description || "",
        },
    });

    const joditConfig = {
        height: 100,
        width: "100%",
        placeholder: "Enter notes with rich formatting...",
        enter: "p",
        processPasteHTML: true,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: "insert_as_html",
    };

    const onFilesChange = (updatedFiles) => {
        setFiles(updatedFiles);
    };

    const filteredClients = clientData?.filter(
        (client) => client.fabricatorId === fabricatorID
    );

    const clientOptions = filteredClients?.map((client) => ({
        label: `${client.f_name} ${client.l_name}`,
        value: client.id,
    }));

    const onSubmit = async (data) => {
        const formData = new FormData();
        files?.forEach((file) => {
            formData.append("files", file);
        });

        formData.append("recipient_id", submittal.recepient_id);
        formData.append("subject", data.subject);
        formData.append("description", data.description);

        try {
            setLoading(true);
            const response = await Service.editSubmittal(submittal.id, formData);
            toast.success("Submittal updated successfully");
            if (onUpdate) {
                onUpdate();
            }
            onClose();
        } catch (error) {
            toast.error("Error updating submittal");
            console.error("Error updating submittal:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg w-full md:w-6/12">
                <div className="flex justify-between mb-5 bg-teal-200/50 p-2 rounded-lg">
                    <h2 className="text-2xl font-bold">Edit Submittal</h2>
                    <button
                        className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* <CustomSelect
                        label="Select Recipient"
                        placeholder="Select Recipient"
                        options={clientOptions}
                        {...register("recipient_id", { required: "Recipient is required" })}
                        onChange={setValue}
                    />
                    {errors.recipient_id && <div className="text-red-500 text-sm">{errors.recipient_id.message}</div>} */}

                    <Input
                        label="Subject"
                        placeholder="Subject"
                        {...register("subject", { required: "Subject is required" })}
                    />
                    {errors.subject && <div className="text-red-500 text-sm">{errors.subject.message}</div>}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <JoditEditor
                            value={joditContent}
                            config={joditConfig}
                            onBlur={(newContent) => {
                                setJoditContent(newContent);
                                setValue("description", newContent);
                            }}
                        />
                    </div>

                    <MultipleFileUpload
                        label="Attach New Files"
                        onFilesChange={onFilesChange}
                        files={files}
                        accept="image/*,application/pdf,.doc,.docx"
                    />

                    <div className="pt-4">
                        <Button type="submit" loading={loading} className="w-full bg-teal-500 hover:bg-teal-600">
                            Update Submittal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubmittals;