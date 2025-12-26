/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Input, CustomSelect, Button } from "../../index";
import Autosuggest from "react-autosuggest";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Service from "../../../config/Service";
import JobStudy from "./JobStudy";
import SelectedWBTask from "./SelectedWBTask";

const AddWB = ({ projectId, projectData }) => {
  const [project, setProject] = useState({});
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const projectDetails = useSelector((state) => state?.projectData.projectData);

  // Initialize wbActivity as an empty array to prevent map() errors
  const [wbActivity, setWBActivity] = useState([]);

  const [totalHours, setTotalHours] = useState(0); // Initialize total hours to 0
  const [wbTotalHours, setWBTotalHours] = useState({});
  const [projectStage, setProjectStage] = useState(null);
  const workBreakdown = useSelector(
    (state) => state?.projectData.workBreakdown
  );

  const { register, handleSubmit, watch, setValue } = useForm();
  const selectedTask = watch("taskName");
  const selectedStage = watch("stage");

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Calculate WBS descriptions safely using useMemo
  const wbsDescriptions = useMemo(() => {
    if (Array.isArray(wbActivity) && wbActivity.length > 0) {
      return [...new Set(wbActivity.map((task) => task.name))];
    }
    return [];
  }, [wbActivity]);

  // --- API Fetchers ---

  const fetchWBActivity = async () => {
    // Only fetch if both task and stage are selected
    if (!selectedTask || !selectedStage) return;

    try {
      const wbData = await Service.fetchWorkBreakdownActivity(
        selectedTask,
        projectId,
        selectedStage
      );
      setWBActivity(Array.isArray(wbData) ? wbData : []);
    } catch (e) {
      console.error("Failed to fetch WB Activity:", e);
      setWBActivity([]);
    }
  };

  const fetchWBTotalHours = async () => {
    // Only fetch if both task and stage are selected
    if (!selectedTask || !selectedStage) return;

    try {
      const totalHoursData = await Service.fetchWorkBreakdownHours(
        selectedTask,
        projectId,
        selectedStage
      );
      setWBTotalHours(totalHoursData?._sum || {});
    } catch (e) {
      console.error("Failed to fetch WB Total Hours:", e);
      setWBTotalHours({});
    }
  };

  const fetchTotalHours = async () => {
    // Fetch total hours based only on stage
    if (!selectedStage) return;

    try {
      const totalHoursData = await Service.fetchWorkBreakdownTotalHours(
        projectId,
        selectedStage
      );
      const exec = totalHoursData?._sum?.totalExecHr || 0;
      const check = totalHoursData?._sum?.totalCheckHr || 0;
      // Store total hours in minutes (matching EstimatedHr unit)
      setTotalHours(exec + check);
    } catch (e) {
      console.error("Failed to fetch Project Total Hours:", e);
      setTotalHours(0);
    }
  };

  const fetchProject = async () => {
    const project = projectDetails.find((project) => project.id === projectId);
    setProjectStage(project?.stage);
    setProject(project || {});
  };

  // --- Calculations ---

  // EstimatedHr is in minutes (projectData.estimatedHours * 60)
  const EstimatedHr = projectData?.estimatedHours * 60 || 0;

  // Calculate remaining percentage for rework time calculation
  const remainingHours = EstimatedHr - totalHours;

  // The logic for calculating rework percentage is complex.
  // Based on your original formula: (((EstimatedHr - totalHours) / EstimatedHr) * 100) / 63
  // This likely represents the percentage *remaining* relative to a factor (63 is unusual).
  // Assuming the goal is to find the ratio of remaining time vs. total estimated time,
  // and then use a scaling factor (like 1/63) if required by business logic.

  const basePercentage = EstimatedHr > 0 ? remainingHours / EstimatedHr : 0;

  // The '63' factor is retained from your original code, but often in rework calculations,
  // you just use the remaining time ratio (basePercentage).
  // If the percentage needs to be capped at 100% or 1 (for a multiplier):
  const percentageMultiplier = Math.max(0, Math.min(1, basePercentage)); // Max 1, Min 0

  // If you must use the original logic (which results in a very small number):
  const percentage = (basePercentage * 100) / 63;

  // We'll use the 'percentage' variable for the rework calculation in the table

  // --- Effects ---

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, projectDetails]);

  // Fetch Total Hours when selectedStage changes
  useEffect(() => {
    fetchTotalHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStage]);

  // Fetch WB Activity and Total WB Hours when task or stage changes
  useEffect(() => {
    fetchWBActivity();
    fetchWBTotalHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask, selectedStage]);

  // Update selected task data when task changes (from global state)
  useEffect(() => {
    const selectedTaskDetails = workBreakdown.find(
      (item) => item?.taskName === selectedTask
    )?.workBreakdown;
    setSelectedTaskData(selectedTaskDetails);
  }, [selectedTask, workBreakdown]);

  // --- Autosuggest Functions ---

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : wbsDescriptions.filter(
          (desc) => desc.toLowerCase().includes(inputValue) // Used includes for better search
        );
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const onChange = (event, { newValue }) => {
    setSearchValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // --- Handlers ---

  // Handle opening the selected WB task by setting its ID
  const handleSelectedWB = (id) => {
    setSelectedTaskId(id);
    setSelectedActivity(selectedTask);
  };

  // Handle closing the selected WB task
  const handleSelectedWBClose = () => {
    setSelectedTaskId(null);
  };

  const userType = sessionStorage.getItem("userType");

  // Filter wbActivity based on searchValue
  const filteredWbActivity = wbActivity.filter((task) =>
    task.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="bg-white h-[90%] md:p-5 p-2 rounded-lg shadow-lg md:w-full w-11/12">
      <div className="z-10 flex justify-center w-full top-2">
        <div className="px-3 py-2 font-bold text-white bg-teal-400 rounded-lg shadow-md md:px-4 md:text-2xl">
          Work-Break Down Structure
        </div>
      </div>
      <div className="h-[85%] w-full overflow-y-auto">
        <JobStudy projectId={projectId} />

        <div className="mt-10 font-semibold">Work Breakdown Structure -</div>
        <div className="flex justify-center py-5">
          <div className="overflow-x-auto md:w-[80vw] w-full my-3">
            <p className="text-red-500 text-xs">
              *Select the **task type** as well as **stage** to overview
            </p>
            <div className="flex flex-row-[40%,50%] z-50 gap-5 w-full justify-between">
              <div className="w-full">
                <CustomSelect
                  label="WBS - Type"
                  options={[
                    { label: "Modeling", value: "MODELING" },
                    { label: "Detailing", value: "DETAILING" },
                    { label: "Erection", value: "ERECTION" },
                  ]}
                  {...register("taskName", { required: true })}
                  onChange={setValue}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  label="WBS - Stage"
                  options={[
                    { label: "RFI", value: "RFI" },
                    { label: "IFA", value: "IFA" },
                    { label: "BFA", value: "BFA" },
                    { label: "BFA-Markup", value: "BFA_M" },
                    { label: "RIFA", value: "RIFA" },
                    { label: "RBFA", value: "RBFA" },
                    { label: "IFC", value: "IFC" },
                    { label: "BFC", value: "BFC" },
                    { label: "RIFC", value: "RIFC" },
                    { label: "REV", value: "REV" },
                    { label: "CO#", value: "CO#" },
                  ]}
                  {...register("stage", { required: true })}
                  onChange={setValue}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-between pt-3">
                <div className="text-sm font-semibold text-gray-700">
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    Total Hours Summary
                  </p>
                  <p>
                    Total **Execution Hours**:{" "}
                    <span className="font-bold">
                      {(wbTotalHours?.totalExecHr / 60)?.toFixed(2) || "0.00"}
                    </span>{" "}
                    Hr
                  </p>
                  <p>
                    Total **Checking Hours**:{" "}
                    <span className="font-bold">
                      {(wbTotalHours?.totalCheckHr / 60)?.toFixed(2) || "0.00"}
                    </span>{" "}
                    Hr
                  </p>
                  <p>
                    Total **Quantity** (No.):{" "}
                    <span className="font-bold">
                      {wbTotalHours?.totalQtyNo || "0"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 bg-white h-[60vh] overflow-auto rounded-lg border">
              <div className="p-2 sticky top-0 bg-white z-0 border-b">
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={{
                    placeholder: "Search by WBS Description...",
                    value: searchValue,
                    onChange: onChange,
                    className:
                      "w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500",
                  }}
                />
              </div>

              <table className="w-full mt-3 text-sm text-center border border-collapse border-gray-600">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-2 border border-gray-600">S.No</th>
                    <th className="px-2 py-2 border border-gray-600">
                      Description of WBS
                    </th>
                    {/* User Type Check - Qty */}
                    {userType === "admin" ||
                    userType === "department-manager" ? (
                      <th className="px-2 py-2 border border-gray-600">
                        Qty. (No.)
                      </th>
                    ) : null}
                    <th className="px-2 py-2 border border-gray-600">
                      Execution Time (Hr)
                    </th>
                    <th className="px-2 py-2 border border-gray-600">
                      Checking Time (Hr)
                    </th>
                    {/* User Type Check - Rework/Actions */}
                    {userType === "admin" ||
                    userType === "department-manager" ? (
                      <>
                        <th className="px-2 py-2 border border-gray-600">
                          Execution incl. <br /> Rework Time (Hr)
                        </th>
                        <th className="px-2 py-2 border border-gray-600">
                          Checking incl. <br /> Rework Time (Hr)
                        </th>
                        <th className="px-2 py-2 border border-gray-600">
                          Actions
                        </th>
                      </>
                    ) : null}
                  </tr>
                </thead>

                <tbody>
                  {filteredWbActivity.length > 0 ? (
                    filteredWbActivity.map((taskItem, index) => {
                      // Ensure percentage is calculated safely, use 0 if necessary
                      const execHr = taskItem?.totalExecHr || 0;
                      const checkHr = taskItem?.totalCheckHr || 0;

                      const reworkExecTime = (execHr * percentage) / 60;
                      const reworkCheckTime = (checkHr * percentage) / 60;

                      return (
                        <tr
                          key={taskItem?.id || index}
                          className="bg-green-100 hover:bg-green-200 transition"
                        >
                          <td className="px-2 py-1 border border-gray-600">
                            {index + 1}
                          </td>
                          <td className="px-2 py-1 text-left border border-gray-600">
                            {taskItem?.name}
                          </td>
                          {userType === "admin" ||
                          userType === "department-manager" ? (
                            <td className="px-2 py-1 border border-gray-600">
                              {taskItem?.totalQtyNo || 0}
                            </td>
                          ) : null}

                          <td className="px-2 py-1 border border-gray-600">
                            {(execHr / 60).toFixed(2)}
                          </td>
                          <td className="px-2 py-1 border border-gray-600">
                            {(checkHr / 60).toFixed(2)}
                          </td>
                          {userType === "admin" ||
                          userType === "department-manager" ? (
                            <>
                              <td className="px-2 py-1 border border-gray-600">
                                {Math.max(0, reworkExecTime).toFixed(2)}
                              </td>
                              <td className="px-2 py-1 border border-gray-600">
                                {Math.max(0, reworkCheckTime).toFixed(2)}
                              </td>
                              <td className="px-2 py-1 border border-gray-600">
                                <Button
                                  onClick={() => handleSelectedWB(taskItem?.id)}
                                >
                                  Open
                                </Button>
                              </td>
                            </>
                          ) : null}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          userType === "admin" ||
                          userType === "department-manager"
                            ? 8
                            : 5
                        }
                        className="py-8 text-gray-500"
                      >
                        No Work Breakdown activities found for the selected type
                        and stage.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedTaskId && (
        <SelectedWBTask
          projectId={projectId}
          projectStage={selectedStage}
          selectedTaskId={selectedTaskId}
          selectedTask={selectedTask}
          selectedActivity={selectedActivity}
          onClose={handleSelectedWBClose}
        />
      )}
    </div>
  );
};

export default AddWB;
