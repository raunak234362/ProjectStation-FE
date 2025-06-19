/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, CustomSelect, Button } from "../../../../index";
import Service from "../../../../../config/Service";
import { toast } from "react-toastify";
import { updateDepartmentData } from "../../../../../store/userSlice";
const EditDepartment = ({ department, onClose, handleClose }) => {
  const dispatch = useDispatch();
  console.log(department);
  const staffs = useSelector((state) => state?.userData?.staffData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: department?.name || "",
    },
  });

  const managerOption = staffs
    ?.filter((user) => user.is_manager)
    ?.map((user) => {
      return {
        label: `${user.f_name} ${user.l_name}`,
        value: user.id,
      };
    });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      console.log(data);
      const response = await Service.editDepartment(department?.id, data);
      dispatch(updateDepartmentData(response.data));
      onClose();
      handleClose();
      toast.success("Department updated successfully");
      console.log("Department updated successfully:", response);
    } catch (error) {
      toast.error("Failed to update department");
      console.error("Failed to update department:", error);
    }
  };

  console.log("Department", department);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-fit overflow-y-auto p-5 md:p-5 rounded-lg shadow-lg w-11/12 md:w-6/12 ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Department</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Dept Name:"
                type="text"
                placeholder="Username"
                defaultValues={department?.name}
                {...register("name")}
              />
            </div>
            <div className="w-full mt-4">
              <CustomSelect
                label="Manager:"
                color="blue"
                options={[
                  { label: "Select Manager", value: "" },
                  ...managerOption,
                ]}
                {...register("managerId")}
                onChange={setValue}
              />
              {errors.manager && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
            <div>
              <Button type="submit">Edit Department</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
