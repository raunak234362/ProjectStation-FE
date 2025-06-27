/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { Input, CustomSelect, Button } from "../index";
import { useEffect, useState } from "react";
import Service from "../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addDepartment } from "../../store/userSlice";

const AddDepartment = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [managerOptions, setManagerOptions] = useState([]);
  const token = sessionStorage.getItem("token");
  // Fetch managers when the component mounts
  const staffs = useSelector((state) => state?.userData?.staffData);

  const managerOption = staffs
    ?.filter((user) => user.is_manager)
    ?.map((user) => {
      return {
        label: `${user.f_name} ${user.l_name}`,
        value: user.id,
      };
    });
  // const fetchManagers = async () => {
  //   try {
  //     console.log(staffs);
  //     const options = Array.isArray(staffs?.data)
  //       ? staffs?.data
  //           .filter((user) => user.is_manager)
  //           .map((user) => {
  //             return {
  //               label: `${user.f_name} ${user.l_name}`,
  //               value: user.id,
  //             };
  //           })
  //       : [];
  //     console.log(options);
  //     setManagerOptions(options);
  //   } catch (error) {
  //     console.error("Failed to fetch employee data", error);
  //   }
  // };

  useEffect(() => {}, []);

  // Add department function
  const onSubmit = async (data) => {
    try {
      const departmentData = await Service.addDepartment(data);
      toast.success("Department added successfully");
      dispatch(addDepartment(departmentData.data));
      console.log("Department added successfully:", departmentData);
    } catch (error) {
      toast.error("Failed to add department");
      console.log("Failed to add department", error);
    }
  };

  return (
    <div className="flex w-full justify-center bg-white/70 p-3 rounded-md text-black">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Department:
          </div>

          <div className="my-2 md:px-2 px-1">
            <div className="w-full">
              <Input
                label="Department Name:"
                placeholder="Enter Department Name"
                size="lg"
                color="blue"
                {...register("name", { required: true })} // Registering department name
              />
              {errors.name && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>

            <div className="w-full mt-4">
              <CustomSelect
                label="Manager:"
                color="blue"
                options={[
                  { label: "Select Manager", value: "" },
                  ...managerOption,
                ]}
                {...register("manager")}
                onChange={setValue}
              />
              {errors.manager && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
          </div>

          <div className="my-5 w-full">
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold">
              Add Department
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
