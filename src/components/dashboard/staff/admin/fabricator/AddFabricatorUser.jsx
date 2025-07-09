/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { Input, CustomSelect, Button } from "../../../../index";
import { useDispatch, useSelector } from "react-redux";
import { addClient } from "../../../../../store/fabricatorSlice";
import {
  countries,
  getCountryFlagEmojiFromCountryCode,
} from "country-codes-flags-phone-codes";
import Service from "../../../../../config/Service";
import { useEffect, useState } from "react";
import { City, State } from "country-state-city";
import toast from "react-hot-toast";

const AddFabricatorUser = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData
  );
  const selectedFabricator = watch("fabricator");
  const [branchOptions, setBranchOptions] = useState();

  useEffect(() => {
    if (selectedFabricator) {
      const fabricator = fabricators.find(
        (fab) => fab.id === selectedFabricator
      );
      console.log(fabricator?.headquaters);
      if (fabricator) {
        const combinedBranches = [
          ...(fabricator.headquaters ? [fabricator.headquaters] : []),
          ...(fabricator.branches || []),
        ];
        console.log(combinedBranches);
        setBranchOptions(
          combinedBranches.map((branch) => ({
            label: branch.address,
            value: branch.id,
          }))
        );
      }
    } else {
      setBranchOptions([]);
    }
  }, [selectedFabricator, fabricators]);

  console.log(branchOptions);

  const countryOptions = countries.map((country) => ({
    label: `${getCountryFlagEmojiFromCountryCode(country.code)} ${
      country.name
    } (${country.dialCode})`,
    value: country.dialCode,
  }));

  const country = watch("country");
  const state = watch("state");
  const [stateList, setStateList] = useState([
    { label: "Select State", value: "" },
  ]);
  const [cityList, setCityList] = useState([
    { label: "Select City", value: "" },
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
      ) || []
    );
  }, [state]);

  const AddFabricatorUser = async (data) => {
    try {
      const phoneNumber = `${data?.country_code}${data?.phone}`;
      const updatedData = {
        ...data,
        phone: phoneNumber,
        username: data.username.toUpperCase(),
        // fabricator: fabricators.find((fab) => fab.id === data.fabricator),
      };
      const clientUser = await Service.addClient(updatedData);
      dispatch(addClient(clientUser.data));
      toast.success("Client added successfully");
      console.log("Client Data----------", updatedData);
      // dispatch(addClient(updatedData));
    } catch (error) {
      toast.error("Error adding client");
      console.log(error);
    }
  };

  return (
    <div className="flex w-full justify-center text-black my-5">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(AddFabricatorUser)}>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            User Fabricator Details:
          </div>
          <div className="my-2 px-1 md:px-2">
            <div className="w-full my-2">
              <CustomSelect
                label="Fabricator:"
                placeholder="Fabricator"
                size="lg"
                color="blue"
                options={fabricators?.map((fabricator) => ({
                  label: fabricator.fabName,
                  value: fabricator.id,
                }))}
                {...register("fabricator", { required: true })}
                onChange={setValue}
              />
              {errors.fabricator && <div>This field is required</div>}
            </div>
            <div className="w-full my-2">
              <CustomSelect
                label="Address:"
                placeholder="Address"
                size="lg"
                color="blue"
                options={branchOptions}
                {...register("address")}
                onChange={setValue}
              />
            </div>
          </div>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            User Information:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full my-2">
              <Input
                label="Username:"
                placeholder="Username"
                size="lg"
                color="blue"
                {...register("username", { required: true })}
              />
              {errors.username && <div>This field is required</div>}
            </div>
            <div className="w-full my-2">
              <Input
                label="User Designation:"
                placeholder="User Designation"
                size="lg"
                color="blue"
                {...register("designation", {
                  required: "User designation is required",
                })}
              />
              {errors.designation && <div>This field is required</div>}
            </div>
            <div className="w-full my-2">
              <Input
                label="First Name:"
                placeholder="First Name"
                size="lg"
                color="blue"
                {...register("f_name", { required: true })}
              />
              {errors.f_name && <div>This field is required</div>}
            </div>
            <div className="w-full my-2">
              <Input
                label="Middle Name:"
                placeholder="Middle Name"
                size="lg"
                color="blue"
                {...register("m_name")}
              />
            </div>
            <div className="w-full my-2">
              <Input
                label="Last Name:"
                placeholder="Last Name"
                size="lg"
                color="blue"
                {...register("l_name")}
              />
            </div>
          </div>

          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Contact Information:
          </div>
          <div className="my-2 px-1 md:px-2">
            <div className="w-full my-2">
              <Input
                label="Email:"
                placeholder="Email"
                size="lg"
                color="blue"
                {...register("email")}
              />
            </div>
            <div className="w-full gap-2 my-2 grid grid-cols-2 items-center">
              <div className="w-full">
                <CustomSelect
                  label="Country Code:"
                  color="blue"
                  name="country_code"
                  options={countryOptions}
                  onChange={setValue}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Contact Number:"
                  placeholder="Contact Number"
                  size="lg"
                  color="blue"
                  {...register("phone", { required: true })}
                />
                {errors.phone && <div>This field is required</div>}
              </div>
              <div className="w-full my-2">
                <Input
                  label="Alternate Number:"
                  placeholder="Alternate Number"
                  size="lg"
                  color="blue"
                  {...register("alt_phone")}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Landline Number:"
                  placeholder="Landline Number"
                  size="lg"
                  color="blue"
                  {...register("landline")}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Alternate Landline Number:"
                  placeholder="Alternate Landline Number"
                  size="lg"
                  color="blue"
                  {...register("alt_landline")}
                />
              </div>
            </div>
          </div>
          {/* <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Security:
          </div>
          <div className="my-2 px-1 md:px-2">
            <div className="w-full my-2">
              <Input
                label="Password:"
                placeholder="Password"
                type="password"
                size="lg"
                color="blue"
                {...register("password")}
              />
            </div>
            <div className="w-full my-2">
              <Input
                label="Confirm Password:"
                type="password"
                placeholder="Confirm Password"
                size="lg"
                color="blue"
                {...register("cnf_password")}
              />
            </div>
          </div> */}

          <div className="my-5 w-full">
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFabricatorUser;
