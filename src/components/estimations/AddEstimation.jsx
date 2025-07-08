/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import SectionTitle from "../../util/SectionTitle";

const AddEstimation = () => {
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Handle form submission logic here
    console.log("Form Data:", data);
  };

  return (
    <div className="flex justify-center w-full text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-full py-3 px-3 overflow-y-auto ">
        <form onSubmit={handleSubmit(onSubmit)}>
            <SectionTitle title="RFQ Details" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddEstimation;
