/* eslint-disable no-unused-vars */

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../../fields/Input";
import Button from "../../../../fields/Button";
import Service from "../../../../../config/Service";
import toast from "react-hot-toast";
import { CustomSelect } from "../../../..";
import { updateStaffData } from "../../../../../store/userSlice";

/* eslint-disable react/prop-types */
const EditEmployee = ({ employee, onClose }) => {
  const departments = useSelector((state) => state?.userData?.departmentData);
  const departmentOptions = departments?.map((department) => ({
    label: department.name,
    value: department.id,
  }));
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      f_name: employee?.f_name || "",
      m_name: employee?.m_name || "",
      l_name: employee?.l_name || "",
      phone: employee?.phone || "",
      username: employee?.username || "",
      emp_code: employee?.emp_code || "",
      department: employee?.department || "",
      email: employee?.email || "",
    },
  });

  const disableUser = async () => {
    try {
      const response = await Service.disableEmployee(employee?.id);
      dispatch(updateStaffData(response.data));
      toast.success("Employee disabled successfully");
      console.log("Employee disabled successfully:", response);
      onClose();
    } catch (error) {
      toast.error("Failed to disable employee");
      console.error("Failed to disable employee:", error);
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await Service.editEmployee(employee?.id, data);
      dispatch(updateStaffData(response.data));
      toast.success("Employee updated successfully");
      console.log("Employee updated successfully:", response);
      onClose();
    } catch (error) {
      toast.error("Failed to update employee");
      console.error("Failed to update employee:", error);
    }
  };

  console.log("Employee", employee);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 p-5 overflow-y-auto bg-white rounded-lg shadow-lg h-fit md:p-5 md:w-6/12 ">
        <div className="flex justify-between p-2 my-5 rounded-lg bg-teal-200/50">
          <h2 className="text-2xl font-bold">Edit Employee</h2>
          <button
            className="px-5 text-xl font-bold text-white rounded-lg bg-teal-500/50 hover:bg-teal-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Username:"
                type="text"
                placeholder="Username"
                defaultValues={employee?.username}
                {...register("username")}
              />
            </div>
            <div>
              <Input
                label="Employee Code:"
                type="text"
                placeholder="Employee Code"
                defaultValues={employee?.emp_code}
                {...register("emp_code")}
              />
            </div>
            <div>
              <CustomSelect
                label="Department:"
                className="w-full"
                defaultValues={employee?.department}
                options={departmentOptions}
                {...register("department")}
                onChange={setValue}
              />
            </div>
            <div>
              <Input
                label="First Name:"
                type="text"
                placeholder="First Name"
                defaultValues={employee?.f_name}
                {...register("f_name")}
              />
            </div>
            <div>
              <Input
                label="Middle Name:"
                type="text"
                placeholder="Middle Name"
                defaultValues={employee?.m_name}
                {...register("m_name")}
              />
            </div>
            <div>
              <Input
                label="Last Name:"
                type="text"
                placeholder="Last Name"
                defaultValues={employee?.l_name}
                {...register("l_name")}
              />
            </div>
            <div>
              <Input
                label="Phone number:"
                type="text"
                placeholder="Phone number"
                defaultValues={employee?.phone}
                {...register("phone")}
              />
            </div>
            <div>
              <Input
                label="Email:"
                type="text"
                placeholder="Email"
                defaultValues={employee?.email}
                {...register("email")}
              />
            </div>
            <div className="flex flex-row gap-2 mt-5">
              <div>
                <Button type="submit">Edit Employee</Button>
              </div>
              <div>
                <Button type="button" onClick={disableUser} className="bg-red-500 hover:bg-red-700">
                  Disable User
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
