/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomSelect,
  Input,
  Button,
  MultipleFileUpload,
} from "../../../../index";
import Service from "../../../../../config/Service";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateFabricator } from "../../../../../store/fabricatorSlice";
import AddFiles from "./AddFiles";

const EditFabricator = ({ fabricator, onClose }) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fabName: fabricator?.fabName || "",
      website: fabricator?.website || "",
      drive: fabricator?.drive || "",
    },
  });

  const handleDelete = async () => {
    try {
      await Service.deleteFabricator(fabricator?.id);
      toast.success("Fabricator deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Error deleting fabricator");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await Service.editFabricator(fabricator?.id, data);
      toast.success("Fabricator updated successfully");
      dispatch(updateFabricator(response));
    } catch (error) {
      toast.error("Error updating fabricator");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[80%] md:p-5 rounded-lg shadow-lg w-6/12 ">
        <div className="flex justify-between my-5 bg-teal-200/50 p-2 rounded-lg">
          <h2 className="text-2xl font-bold">Edit Fabricator</h2>
          <button
            className="text-xl font-bold bg-teal-500/50 hover:bg-teal-700 text-white px-5 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-2">
              <Input
                label="Fabricator Name"
                type="text"
                defaultValue={fabricator?.fabName}
                {...register("fabName")}
              />
            </div>
            <div className="my-2">
              <Input
                label="Drive:"
                type="url"
                placeholder="Drive"
                defaultValue={fabricator?.drive}
                {...register("drive")}
              />
            </div>
            <div className="my-2">
              <Input
                label="Website:"
                type="url"
                placeholder="Website"
                defaultValue={fabricator?.website}
                {...register("website")}
              />
            </div>
            <div className="flex justify-between items-center my-2">

              <Button className="bg-red-500 text-white font-semibold" onClick={handleDelete}>Delete</Button>
              <Button type="submit">Update</Button>

            </div>
          </form>
        </div>
        <AddFiles fabricatorID={fabricator?.id} />
      </div>
    </div>
  );
};

export default EditFabricator;
