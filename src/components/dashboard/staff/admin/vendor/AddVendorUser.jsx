/* eslint-disable no-unused-vars */
import { CustomSelect, Input, Button, Toggle } from "../../../../index";

import { City, State } from "country-state-city";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Service from "../../../../../config/Service";
import { addVendorUser } from "../../../../../store/vendorSlice";
import {
  countries,
  getCountryFlagEmojiFromCountryCode,
} from "country-codes-flags-phone-codes";

const AddVendorUser = () => {
  
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showAlert, setShowalert] = useState(false);
  const vendors = useSelector((state) => state?.vendorData?.vendorData);

  const selectedVendor = watch("vendor");
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    if (selectedVendor) {
      const vendor = vendors.find((ven) => ven.id === selectedVendor);
      console.log(vendor);
      if (vendor) {
        setBranchOptions(
          vendor?.branch?.map((branches) => ({
            label: branches.address,
            value: branches.address,
          }))
        );
      }
    } else {
      setBranchOptions([]);
    }
  }, [selectedVendor, vendors]);

  const countryOptions = countries.map((country) => ({
    label: `${getCountryFlagEmojiFromCountryCode(country.code)} ${
      country.name
    } (${country.dialCode})`,
    value: country.dialCode,
  }));

  const AddVendorUser = async (data) => {
    console.log(data);
    
    const vendorData ={
      ...data,
      contactPoint:true,
    }
    // const vendorUser = await Service.addVendorUser(data, token)
    dispatch(addVendorUser(vendorData));
  };

  return (
    <div className="flex w-full justify-center text-black my-5">
      <div className="h-full w-full overflow-y-auto md:px-10 px-2 py-3">
        <form onSubmit={handleSubmit(AddVendorUser)}>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Vendor Information:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full py-1">
              <CustomSelect
                label="Select Vendor:"
                placeholder="Select Vendor"
                size="lg"
                color="blue"
                options={vendors.map((vendor) => ({
                  label: vendor?.name,
                  value: vendor?.id,
                }))}
                {...register("vendor", { required: true })}
                onChange={setValue}
              />
              {errors.vendor && <div>This field is required</div>}
            </div>
            <div className="w-full my-2">
              <CustomSelect
                label="Branch:"
                placeholder="Branch"
                size="lg"
                color="blue"
                options={branchOptions}
                {...register("address")}
                onChange={setValue}
              />
            </div>
          </div>
          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Vendor User:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full py-1">
              <Input
                label="Username:"
                placeholder="Username"
                size="lg"
                color="blue"
                {...register("username", { required: true })}
              />
              {errors.username && <div>This field is required</div>}
            </div>
            <div className="w-full py-1">
              <Input
                label="Designation:"
                placeholder="Designation"
                size="lg"
                color="blue"
                {...register("title", { required: true })}
              />
              {errors.designation && <div>This field is required</div>}
            </div>
            <div className="w-full py-1">
              <Input
                label="First Name:"
                placeholder="First Name"
                size="lg"
                color="blue"
                {...register("f_name", { required: true })}
              />
              {errors.f_name && <div>This field is required</div>}
            </div>
            <div className="w-full py-1">
              <Input
                label="Middle Name:"
                placeholder="Middle Name"
                size="lg"
                color="blue"
                {...register("m_name")}
              />
              {errors.m_name && <div>This field is required</div>}
            </div>
            <div className="w-full py-1">
              <Input
                label="Last Name:"
                placeholder="Last Name"
                size="lg"
                color="blue"
                {...register("l_name")}
              />
              {errors.l_name && <div>This field is required</div>}
            </div>
          </div>

          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Contact Information:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="w-full grid md:grid-cols-[15%,80%] grid-flow-row items-center">
              <div className="w-full py-1">
                <CustomSelect
                  label="Country Code:"
                  color="blue"
                  name="country_code"
                  options={countryOptions}
                  onChange={setValue}
                />
              </div>
              <div className="w-full py-1">
                <Input
                  label="Contact Number:"
                  placeholder="Contact Number"
                  size="lg"
                  color="blue"
                  {...register("phone", { required: true })}
                />
                {errors.phone && <div>This field is required</div>}
              </div>
            </div>
            <div className="w-full py-1">
              <Input
                label="Email:"
                placeholder="Email"
                size="lg"
                color="blue"
                {...register("email", { required: true })}
              />
              {errors.designation && <div>This field is required</div>}
            </div>
          </div>

          {/* <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
            Role Information:
          </div>
          <div className="my-2 md:px-2 px-1">
            <div className="">
              <Toggle
                label="Point of Contact"
                name="contactPoint"
                {...register("contactPoint")}
              />
            </div>
          </div> */}

          <div className="bg-teal-500/50 rounded-lg px-2 py-2 font-bold text-white">
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
          </div>
          {showAlert && (
            <div className="bg-red-500/50 rounded-lg px-2 py-2 font-bold text-white">
              Passwords do not match
            </div>
          )}

          <div className="my-5 w-full">
            <Button type="submit" className="w-full">
              Add Vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorUser;
