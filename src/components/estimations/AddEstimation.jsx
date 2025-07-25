/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import SectionTitle from "../../util/SectionTitle";
import { useEffect, useState } from "react";
import Service from "../../config/Service";
import { showRFQs } from "../../store/rfqSlice";
import Input from "../fields/Input";
import ErrorMsg from "../../util/ErrorMsg";
import { Button, CustomSelect } from "..";
import toast from "react-hot-toast";

const AddEstimation = () => {
  const userType = sessionStorage.getItem("userType");
  const [rfq, setRfq] = useState([]);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
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

  useEffect(() => {
    fetchInboxRFQ();
  }, []);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const estData = {
      ...data,
      estimateDate: data.estimateDate ? new Date().toISOString() : null,
    };
    try {
      const response = await Service.addEstimation(estData);
      console.log("Estimation added:", response);
      toast.success("Estimation added successfully!");
    } catch (error) {
      console.error("Error adding estimation:", error);
      toast.error("Failed to add estimation. Please try again.");
    }
  };

  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-[55vh] py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionTitle title="RFQ Details" />
          <div className="px-1 my-2 md:px-2 space-y-3">
            <CustomSelect
              label="RFQ"
              placeholder="Select RFQ"
              options={rfq?.map((rfqData) => ({
                label: rfqData.subject,
                value: rfqData.id,
              }))}
              {...register("rfqId", { required: "RFQ is required" })}
              onChange={setValue}
            />
            <ErrorMsg msg={errors.rfqId?.message} />

            <Input
              label="Estimation No."
              {...register("estimationNumber", { required: true })}
            />
            {errors.name && <ErrorMsg msg={errors.name.message} />}
            <CustomSelect
              label="Select Exisiting Fabricator"
              placeholder="Select Fabricator"
              options={fabricatorData?.map((fab) => ({
                label: fab.fabName,
                value: fab.id,
              }))}
              {...register("fabricatorId")}
              onChange={setValue}
            />
          </div>
          <SectionTitle title="Project Details" />
          <div className="px-1 my-2 md:px-2 space-y-3">
          <Input
            label="Project Name"
            {...register("projectName", { required: true })}
          />
          {errors.projectName && <ErrorMsg msg={errors.projectName.message} />}
          <Input
            label="Estimated Date"
            type="date"
            {...register("estimateDate", { required: true })}
          />
          {errors.estimatedDate && (
            <ErrorMsg msg={errors.estimatedDate.message} />
          )}
          <CustomSelect
            label="Tools"
            options={["TEKLA", "SDS2", "PEMB"].map((tool) => ({
              label: tool,
              value: tool,
            }))}
            {...register("tools")}
            onChange={setValue}
          />
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
