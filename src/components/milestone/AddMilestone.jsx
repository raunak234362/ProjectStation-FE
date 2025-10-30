/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useForm } from "react-hook-form";
import Service from "../../config/Service";
import { Button, CustomSelect, Input } from "..";
import { useState } from "react";
import JoditEditor from "jodit-react";
import { useSignals } from "@preact/signals-react/runtime";

const AddMilestone = ({ projectData, onSubmit }) => {
  useSignals();
  console.log("projectData in AddMilestone:", projectData);
  const projectId = projectData?.id; // Accessing project ID from props
  const fabricationId = projectData?.fabricatorID; // Accessing fabrication ID from props

  const [joditContent, setJoditContent] = useState("");
  //initializing USE-FORM
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="text"
          {...register("subject", { required: true })}
          placeholder="Milestone subject"
          label="Milestone subject"
        />
        {errors.subject && <span>This field is required</span>}
        <JoditEditor
          value={joditContent}
          config={joditConfig}
          onBlur={(newContent) => {
            setJoditContent(newContent);
            setValue("description", newContent, { shouldValidate: true });
          }}
          className="w-full border border-gray-300 rounded-md"
        />
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
          onChange={setValue}
        />
        <Input
          label="Approval Date"
          placeholder="Approval Date"
          type="date"
          {...register("approvalDate")}
        />

        <div className="w-full my-5">
          <Button type="submit">Add Milestone</Button>
        </div>
      </form>
    </>
  );
};

export default AddMilestone;
