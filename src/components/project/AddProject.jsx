/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input, CustomSelect, Button, Toggle } from "../index";
import toast from "react-hot-toast";
import SectionTitle from "../../util/SectionTitle";
import ErrorMsg from "../../util/ErrorMsg";
import Service from "../../config/Service";
import JoditEditor from "jodit-react";
import { useEffect, useState, useRef } from "react";
import { showRFQs } from "../../store/rfqSlice";
import { addProject } from "../../store/projectSlice";

const AddProject = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rfqId: "",
      fabricator: "",
      clientId: "",
      name: "",
      description: "",
      estimatedHours: "",
      department: "",
      manager: "",
      team: "",
      tools: "",
      connectionDesign: false,
      miscDesign: false,
      customerDesign: false,
      detailingMain: false,
      detailingMisc: false,
      start_date: "",
      approvalDate: "",
    },
  });

  const userType = sessionStorage.getItem("userType");
  const [rfq, setRfq] = useState([]);
  const [joditContent, setJoditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const departmentData = useSelector((state) => state.userData?.departmentData);
  const fabricatorData = useSelector(
    (state) => state.fabricatorData?.fabricatorData
  );
  const ClientData = useSelector((state) => state.fabricatorData?.clientData);
  const userData = useSelector((state) => state.userData?.staffData);
  const teams = useSelector((state) => state?.userData?.teamData);

  const managerOption = userData
    ?.filter((user) => user.is_manager && !user.is_disabled)
    ?.map((user) => ({
      label: `${user.f_name} ${user.l_name}`,
      value: user.id,
    }));
  console.log("", managerOption)

  // Watch values
  const selectedRfqId = watch("rfqId");
  const selectedFabricatorId = watch("fabricator");
  const selectedRfq = rfq?.find((rfqData) => rfqData.id === selectedRfqId);

  useEffect(() => {
    if (selectedFabricatorId) {
      // Only reset clientId if the fabricator change was NOT due to RFQ auto-population
      const rfqFabId =
        selectedRfq?.sender?.fabricator?.id || selectedRfq?.fabricatorId;
      if (selectedFabricatorId !== rfqFabId) {
        setValue("clientId", "");
      }
    }
  }, [selectedFabricatorId, selectedRfq, setValue]);

  const clientOptions =
    ClientData?.filter((user) => user.fabricatorId === selectedFabricatorId).map(
      (user) => ({
        label: `${user.f_name} ${user.l_name}`,
        value: user.id,
      })
    ) || [];

  // Fetch RFQs
  const fetchInboxRFQ = async () => {
    try {
      let rfqDetail;
      if (userType === "client") {
        rfqDetail = await Service.sentRFQ();
      } else {
        rfqDetail = await Service.inboxRFQ();
      }
      setRfq(rfqDetail || []);
      dispatch(showRFQs(rfqDetail || []));
    } catch (error) {
      toast.error("Failed to fetch RFQs");
      setRfq([]);
    }
  };

  useEffect(() => {
    fetchInboxRFQ();
  }, []);

  // Auto-populate fields when RFQ is selected
  useEffect(() => {
    if (selectedRfq) {
      const fabId =
        selectedRfq.sender?.fabricator?.id || selectedRfq.fabricatorId;
      const pocId = selectedRfq.sender?.id || selectedRfq.sender_id;

      if (fabId) {
        setValue("fabricator", fabId, {
          shouldValidate: true,
        });
      }
      if (pocId) {
        setValue("clientId", pocId, {
          shouldValidate: true,
        });
      }
      setValue("name", selectedRfq.projectName || "", {
        shouldValidate: true,
      });
      setValue("description", selectedRfq.description || "", {
        shouldValidate: true,
      });
      setJoditContent(selectedRfq.description || "");
    }
  }, [selectedRfqId, selectedRfq, setValue]);

  const joditConfig = {
    height: 100,
    width: "100%",
    placeholder: "Enter notes with rich formatting...",
    enter: "p",
    processPasteHTML: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_as_html",
  };

  const onSubmit = async (data) => {
    const projectData = {
      ...data,
      status: "ACTIVE",
      stage: "KICKOFF",
      rfqId: data.rfqId,
      projectNumber: rfq?.find((r) => r.id === data.rfqId)?.projectNumber || "",
      connectionDesign: Boolean(data.connectionDesign),
      miscDesign: Boolean(data.miscDesign),
      customerDesign: Boolean(data.customerDesign),
      detailingMain: Boolean(data.detailingMain),
      detailingMisc: Boolean(data.detailingMisc),
    };
    try {
      setLoading(true);
      const response = await Service.addProject(projectData);
      toast.success("Project Added Successfully");

      if (response?.data) {
        dispatch(addProject(response.data));
      }

      setJoditContent("");
      setValue("description", "");
      reset();
      if (setActiveTab) {
        setActiveTab("allProject");
      }
    } catch (error) {
      toast.error("Error Adding Project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full my-5 text-black bg-white rounded-lg shadow-md">
      <div className="w-full h-full py-3 px-3 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Fabricator Info */}
          <SectionTitle title="Fabricator Information" />
          <CustomSelect
            label={<span>RFQ</span>}
            placeholder="Select RFQ"
            options={rfq?.map((rfqData) => ({
              label: `${rfqData.projectName} - ${rfqData.subject}`,
              value: rfqData.id,
            }))}
            {...register("rfqId")}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.rfqId?.message} />

          <CustomSelect
            label={<span>Fabricator <span className="text-red-500">*</span></span>}
            placeholder="Select Fabricator"
            options={fabricatorData?.map((fab) => ({
              label: fab.fabName,
              value: fab.id,
            }))}
            {...register("fabricator", { required: "Fabricator is required" })}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.fabricator?.message} />

          <CustomSelect
            label={<span>Point of Contact </span>}
            placeholder="Select Point of Contact"
            options={clientOptions}
            {...register("clientId")}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.clientId?.message} />

          {/* Project Info */}
          <SectionTitle title="Project Information" />
          <Input
            label={<span>Project Name <span className="text-red-500">*</span></span>}
            {...register("name", { required: "Project Name is required" })}
          />
          <ErrorMsg msg={errors.name?.message} />

          <JoditEditor
            value={joditContent}
            config={joditConfig}
            onBlur={(newContent) => {
              setJoditContent(newContent);
              setValue("description", newContent, { shouldValidate: true });
            }}
            className="w-full border border-gray-300 rounded-md"
          />
          <input
            type="hidden"
            {...register("description", { required: "Description is required" })}
          />
          <ErrorMsg msg={errors.description?.message} />

          <Input
            type="number"
            label="Estimated Hours"
            min="0"
            {...register("estimatedHours")}
          />

          {/* Department & Manager */}
          <SectionTitle title="Department Information" />
          <CustomSelect
            label={<span>Department <span className="text-red-500">*</span></span>}
            options={departmentData?.map((dep) => ({
              label: dep.name,
              value: dep.id,
            }))}
            {...register("department", { required: "Department is required" })}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.department?.message} />

          <CustomSelect
            label={<span>Manager <span className="text-red-500">*</span></span>}
            options={[{ label: "Select Manager", value: "" }, ...managerOption]}
            {...register("manager", { required: "Manager is required" })}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.manager?.message} />

          {/* Team Info */}
          <SectionTitle title="Team Information" />
          <CustomSelect
            label="Team"
            options={teams?.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
            {...register("team")}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.team?.message} />

          {/* Additional Info */}
          <SectionTitle title="Additional Information" />
          <CustomSelect
            label="Tools"
            options={["TEKLA", "SDS2", "BOTH", "NO_PREFERENCE"].map((tool) => ({
              label: tool,
              value: tool,
            }))}
            {...register("tools")}
            onChange={setValue}
          />
          <ErrorMsg msg={errors.tools?.message} />

          {/* Connection Design Scope */}
          <SectionTitle title="Connection Design Scope" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Toggle
              label="Main Design"
              {...register("connectionDesign")}
              onChange={(value) => setValue("connectionDesign", value)}
            />
            <Toggle
              label="Misc Design"
              {...register("miscDesign")}
              onChange={(value) => setValue("miscDesign", value)}
            />
            <Toggle
              label="Custom Design"
              {...register("customerDesign")}
              onChange={(value) => setValue("customerDesign", value)}
            />
          </div>

          {/* Detailing Scope */}
          <SectionTitle title="Detailing Scope" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Toggle
              label="Main Steel"
              {...register("detailingMain")}
              onChange={(value) => setValue("detailingMain", value)}
            />
            <Toggle
              label="Miscellaneous Steel"
              {...register("detailingMisc")}
              onChange={(value) => setValue("detailingMisc", value)}
            />
          </div>

          {/* Important Dates */}
          <SectionTitle title="Important Dates" />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              label={<span>Start Date <span className="text-red-500">*</span></span>}
              {...register("start_date", { required: "Start Date is required" })}
            />
            <ErrorMsg msg={errors.start_date?.message} />

            <Input
              type="date"
              label={<span>Approval Date <span className="text-red-500">*</span></span>}
              {...register("approvalDate", { required: "Approval Date is required" })}
            />
            <ErrorMsg msg={errors.approvalDate?.message} />
          </div>

          {/* Submit */}
          <div className="text-center">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
              loading={loading}
            >
              Add Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
