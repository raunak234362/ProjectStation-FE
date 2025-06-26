/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, CustomSelect, Button, Toggle } from "../index";
import { toast } from "react-toastify";
import SectionTitle from "../../util/SectionTitle";
import ErrorMsg from "../../util/ErrorMsg";
import { addProject } from "../../store/projectSlice";
import Service from "../../config/Service";

const AddProject = () => {
  const dispatch = useDispatch();
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
  const departmentData = useSelector((state) => state.userData?.departmentData);
  const userData = useSelector((state) => state.userData?.staffData);
  const teams = useSelector((state) => state?.userData?.teamData);

  const managerOption = userData
    ?.filter((user) => user.is_manager)
    ?.map((user) => ({
      label: `${user.f_name} ${user.l_name}`,
      value: user.id,
    }));

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      approvalDate: data.approvalDate
        ? new Date(data.approvalDate).toISOString()
        : null,
    };

    try {
      const response = await Service.addProject(payload);
      dispatch(addProject(response?.project));
      toast.success("Project Added Successfully");
      reset();
    } catch (error) {
      toast.error("Error Adding Project");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-full py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Fabricator Info */}
          <SectionTitle title="Fabricator Information" />
          <CustomSelect
            label="Fabricator"
            placeholder="Select Fabricator"
            options={fabricatorData?.map((fab) => ({
              label: fab.fabName,
              value: fab.id,
            }))}
            {...register("fabricator", { required: "Fabricator is required" })}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.fabricator?.message} />

          {/* Project Info */}
          <SectionTitle title="Project Information" />
          <Input
            label="Project Name"
            {...register("name", { required: true })}
          />
          <Input
            type="textarea"
            label="Description"
            {...register("description", { required: true })}
          />
          <Input
            type="number"
            label="Estimated Hours"
            min="0"
            {...register("estimatedHours", { required: true })}
          />

          {/* Status & Stage */}
          <SectionTitle title="Project Stage & Status" />
          <CustomSelect
            label="Status"
            name="status"
            options={[
              "ASSIGNED",
              "ACTIVE",
              "ONHOLD",
              "INACTIVE",
              "DELAY",
              "COMPLETE",
            ].map((s) => ({ label: s, value: s }))}
            {...register("status", { required: true })}
            onChange={setValue}
          />

          <CustomSelect
            label="Stage"
            name="stage"
            options={[
              "RFI",
              "IFA",
              "BFA",
              "BFA_M",
              "RIFA",
              "RBFA",
              "IFC",
              "BFC",
              "RIFC",
              "REV",
              "CO#",
            ].map((stage) => ({ label: stage, value: stage }))}
            {...register("stage", { required: true })}
            onChange={setValue}
          />

          {/* Department & Manager */}
          <SectionTitle title="Department Information" />
          <CustomSelect
            label="Department"
            options={departmentData?.map((dep) => ({
              label: dep.name,
              value: dep.id,
            }))}
            {...register("department", { required: true })}
            onChange={setValue}
          />

          <CustomSelect
            label="Manager"
            options={[{ label: "Select Manager", value: "" }, ...managerOption]}
            {...register("manager", { required: true })}
            onChange={setValue}
          />

          {/* Team Info */}
          <SectionTitle title="Team Information" />
          <CustomSelect
            label="Team"
            options={teams?.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
            {...register("team", { required: true })}
            onChange={setValue}
          />

          {/* Additional Info */}
          <SectionTitle title="Additional Information" />
          <CustomSelect
            label="Tools"
            options={["TEKLA", "SDS2", "PEMB"].map((tool) => ({
              label: tool,
              value: tool,
            }))}
            {...register("tools")}
            onChange={setValue}
          />

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Toggle label="Main Design" {...register("connectionDesign")} />
            <Toggle label="Misc Design" {...register("miscDesign")} />
            <Toggle label="Customer Design" {...register("customer")} />
          </div>

          {/* Important Dates */}
          <SectionTitle title="Important Dates" />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              {...register("start_date", { required: true })}
            />
            <Input
              type="date"
              label="Approval Date"
              {...register("approvalDate", { required: true })}
            />
          </div>

          <div className="text-center">
            <Button type="submit">Add Project</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
