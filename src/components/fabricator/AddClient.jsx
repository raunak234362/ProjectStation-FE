/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, CustomSelect, Button } from "../index";
import { addClient } from "../../store/fabricatorSlice";
import {
  countries,
  getCountryFlagEmojiFromCountryCode,
} from "country-codes-flags-phone-codes";
import { State, City } from "country-state-city";
import Service from "../../config/Service";
import toast from "react-hot-toast";
import SectionTitle from "../../util/SectionTitle";
import ErrorMsg from "../../util/ErrorMsg";

const AddClient = ({ fabricator }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const countryCode = watch("country_code");
  console.log("Country Code:", countryCode);
  const [branchOptions, setBranchOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const fabricatorAddressOptions = [
    fabricator?.headquaters,
    ...(fabricator?.branches || []),
  ];

  useEffect(() => {
    setBranchOptions(
      fabricatorAddressOptions.map((branch) => ({
        label: branch.address,
        value: branch.id,
      }))
    );
  }, [fabricator]);
  // console.log("Fabricator:", fabricatorAddressOptions);
  const countryList = {
    "United States": "US",
    Canada: "CA",
    India: "IN",
  };

  const country = watch("country");
  const state = watch("state");

  // useEffect(() => {
  //     if (selectedFabricator) {
  //         const fabricator = fabricators.find((fab) => fab.id === selectedFabricator);
  //         const combinedBranches = [
  //             ...(fabricator?.headquaters ? [fabricator.headquaters] : []),
  //             ...(fabricator?.branches || []),
  //         ];
  //         setBranchOptions(
  //             combinedBranches.map((branch) => ({ label: branch.address, value: branch.id }))
  //         );
  //     } else {
  //         setBranchOptions([]);
  //     }
  // }, [selectedFabricator, fabricators]);

  useEffect(() => {
    if (country && countryList[country]) {
      const states = State.getStatesOfCountry(countryList[country]) || [];
      setStateOptions(states.map((s) => ({ label: s.name, value: s.name })));
    }
  }, [country]);

  useEffect(() => {
    if (country && state && countryList[country]) {
      const stateCode = State.getStatesOfCountry(countryList[country])?.find(
        (s) => s.name === state
      )?.isoCode;
      const cities =
        City.getCitiesOfState(countryList[country], stateCode) || [];
      setCityOptions(cities.map((c) => ({ label: c.name, value: c.name })));
    }
  }, [state]);

  const onSubmit = async (data) => {
    try {
      const phone = `${data.country_code}${data.phone}`;
      const payload = {
        ...data,
        phone,
        fabricator: fabricator.id,
        username: data.username.toUpperCase(),
      };
      const response = await Service.addClient(payload);
      dispatch(addClient(response.data));
      toast.success("Client added successfully");
      reset();
    } catch (err) {
      toast.error("Error adding client");
      console.error(err);
    }
  };

  const countryOptions = countries.map((country) => ({
    label: `${getCountryFlagEmojiFromCountryCode(country.code)} ${
      country.name
    } (${country.dialCode})`,
    value: country.dialCode,
  }));

  return (
    <div className="flex justify-center overflow-y-auto text-black">
      <div className="w-full md:px-10 px-4 py-5 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionTitle title="Fabricator Address" />
          <CustomSelect
            label="Address"
            options={branchOptions}
            {...register("address")}
            onChange={setValue}
          />

          <SectionTitle title="User Info" />
          <Input
            label="Username"
            {...register("username", { required: true })}
          />
          <Input
            label="Designation"
            {...register("designation", { required: true })}
          />
          <Input
            label="First Name"
            {...register("f_name", { required: true })}
          />
          <Input label="Middle Name" {...register("m_name")} />
          <Input label="Last Name" {...register("l_name")} />

          <SectionTitle title="Contact Info" />
          <Input label="Email" {...register("email")} />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <CustomSelect
              label="Country Code"
              name="country_code"
              options={countryOptions}
              onChange={setValue}
            />
            <Input label="Phone" {...register("phone", { required: true })} />
          </div>
          <Input label="Alternate Phone" {...register("alt_phone")} />
          <Input label="Landline" {...register("landline")} />
          <Input label="Alternate Landline" {...register("alt_landline")} />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
