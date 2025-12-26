/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input, Button } from "../../index";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Service from "../../../config/Service";
import toast from "react-hot-toast";
import EditQuantityForm from "./EditQuantityForm";
import AddMoreSubtask from "./AddMoreSubtask.jsx";
import EditUnitTime from "./EditUnitTime";



const SelectedWBTask = ({
  onClose,
  selectedTask,
  selectedTaskId,
  selectedActivity,
  projectId,
  projectStage,
}) => {
  const workBreakdown = useSelector(
    (state) => state?.projectData.workBreakdown
  );
  const [workBD, setWorkBD] = useState("");
  const [subTaskBD, setSubTaskBD] = useState([]);
  const [showTimeFormIndex, setShowTimeFormIndex] = useState(null);
  const [showQuantityFormIndex, setShowQuantityFormIndex] = useState(null); // state to track which subtask is being edited for quantity
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [qtyFilter, setQtyFilter] = useState({ min: "", max: "" });
  const [execTimeFilter, setExecTimeFilter] = useState({ min: "", max: "" });
  const [checkTimeFilter, setCheckTimeFilter] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");
  console.log("Selected Stage:", projectStage);
  const fetchWorkBD = async () => {
    const workBreakDown = workBreakdown.find(
      (wb) => wb.taskName === selectedTask
    );
    setWorkBD(workBreakDown);
  };

  const fetchSubTasks = async () => {
    const subTasks = await Service.allSubTasks(projectId, selectedTaskId, projectStage);
    setSubTaskBD(subTasks);
  };

  useEffect(() => {
    fetchSubTasks();
    fetchWorkBD();
  }, []);

  const handleTimeUpdateClick = (index) => {
    setShowTimeFormIndex(index);
  };

  const handleQuantityUpdateClick = (index) => {
    setShowQuantityFormIndex(index);
  };

  const handleSaveUpdatedSubtask = (updatedData) => {
    const updatedSubTasks = [...subTaskBD];
    updatedSubTasks[showTimeFormIndex] = {
      ...updatedSubTasks[showTimeFormIndex],
      ...updatedData,
    };
    setSubTaskBD(updatedSubTasks);
  };

  const handleSaveUpdatedQuantity = (updatedData) => {
    const updatedSubTasks = [...subTaskBD];
    updatedSubTasks[showQuantityFormIndex] = {
      ...updatedSubTasks[showQuantityFormIndex],
      ...updatedData,
    };
    setSubTaskBD(updatedSubTasks);
  };


  const userType = sessionStorage.getItem("userType");
  const isAdmin = userType === "admin";

  // Filter and sort the subtask data
  const filteredAndSortedSubTasks = useMemo(() => {
    let filtered = subTaskBD.filter((subTask) => {
      // Search filter
      const matchesSearch = subTask.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Quantity filter
      const matchesQty =
        (!qtyFilter.min || subTask.QtyNo >= parseFloat(qtyFilter.min)) &&
        (!qtyFilter.max || subTask.QtyNo <= parseFloat(qtyFilter.max));

      // Execution time filter (convert to hours)
      const execHours = (subTask.execHr / 60);
      const matchesExecTime =
        (!execTimeFilter.min || execHours >= parseFloat(execTimeFilter.min)) &&
        (!execTimeFilter.max || execHours <= parseFloat(execTimeFilter.max));

      // Check time filter (convert to hours)
      const checkHours = (subTask.checkHr / 60);
      const matchesCheckTime =
        (!checkTimeFilter.min || checkHours >= parseFloat(checkTimeFilter.min)) &&
        (!checkTimeFilter.max || checkHours <= parseFloat(checkTimeFilter.max));

      return matchesSearch && matchesQty && matchesExecTime && matchesCheckTime;
    });

    // Sort the filtered data
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "description":
            aValue = a.description.toLowerCase();
            bValue = b.description.toLowerCase();
            break;
          case "quantity":
            aValue = parseFloat(a.QtyNo) || 0;
            bValue = parseFloat(b.QtyNo) || 0;
            break;
          case "execTime":
            aValue = parseFloat(a.execHr) || 0;
            bValue = parseFloat(b.execHr) || 0;
            break;
          case "checkTime":
            aValue = parseFloat(a.checkHr) || 0;
            bValue = parseFloat(b.checkHr) || 0;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    }

    return filtered;
  }, [subTaskBD, searchTerm, qtyFilter, execTimeFilter, checkTimeFilter, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setQtyFilter({ min: "", max: "" });
    setExecTimeFilter({ min: "", max: "" });
    setCheckTimeFilter({ min: "", max: "" });
    setSortBy("none");
    setSortOrder("asc");
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full p-2 bg-white rounded-lg shadow-lg h-fit md:p-5 md:w-[60%] lg:w-[50%]">
        <div className="flex flex-row justify-between ">
          <Button className="bg-red-500" onClick={() => onClose(true)}>
            Close
          </Button>
        </div>

        <div className="flex flex-row items-center justify-center mb-4">
          <div>
            <b>Selected Task:</b>{" "}
            {workBD?.task?.find((task) => task.id === selectedTaskId)?.name}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search subtasks by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-600"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            {(searchTerm || qtyFilter.min || qtyFilter.max || execTimeFilter.min || execTimeFilter.max || checkTimeFilter.min || checkTimeFilter.max || sortBy !== "none") && (
              <Button
                onClick={clearFilters}
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t text-sm">
              {/* Quantity Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity Range</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={qtyFilter.min}
                    onChange={(e) => setQtyFilter({ ...qtyFilter, min: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={qtyFilter.max}
                    onChange={(e) => setQtyFilter({ ...qtyFilter, max: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Execution Time Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Exec Time Range (Hr)</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min"
                    value={execTimeFilter.min}
                    onChange={(e) => setExecTimeFilter({ ...execTimeFilter, min: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max"
                    value={execTimeFilter.max}
                    onChange={(e) => setExecTimeFilter({ ...execTimeFilter, max: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Check Time Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Check Time Range (Hr)</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min"
                    value={checkTimeFilter.min}
                    onChange={(e) => setCheckTimeFilter({ ...checkTimeFilter, min: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max"
                    value={checkTimeFilter.max}
                    onChange={(e) => setCheckTimeFilter({ ...checkTimeFilter, max: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                <div className="flex gap-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="checkTime">Check Time</option>
                    <option value="description">Description</option>
                    <option value="execTime">Exec Time</option>
                    <option value="none">None</option>
                    <option value="quantity">Quantity</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">↑</option>
                    <option value="desc">↓</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 text-xs text-gray-600">
            Showing {filteredAndSortedSubTasks.length} of {subTaskBD.length} subtasks
          </div>
        </div>

        <div className="pt-10 bg-white h-[60vh] overflow-auto rounded-lg">
          <table className="w-full text-sm text-center border border-collapse border-gray-600">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border border-gray-600 ">Sub-Task</th>
                <th className="px-2 py-1 border border-gray-600 ">Qty</th>
                <th className="px-2 py-1 border border-gray-600">
                  Execution Hours
                </th>
                <th className="px-2 py-1 border border-gray-600">
                  Checking Hours
                </th>
                <th className="px-2 py-1 border border-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedSubTasks.length > 0 ? (
                filteredAndSortedSubTasks.map((subTask, index) => {
                  // Find the original index in subTaskBD for edit operations
                  const originalIndex = subTaskBD.findIndex(st => st.id === subTask.id);
                  return (
                    <tr key={subTask.id} className="hover:bg-gray-50">
                      <td className="px-2 py-1 border border-gray-600">
                        {subTask.description}
                      </td>

                      <td className="px-2 py-1 border border-gray-600">
                        {subTask.QtyNo}
                      </td>

                      <td className="px-2 py-1 border border-gray-600">
                        {(subTask.execHr / 60).toFixed(2)}
                      </td>

                      <td className="px-2 py-1 border border-gray-600">
                        {(subTask.checkHr / 60).toFixed(2)}
                      </td>

                      <td className="flex gap-2 py-1 border border-gray-600 x-2">
                        {/*if admin show update unittime or else show edit quantity*/}
                        {isAdmin ? (
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={() => handleTimeUpdateClick(originalIndex)}
                              className="text-white bg-blue-500 text-sm"
                            >
                              Update Time
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleQuantityUpdateClick(originalIndex)}
                              className="text-white bg-blue-500 text-sm"
                            >
                              Edit Quantity
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            onClick={() => handleQuantityUpdateClick(originalIndex)}
                            className="text-white bg-blue-500 text-sm"
                          >
                            Edit Quantity
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="border border-gray-600 px-4 py-8 text-center text-gray-500">
                    {subTaskBD.length === 0 ? (
                      <div>
                        <div className="text-lg font-medium mb-2">No Subtasks Available</div>
                        <div className="text-sm">No subtasks have been created for this task yet.</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-medium mb-2">No Results Found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria.</div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 text-white bg-teal-600 w-[100%] ml-2"
          >
            Add More Subtask
          </Button>
        </div>
      </div>
      {/*to update unit time*/}
      {showTimeFormIndex !== null && (
        <EditUnitTime
          subTask={subTaskBD[showTimeFormIndex]}
          onClose={() => setShowTimeFormIndex(null)}
          onSave={handleSaveUpdatedSubtask}
        />
      )}
      {/*to update quantity*/}
      {showQuantityFormIndex !== null && (
        <EditQuantityForm
          subTask={subTaskBD[showQuantityFormIndex]}
          onClose={() => setShowQuantityFormIndex(null)}
          onSave={handleSaveUpdatedQuantity}
        />
      )}
      {/*to add more subtasks*/}
      {isModalOpen && (
        <AddMoreSubtask
          handleClose={() => setIsModalOpen(false)}
          selectedTaskId={selectedTaskId}
          projectId={projectId}
          fetchSubTask={fetchSubTasks}
          projectStage={projectStage}
        />
      )}
    </div>
  );
};

export default SelectedWBTask;

