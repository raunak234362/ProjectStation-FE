/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import Input from "../../../../fields/Input";
import { Button, CustomSelect } from "../../../..";
import { useSelector } from "react-redux";


const AddNewRFQ = () => {
    const fabricatorData = useSelector(
        (state) => state.fabricatorData?.fabricatorData
    );
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className="w-full h-[89vh] bg-white overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                    Project/Client Information:
                </div>
                <div>

                    <div className="w-full my-3">
                        <CustomSelect
                            label="Fabricator"
                            placeholder="Fabricator"
                            size="lg"
                            color="blue"
                            options={fabricatorData?.map((fabricator) => ({
                                label: fabricator.fabName,
                                value: fabricator.id,
                            }))}
                            {...register("fabricator", {
                                required: "Fabricator is required",
                            })}
                            onChange={setValue}
                        />
                        {errors.recipients && <div>This field is required</div>}
                    </div>
                    <div className="w-full my-3">
                        <CustomSelect
                            label="Select Recipients:"
                            placeholder="Select Recipients"
                            size="lg"
                            color="blue"
                            // options={recepientsOptions}
                            {...register("recipients", { required: true })}
                            onChange={setValue}
                        />
                        {errors.recipients && <div>This field is required</div>}
                    </div>
                    <div className="w-full mt-3">
                        <Input
                            label="Project Name:"
                            placeholder="Project Name:"
                            size="lg"
                            color="blue"
                            {...register("projectName", { required: true })}
                        />
                        {errors.project && <div>This field is required</div>}
                    </div>
                </div>
                <div className="px-2 py-2 font-bold text-white rounded-lg bg-teal-500/50">
                    Details:
                </div>
                <div>

                    <div className="w-full my-3">
                        <CustomSelect
                            label="Fabricator"
                            placeholder="Fabricator"
                            size="lg"
                            color="blue"
                            options={fabricatorData?.map((fabricator) => ({
                                label: fabricator.fabName,
                                value: fabricator.id,
                            }))}
                            {...register("fabricator", {
                                required: "Fabricator is required",
                            })}
                            onChange={setValue}
                        />
                        {errors.recipients && <div>This field is required</div>}
                    </div>
                    <div className="w-full my-3">
                        <CustomSelect
                            label="Select Recipients:"
                            placeholder="Select Recipients"
                            size="lg"
                            color="blue"
                            // options={recepientsOptions}
                            {...register("recipients", { required: true })}
                            onChange={setValue}
                        />
                        {errors.recipients && <div>This field is required</div>}
                    </div>
                    <div className="w-full mt-3">
                        <Input
                            label="Project Name:"
                            placeholder="Project Name:"
                            size="lg"
                            color="blue"
                            {...register("projectName", { required: true })}
                        />
                        {errors.project && <div>This field is required</div>}
                    </div>
                </div>
                <Button type="submit" className="mt-4 w-full">
                    Submit RFQ
                </Button>
            </form>
        </div>
    )
}

export default AddNewRFQ
