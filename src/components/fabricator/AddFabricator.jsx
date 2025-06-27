import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { State, City } from "country-state-city";
import { Input, CustomSelect, Button } from "../index";
import { addFabricator } from "../../store/fabricatorSlice";
import Service from "../../config/Service";
import { toast } from "react-toastify";
import SectionTitle from "../../util/SectionTitle";
import ErrorMsg from "../../util/ErrorMsg";

const AddFabricator = () => {
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
        reset,
        formState: { errors },
    } = useForm();

    const country = watch("headquater.country");
    const state = watch("headquater.state");

    useEffect(() => {
        if (country && countryMap[country]) {
            const states = State.getStatesOfCountry(countryMap[country]) || [];
            setStateOptions(states.map((s) => ({ label: s.name, value: s.name })));
            setCityOptions([]); // Clear previous cities
            setValue("headquater.state", "");
            setValue("headquater.city", "");
        }
    }, [country]);

    useEffect(() => {
        if (state && country && countryMap[country]) {
            const stateCode = State.getStatesOfCountry(countryMap[country]).find(
                (s) => s.name === state
            )?.isoCode;

            const cities = City.getCitiesOfState(countryMap[country], stateCode) || [];
            setCityOptions(cities.map((c) => ({ label: c.name, value: c.name })));
            setValue("headquater.city", "");
        }
    }, [state]);

    const onSubmit = async (data) => {
        try {
            const response = await Service.addFabricator(data);
            dispatch(addFabricator(response.data));
            toast.success("✅ Fabricator added successfully");
            reset();
        } catch (error) {
            toast.error("❌ Failed to add fabricator");
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center w-full text-black my-5">
            <div className="w-full md:px-10 px-4 py-5 bg-white shadow-md rounded-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Section: Fabricator Info */}
                    <SectionTitle title="Fabricator Information" />
                    <Input
                        label="Fabricator Name"
                        placeholder="Enter fabricator name"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <ErrorMsg msg={errors.name.message} />}

                    {/* Section: Location */}
                    <SectionTitle title="Location Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Address"
                            placeholder="Enter address"
                            {...register("headquater.address")}
                        />
                        <Input
                            label="Zipcode"
                            placeholder="Enter zipcode"
                            {...register("headquater.zip_code", { required: "Zipcode is required" })}
                        />
                    </div>
                    {errors.headquater?.zip_code && (
                        <ErrorMsg msg={errors.headquater.zip_code.message} />
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
                            {...register("headquater.country", { required: "Country is required" })}
                            onChange={setValue}
                        />
                        <CustomSelect
                            label="State"
                            placeholder="Select state"
                            options={[{ label: "Select State", value: "" }, ...stateOptions]}
                            {...register("headquater.state", { required: "State is required" })}
                            onChange={setValue}
                        />
                        <CustomSelect
                            label="City"
                            placeholder="Select city"
                            options={[{ label: "Select City", value: "" }, ...cityOptions]}
                            {...register("headquater.city", { required: "City is required" })}
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

                    <div className="pt-4">
                         <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold">
                            Add Fabricator
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFabricator;

// Utility subcomponents


