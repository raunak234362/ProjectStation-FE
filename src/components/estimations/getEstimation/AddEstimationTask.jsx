/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, CustomSelect, Input } from "../..";
import SectionTitle from "../../../util/SectionTitle";
import Service from "../../../config/Service";
import toast from "react-hot-toast";
import { estimationSignal } from "../../../signals";

const AddEstimationTask = ({ estimationId }) => {
  const userData = useSelector((state) => state.userData?.staffData);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const estimatorOptions = userData
    ?.map((user) => ({
      label: `${user?.f_name} ${user?.m_name} ${user?.l_name}`,
      value: user.id,
    }));
    console.log("Estimator Options:", estimatorOptions);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      endDate: new Date(data.endDate).toISOString(),
      startDate: new Date(data.startDate).toISOString(),
      estimationId: estimationId,
    };
    try {
      const response = await Service.addEstimationTask(estimationId, payload);
      const createdTask = response?.data || payload;
      // Update signal so task list/detail refreshes immediately
      const current = estimationSignal.value;
      if (current) {
        estimationSignal.value = {
          ...current,
          tasks: [createdTask, ...(current.tasks || [])],
        };
      }
      toast.success("Estimation task added successfully!");
    } catch (error) {
      toast.error("Error adding estimation task.");
      console.error("Error adding estimation task:", error);
    }
  };

  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-[80vh] py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionTitle title="Assignment Details:" />
          <CustomSelect
            label="Estimator"
            options={[
              { label: "Select Estimator", value: "" },
              ...estimatorOptions,
            ]}
            {...register("assignedToId", { required: true })}
            onChange={setValue}
          />
          <SectionTitle title="Important Dates:" />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              {...register("startDate", { required: true })}
            />
            <Input
              type="date"
              label="End Date"
              {...register("endDate", { required: true })}
            />
          </div>
          <SectionTitle title="Notes:" />
          <Input
            type="textarea"
            label="Notes"
            {...register("notes", { required: true })}
          />
          <div className="text-center">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              Add Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEstimationTask;
