/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Input,
  CustomSelect,
  Button,
  Toggle,
  MultipleFileUpload,
} from "../../../../index";
import { useDispatch, useSelector } from "react-redux";
import { State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { addBranchToFabricator } from "../../../../../store/fabricatorSlice";
import Service from "../../../../../config/Service";
import { toast } from "react-toastify";

const AddBranch = ({ fabricatorId, isBranch, onBranchClose }) => {
  console.log(fabricatorId);
  const [fabricator, setFabricator] = useState();
  const token = sessionStorage.getItem("token");
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const country = watch("branch.country");
  const state = watch("branch.state");
  const [stateList, setStateList] = useState([
    {
      label: "Select State",
      value: "",
    },
  ]);

  const [cityList, setCityList] = useState([
    {
      label: "Select City",
      value: "",
    },
  ]);

  const countryList = {
    "United States": "US",
    Canada: "CA",
    India: "IN",
  };

  useEffect(() => {
    const stateListObject = {};
    State.getStatesOfCountry(countryList[country])?.forEach((state1) => {
      stateListObject[state1.name] = state1.isoCode;
    });
    setStateList(stateListObject);
  }, [country]);

  useEffect(() => {
    setCityList(
      City.getCitiesOfState(countryList[country], stateList[state])?.map(
        (city) => ({
          label: city?.name,
          value: city?.name,
        })
      )
    );
  }, [state]);


  const fabData = useSelector(
    (state) => state.fabricatorData?.fabricatorData?.data
  );

  const fetchFabricator = async () => {
    try {
      // Find the fabricator with the matching ID from the Redux store data
      const fabricator = fabData.find((fab) => fab.id === fabricatorId);

      if (fabricator) {
        setFabricator(fabricator);
        console.log(fabricator);
      } else {
        console.log("Fabricator not found");
      }
    } catch (error) {
      console.log("Error fetching fabricator:", error);
    }

    // try {
    //   const response = await Service.getFabricator(token, fabricatorId);
    //   //   dispatch(showFabricator(response));
    //   setFabricator(response);
    //   console.log(response);
    // } catch (error) {
    //   console.log("Error fetching fabricator:", error);
    // }
  };
  useEffect(() => {
    fetchFabricator();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await Service.addFabricatorBranch(data, fabricatorId);
      toast.success("Branch added successfully");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async () => {
    onBranchClose(true);
    console.log("CLoose");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[60%] md:p-5 p-2 rounded-lg shadow-lg md:w-6/12 w-4/5 ">
        <div className="flex flex-row justify-between">
          <Button className="bg-red-500" onClick={handleClose}>
            Close
          </Button>
        </div>
        {/* header */}
        <div className="top-2 w-full flex justify-center z-10">
          <div className="mt-2">
            <div className="bg-teal-400 text-white px-3 md:px-4 py-2 md:text-2xl font-bold rounded-lg shadow-md">
              Fabricator: {fabricator?.fabName || "Unknown"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          {/* <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Branch:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full">
              <Input
                label="Fabricator Name:"
                placeholder="Fabricator Name"
                size="lg"
                color="blue"
                {...register('name', { required: true })}
              />
              {errors.name && <div>This field is required</div>}
            </div>
          </div> */}
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Location:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full my-2">
              <Input
                label="Address:"
                placeholder="Address"
                size="lg"
                color="blue"
                {...register("branch.address")}
              />
            </div>
            <div className="my-2">
              <CustomSelect
                label="Country: "
                placeholder="Country"
                className="w-full"
                options={[
                  { label: "Select Country", value: "" },
                  ...Object.keys(countryList).map((country) => ({
                    label: country,
                    value: country,
                  })),
                ]}
                {...register("branch.country", {
                  required: "Country is required",
                })}
                onChange={setValue}
              />
              {errors.country && (
                <p className="text-red-600">{errors.country.message}</p>
              )}
            </div>
            <div className="my-2">
              <CustomSelect
                label="State: "
                placeholder="State"
                className="w-full"
                options={[
                  { label: "Select State", value: "" },
                  ...Object.keys(stateList).map((state1) => ({
                    label: state1,
                    value: state1,
                  })),
                ]}
                {...register("branch.state", { required: true })}
                onChange={setValue}
              />
              {/* {errors.state && (
              <p className="text-red-600">{errors.state.message}</p>
            )} */}
            </div>
            <div className="my-2">
              <CustomSelect
                label="City: "
                placeholder="City"
                className="w-full"
                options={[{ label: "Select City", value: "" }, ...cityList]}
                {...register("branch.city", { required: true })}
                onChange={setValue}
              />
              {errors.city && (
                <p className="text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="my-2">
              <Input
                label="Zipcode: "
                placeholder="Zipcode"
                className="w-full"
                {...register("branch.zip_code", { required: true })}
              />
              {errors.zip_code && (
                <p className="text-red-600">{errors?.zipCode?.message}</p>
              )}
            </div>
          </div>

          <div className="my-5 w-full">
            <Button type="submit" className="w-full">
              Add Branch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranch;
