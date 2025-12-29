
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { State, City } from "country-state-city";
import { X } from "lucide-react";
import { Input, CustomSelect, Button } from "../index";
import { updateFabricator } from "../../store/fabricatorSlice";
import Service from "../../config/Service";
import SectionTitle from "../../util/SectionTitle";
import ErrorMsg from "../../util/ErrorMsg";
import toast from "react-hot-toast";

const EditFabricator = ({ fabricator, onClose }) => {
  const dispatch = useDispatch();
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const countryMap = {
    "United States": "US",
    Canada: "CA",
    India: "IN",
  };

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fabName: fabricator?.fabName,
      headquaters: {
        address: fabricator?.headquaters?.address,
        zip_code: fabricator?.headquaters?.zip_code,
        country: fabricator?.headquaters?.country,
        state: fabricator?.headquaters?.state,
        city: fabricator?.headquaters?.city,
      },
      website: fabricator?.website,
      drive: fabricator?.drive,
      IFAComepletionAlertPercentage: fabricator?.IFAComepletionAlertPercentage,
      IFCompletionAlertPercentage: fabricator?.IFCompletionAlertPercentage,
    }
  });

  const country = watch("headquater.country");
  const state = watch("headquater.state");

  useEffect(() => {
    if (country && countryMap[country]) {
      const states = State.getStatesOfCountry(countryMap[country]) || [];
      setStateOptions(states.map((s) => ({ label: s.name, value: s.name })));
    }
  }, [country]);

  useEffect(() => {
    if (state && country && countryMap[country]) {
      const stateCode = State.getStatesOfCountry(countryMap[country]).find(
        (s) => s.name === state
      )?.isoCode;

      if (stateCode) {
        const cities = City.getCitiesOfState(countryMap[country], stateCode) || [];
        setCityOptions(cities.map((c) => ({ label: c.name, value: c.name })));
      }
    }
  }, [state, country]);

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await Service.editFabricator(fabricator.id, data);
      dispatch(updateFabricator(response.data));
      toast.success("✅ Fabricator updated successfully");
      onClose();
    } catch (error) {
      toast.error("❌ Failed to update fabricator");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[60]">
      <div className="bg-white w-11/12 md:w-8/12 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Edit Fabricator</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section: Fabricator Info */}
            <SectionTitle title="Fabricator Information" />
            <Input
              label="Fabricator Name"
              placeholder="Enter fabricator name"
              {...register("fabName", { required: "Name is required" })}
            />
            {errors.fabName && <ErrorMsg msg={errors.fabName.message} />}

            {/* Section: Location */}
            <SectionTitle title="Location Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Address"
                placeholder="Enter address"
                {...register("headquaters.address")}
              />
              <Input
                label="Zipcode"
                placeholder="Enter zipcode"
                {...register("headquaters.zip_code", { required: "Zipcode is required" })}
              />
            </div>
            {errors.headquaters?.zip_code && (
              <ErrorMsg msg={errors.headquaters.zip_code.message} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomSelect
                label="Country"
                placeholder="Select country"
                options={[
                  { label: "Select Country", value: "" },
                  ...Object.keys(countryMap).map((c) => ({
                    label: c,
                    value: c,
                  })),
                ]}
                {...register("headquaters.country", { required: "Country is required" })}
                onChange={setValue}
              />
              <CustomSelect
                label="State"
                placeholder="Select state"
                options={[{ label: "Select State", value: "" }, ...stateOptions]}
                {...register("headquaters.state", { required: "State is required" })}
                onChange={setValue}
              />
              <CustomSelect
                label="City"
                placeholder="Select city"
                options={[{ label: "Select City", value: "" }, ...cityOptions]}
                {...register("headquaters.city", { required: "City is required" })}
                onChange={setValue}
              />
            </div>

            {/* Section: Website & Drive */}
            <SectionTitle title="Links" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                type="url"
                placeholder="https://example.com"
                {...register("website")}
              />
              <Input
                label="Drive"
                type="url"
                placeholder="https://drive.google.com/..."
                {...register("drive")}
              />
            </div>

            <SectionTitle title="Invoice Percent" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Approval Percent"
                type="number"
                placeholder="Enter Approval percent"
                {...register("IFAComepletionAlertPercentage", { valueAsNumber: true })}
              />
              <Input
                label="Fabrication Percent"
                type="number"
                placeholder="Enter Fabrication percent"
                {...register("IFCompletionAlertPercentage", { valueAsNumber: true })}
              />

            </div>

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
              >
                Update Fabricator
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFabricator;
