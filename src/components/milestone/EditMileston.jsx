

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form";
import Service from "../../config/Service";
import { Button, CustomSelect, Input } from "..";
import { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useDispatch } from "react-redux";
import { updateMilestoneData } from "../../store/projectSlice";
import { milestoneData } from "../../signals/projectData";
import { useSignals } from "@preact/signals-react/runtime";
import toast from "react-hot-toast";

const EditMileston = ({ milestone, onSubmit, onClose }) => {
  useSignals();
  const dispatch = useDispatch();
  const [joditContent, setJoditContent] = useState(milestone?.description || "");
  const [loading, setLoading] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const canEditManualProgress = ["admin", "deputy-manager"].includes(userType);

  //initializing USE-FORM
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: milestone?.subject || "",
      status: milestone?.status || "",
      approvalDate: milestone?.approvalDate ? new Date(milestone.approvalDate).toISOString().split('T')[0] : "",
    }
  });

  useEffect(() => {
    if (milestone) {
      setValue("subject", milestone.subject);
      setValue("status", milestone.status);
      setValue("description", milestone.description);
      if (milestone.approvalDate) {
        setValue("approvalDate", new Date(milestone.approvalDate).toISOString().split('T')[0]);
      }
      setValue("percentage", milestone.percentage);
      setJoditContent(milestone.description || "");
    }
  }, [milestone, setValue]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await Service.updateMilestoneById(milestone.id, data);
      if (response) {
        toast.success("Milestone updated successfully");

        const updatedMilestone = { ...milestone, ...data };
        dispatch(updateMilestoneData(updatedMilestone));

        // Explicitly update signal for immediate refresh if needed
        milestoneData.value = milestoneData.value.map(m =>
          m.id === milestone.id ? updatedMilestone : m
        );

        if (onSubmit) onSubmit(updatedMilestone);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    } finally {
      setLoading(false);
    }
  };

  const joditConfig = {
    height: 200,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p",
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: "custom",
    link: {
      processPastedLink: true,
      openInNewTabCheckbox: true,
      noFollowCheckbox: true,
    },
    removeEmptyBlocks: true,
    cleanHTML: {
      removeEmptyElements: true,
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Edit Milestone
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            placeholder="Milestone subject"
            label="Milestone subject"
          />
          {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <JoditEditor
              value={joditContent}
              config={joditConfig}
              onBlur={(newContent) => {
                setJoditContent(newContent);
                setValue("description", newContent, { shouldValidate: true });
              }}
              className="w-full border border-gray-300 rounded-md"
            />
          </div>

          <CustomSelect
            label="Status"
            name="status"
            options={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "ON-HOLD", value: "ON-HOLD" },
              { label: "DELAY", value: "DELAY" },
              { label: "REOPEN", value: "REOPEN" },
              { label: "COMPLETE", value: "COMPLETE" },
              { label: "SUBMIT", value: "SUBMIT" },
              { label: "CANCEL", value: "CANCEL" },
            ]}
            {...register("status")}
            onChange={(name, value) => setValue(name, value)}
          />

          <Input
            label="Approval Date"
            placeholder="Approval Date"
            type="date"
            {...register("approvalDate")}
          />

          {canEditManualProgress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manual Progress (%)
                </label>
                <input
                  min="0"
                  max="100"
                  {...register("percentage", {
                    min: { value: 0, message: "Min 0" },
                    max: { value: 100, message: "Max 100" }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {errors.percentage && <span className="text-red-500 text-sm">{errors.percentage.message}</span>}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Milestone"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMileston;
