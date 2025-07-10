/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import Service from "../../../config/Service";
import { Input, CustomSelect, Button } from "../../index";
import { useDispatch, useSelector } from "react-redux";
import { addTeam } from "../../../store/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddTeam = ({onClose}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await Service.addTeam(data);
      console.log(response);
      toast.success("Team added successfully");
      if (response.status === 200) {
        dispatch(addTeam(response?.data?.data));
      }
      navigate("/admin/team/all-team");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add team");
    }
  };

  const userData = useSelector(state => state.userData?.staffData)

  return(
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[40vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-6/12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-2 py-2 flex flex-row justify-between items-center w-full font-bold text-white rounded-lg bg-teal-500/50">
            <div>
              Add Team:
            </div>
            <div>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>

          <div className="px-1 my-2 md:px-2">
            <div className="w-full">
              <Input
                label="Team Name:"
                placeholder="Team Name"
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
                options={userData?.filter(user => user.is_manager).map((user) => ({label: `${user?.f_name} ${user?.m_name} ${user?.l_name}`, value: user.id}))}
                {...register("manager")}
                onChange={setValue}
              />
              {errors.manager && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
          </div>

          <div className="w-full my-5">
            <Button type="submit" className="w-full bg-teal-500">
              Add Department
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
