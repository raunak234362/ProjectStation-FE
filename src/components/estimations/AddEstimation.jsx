/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import SectionTitle from "../../util/SectionTitle";
import { useEffect, useState } from "react";
import Service from "../../config/Service";
import Input from "../fields/Input";
import ErrorMsg from "../../util/ErrorMsg";
import { Button, CustomSelect, MultipleFileUpload } from "..";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";
import { estimationsSignal } from "../../signals";

const AddEstimation = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const userType = sessionStorage.getItem("userType");
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const [joditContent, setJoditContent] = useState("");
  const [rfq, setRfq] = useState([]);
  const [files, setFiles] = useState([]);

  const joditConfig = {
    height: 100,
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
    defaultValue: "",
    removeEmptyBlocks: true,
    cleanHTML: {
      removeEmptyElements: true,
    },
  };

  const onFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

  console.log(files);

  const rfqData = watch("rfqId");
  console.log("Selected RFQ Data:", rfqData);

  // Prefill values when an RFQ is selected
  useEffect(() => {
    if (rfqData) {
      setValue("projectName", rfqData?.projectName || "");
      setValue(
        "estimateDate",
        rfqData?.estimationDate ? rfqData.estimationDate.split("T")[0] : ""
      );
      setValue("fabricatorId", rfqData?.sender?.fabricator?.id || "");
      const desc = rfqData?.description || "";
      setValue("description", desc);
      setJoditContent(desc);
    }
  }, [rfqData, setValue]);

  //fetching RFQ
  useEffect(() => {
    const fetchInboxRFQ = async () => {
      try {
        let rfqDetail;
        if (userType === "client") {
          rfqDetail = await Service.sentRFQ();
        } else {
          rfqDetail = await Service.inboxRFQ();
        }
        setRfq(rfqDetail);
      } catch (error) {
        console.error("Error fetching RFQ:", error);
      }
    };
    fetchInboxRFQ();
  }, [userType]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    files?.map((file) => {
      formData.append("files", file);
      console.log("File:", formData?.append);
    });

    const estData = {
      ...data,
      files,
      rfqId: rfqData?.id || "",
      estimateDate: data.estimateDate
        ? new Date(data.estimateDate).toISOString()
        : null,
    };
    try {
      const response = await Service.addEstimation(estData);
      const created = response?.data || null;
      // Update the list signal so tables re-render without refresh
      estimationsSignal.value = [created || estData, ...(estimationsSignal.value || [])];
      toast.success("Estimation added successfully!");
    } catch (error) {
      console.error("Error adding estimation:", error);
      toast.error("Failed to add estimation. Please try again.");
    }
  };


  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-[85vh] py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionTitle title="RFQ Details" />
          <div className="px-1 my-2 md:px-2 space-y-3">
            <CustomSelect
              label="RFQ"
              placeholder="Select RFQ"
              options={rfq?.map((rfqData) => ({
                label: rfqData.subject,
                value: rfqData,
              }))}
              {...register("rfqId")}
              onChange={setValue}
            />
            <ErrorMsg msg={errors.rfqId?.message} />
            <Input label="Estimation No." {...register("estimationNumber")} />
            {errors.estimationNumber && (
              <ErrorMsg msg={errors.estimationNumber.message} />
            )}
            <CustomSelect
              label="Select Existing Fabricator"
              placeholder="Select Fabricator"
              options={fabricatorData?.map((fab) => ({
                label: fab.fabName,
                value: fab.id,
              }))}
              {...register("fabricatorId")}
              onChange={setValue}
            />
            <ErrorMsg msg={errors.fabricatorId?.message} />
          </div>
          <SectionTitle title="Project Details" />
          <div className="px-1 my-2 md:px-2 space-y-3">
            <Input
              label="Project Name"
              {...register("projectName", {
                required: "Project Name is required",
              })}
            />
            <ErrorMsg msg={errors.projectName?.message} />
            <Input
              label="Estimated Date"
              type="date"
              {...register("estimateDate")}
            />
            <ErrorMsg msg={errors.estimateDate?.message} />
            <JoditEditor
              value={joditContent}
              config={joditConfig}
              onBlur={(newContent) => {
                setJoditContent(newContent);
                setValue("description", newContent, { shouldValidate: true });
              }}
              className="w-full border border-gray-300 rounded-md"
            />
            <ErrorMsg msg={errors.description?.message} />
            <CustomSelect
              label="Tools"
              options={["TEKLA", "SDS2", "PEMB"].map((tool) => ({
                label: tool,
                value: tool,
              }))}
              {...register("tools")}
              onChange={setValue}
            />
            <div className="px-1 my-2 md:px-2">
              <MultipleFileUpload
                label="Select Files"
                onFilesChange={onFilesChange}
                files={files}
                accept="image/*,application/pdf,.doc,.docx"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEstimation;
