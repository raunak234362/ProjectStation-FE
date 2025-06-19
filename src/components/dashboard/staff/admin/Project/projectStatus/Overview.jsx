/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutList,
  ClipboardCheck,
  UsersRound,
  Hourglass,
  Timer,
  Target,
  AlertCircle,
  PieChart,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import Service from "../../../../../../config/Service";

// Custom UI components since component/ui is not available
const Card = ({ children, className = "" }) => (
  <div className={`p-4 bg-white border shadow-sm rounded-xl ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value, max, className = "" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mt-2 ${className}`}>
      <div
        className="bg-green-600 h-1.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Overview = ({ projectData, projectTasks, userContributions, dateFilter, filterStage }) => {
  const [modelingHours, setModelingHours] = useState(0);
  const [erectionHours, setErectionHours] = useState(0);
  const [detailingHours, setDetailingHours] = useState(0);
  // Helper function to parse duration strings (HH:MM:SS) to hours
  const parseDuration = (duration) => {
    if (!duration || typeof duration !== "string") return 0;
    const [h, m, s] = duration.split(":").map(Number);
    return h + m / 60 + s / 3600;
  };

  // Format hours to display in a more readable way (5h 30m)
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Filter tasks based on date filter and stage filter
  const filteredTasks = useMemo(() => {
    let tasks = [...projectTasks];

    // First apply stage filter if it exists and is not "all"
    if (filterStage && filterStage !== "all") {
      console.log("Filtering by stage:", filterStage);
      tasks = tasks.filter((task) => {
        // Check both 'stage' and 'Stage' properties (case variations)
        const taskStage = task.stage || task.Stage || task.STAGE;
        console.log("Task stage:", taskStage, "Filter stage:", filterStage);
        return taskStage === filterStage;
      });
    }

    // Then apply date filter if it exists and is not "all"
    if (!dateFilter || dateFilter.type === "all") {
      return tasks;
    }

    return tasks.filter((task) => {
      // Convert task dates to timestamps
      const taskStartDate = new Date(task.start_date).getTime();
      const taskEndDate = new Date(task.due_date).getTime();

      // Week filter
      if (
        dateFilter.type === "week" &&
        dateFilter.weekStart &&
        dateFilter.weekEnd
      ) {
        const weekStart = dateFilter.weekStart;
        const weekEnd = dateFilter.weekEnd;

        return (
          (taskStartDate >= weekStart && taskStartDate <= weekEnd) ||
          (taskEndDate >= weekStart && taskEndDate <= weekEnd) ||
          (taskStartDate <= weekStart && taskEndDate >= weekEnd)
        );
      }

      // Month filter
      if (
        dateFilter.type === "month" &&
        dateFilter.year !== undefined &&
        dateFilter.month !== undefined
      ) {
        const monthStart = new Date(
          dateFilter.year,
          dateFilter.month,
          1
        ).getTime();
        const monthEnd = new Date(
          dateFilter.year,
          dateFilter.month + 1,
          0,
          23,
          59,
          59,
          999
        ).getTime();

        return (
          (taskStartDate >= monthStart && taskStartDate <= monthEnd) ||
          (taskEndDate >= monthStart && taskEndDate <= monthEnd) ||
          (taskStartDate <= monthStart && taskEndDate >= monthEnd)
        );
      }

      // Year filter
      if (dateFilter.type === "year" && dateFilter.year !== undefined) {
        const yearStart = new Date(dateFilter.year, 0, 1).getTime();
        const yearEnd = new Date(
          dateFilter.year,
          11,
          31,
          23,
          59,
          59,
          999
        ).getTime();

        return (
          (taskStartDate >= yearStart && taskStartDate <= yearEnd) ||
          (taskEndDate >= yearStart && taskEndDate <= yearEnd) ||
          (taskStartDate <= yearStart && taskEndDate >= yearEnd)
        );
      }

      // Month range filter
      if (
        dateFilter.type === "range" &&
        dateFilter.year !== undefined &&
        dateFilter.startMonth !== undefined &&
        dateFilter.endMonth !== undefined
      ) {
        const rangeStart = new Date(
          dateFilter.year,
          dateFilter.startMonth,
          1
        ).getTime();
        const rangeEnd = new Date(
          dateFilter.year,
          dateFilter.endMonth + 1,
          0,
          23,
          59,
          59,
          999
        ).getTime();

        return (
          (taskStartDate >= rangeStart && taskStartDate <= rangeEnd) ||
          (taskEndDate >= rangeStart && taskEndDate <= rangeEnd) ||
          (taskStartDate <= rangeStart && taskEndDate >= rangeEnd)
        );
      }

      // Specific date range filter
      if (
        dateFilter.type === "dateRange" &&
        dateFilter.startDate &&
        dateFilter.endDate
      ) {
        const rangeStart = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
        const rangeEnd = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);

        return (
          (taskStartDate >= rangeStart && taskStartDate <= rangeEnd) ||
          (taskEndDate >= rangeStart && taskEndDate <= rangeEnd) ||
          (taskStartDate <= rangeStart && taskEndDate >= rangeEnd)
        );
      }

      return true;
    });
  }, [projectTasks, dateFilter, filterStage]);

  // Calculate hours for each task type based on filtered tasks
  const calculateHours = (type) => {
    const tasks = filteredTasks.filter((task) => task.name.startsWith(type));

    return {
      assigned: tasks.reduce(
        (sum, task) => sum + parseDuration(task.duration),
        0
      ),
      taken: tasks.reduce(
        (sum, task) =>
          sum +
          (task?.workingHourTask?.reduce(
            (innerSum, innerTask) =>
              innerSum + (Number(innerTask.duration) || 0),
            0
          ) || 0),
        0
      ), // taken is already in hours
    };
  };

  // Calculate hours for each task type based on filtered tasks
  const taskTypes = {
    MODELING: calculateHours("MODELING"),
    MC: calculateHours("MC"),
    DETAILING: calculateHours("DETAILING"),
    DC: calculateHours("DC"),
    ERECTION: calculateHours("ERECTION"),
    EC: calculateHours("EC"),
    DESIGNING: calculateHours("DESIGNING"),
    DESIGNCHECKING: calculateHours("DWG_CHECKING"),
    OTHERS: calculateHours("OTHERS"),
  };
  const fetchTotalHours = async () => {
    const MODELLINGHours = await Service.fetchWorkBreakdownHours(
      "MODELING",
      projectData?.id,
      filterStage
    );
    setModelingHours(MODELLINGHours);
    const ERECTIONHours = await Service.fetchWorkBreakdownHours(
      "ERECTION",
      projectData?.id,
      filterStage
    );
    setErectionHours(ERECTIONHours);
    const DETAILHours = await Service.fetchWorkBreakdownHours(
      "DETAILING",
      projectData?.id,
      filterStage
    );
    setDetailingHours(DETAILHours);
    const totalHours = await Service.fetchWorkBreakdownTotalHours(
      projectData?.id,
      filterStage
    );
    console.log("Total Hours:", MODELLINGHours);
  }
  useEffect(() => {
    fetchTotalHours();
  }, []);

  // Calculate total hours based on filtered tasks
  const totalTakenHours = Object.values(taskTypes).reduce((sum, type) => sum + type.taken / 60, 0)
  const totalAssignedHours = projectData.estimatedHours || 0
  const assignedHour = Object.values(taskTypes).reduce((sum, type) => sum + type?.assigned, 0)

  // Pie chart: task status distribution based on filtered tasks
  const statusData = useMemo(() => {
    return Object.entries(
      filteredTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [filteredTasks]);

  // Task types: breakdown based on filtered tasks
  const taskTypeData = useMemo(() => {
    return Object.entries(taskTypes)
      .filter(([_, hours]) => hours.assigned > 0 || hours.taken > 0) // Only show types with hours
      .map(([type, hours]) => ({
        name: type,
        assigned: hours.assigned,
        taken: hours.taken / 60,
      }))
      .sort((a, b) => b.assigned + b.taken - (a.assigned + a.taken)) // Sort by total hours
  }, [taskTypes])

  // Filter user contributions based on filtered tasks
  const filteredUserContributions = useMemo(() => {
    // Recalculate user contributions based on filtered tasks
    const userContributionsFromFilteredTasks = userContributions.map((user) => {
      const userTasks = filteredTasks.filter((task) => task.user?.id === user.id);

      const totalWorkingHourTasks = userTasks.reduce((sum, task) => {
        const taskDuration =
          task.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (innerTask.duration || 0), 0) || 0
        return sum + taskDuration
      }, 0);

      return {
        ...user,
        taskCount: userTasks.length,
        totalAssignedHours: userTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
        totalWorkedHours: (totalWorkingHourTasks / 60).toFixed(2),
      };
    });

    return userContributionsFromFilteredTasks
      .filter((user) => user.taskCount > 0) // Only users with tasks in filtered period
      .sort((a, b) => b.taskCount - a.taskCount); // Sort by task count
  }, [userContributions, filteredTasks]);

  // Stage-specific statistics
  const stageStats = useMemo(() => {
    if (filterStage === "all" || !filterStage) {
      return null;
    }

    const stageTasks = filteredTasks;
    const stageHours = {
      assigned: stageTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
      taken: stageTasks.reduce(
        (sum, task) =>
          sum +
          (task?.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (Number(innerTask.duration) || 0), 0) ||
            0),
        0,
      ) / 60, // Convert minutes to hours
    };

    return {
      taskCount: stageTasks.length,
      assignedHours: stageHours.assigned,
      takenHours: stageHours.taken,
      efficiency: stageHours.assigned > 0 ? ((stageHours.assigned / stageHours.taken) * 100) : 0,
      completedTasks: stageTasks.filter(task => task.status === "COMPLETE").length,
      inProgressTasks: stageTasks.filter(task => task.status === "IN_PROGRESS").length,
      inReviewTasks: stageTasks.filter(task => task.status === "IN_REVIEW").length,
    };
  }, [filteredTasks, filterStage]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#a4de6c",
    "#d0ed57",
    "#83a6ed",
  ]

  // Get stage name for display
  const getStageDisplayName = (stage) => {
    const stageNames = {
      "RFI": "(RFI) Request for Information",
      "IFA": "(IFA) Issue for Approval",
      "BFA": "(BFA) Back from Approval/ Returned App",
      "BFA_M": "(BFA-M) Back from Approval - Markup",
      "RIFA": "(RIFA) Re-issue for Approval",
      "RBFA": "(RBFA) Return Back from Approval",
      "IFC": "(IFC) Issue for Construction/ DIF",
      "BFC": "(BFC) Back from Construction/ Drawing Revision",
      "RIFC": "(RIFC) Re-issue for Construction",
      "REV": "(REV) Revision",
      "CO#": "(CO#) Change Order",
    };
    return stageNames[stage] || stage;
  };

  const approvalHours = formatHours(totalAssignedHours * 0.8)
  console.log("Approval Hours:", approvalHours);

  return (
    <>
      {/* Stage-specific header if filtering by stage */}
      {filterStage && filterStage !== "all" && stageStats && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            Stage Filter: {getStageDisplayName(filterStage)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tasks:</span>
              <span className="ml-2 font-semibold">{stageStats.taskCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Assigned Hours:</span>
              <span className="ml-2 font-semibold">{formatHours(stageStats.assignedHours)}</span>
            </div>
            <div>
              <span className="text-gray-600">Time Taken:</span>
              <span className="ml-2 font-semibold">{formatHours(stageStats.takenHours)}</span>
            </div>
            <div>
              <span className="text-gray-600">Completed:</span>
              <span className="ml-2 font-semibold text-green-600">{stageStats.completedTasks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="flex items-center">
            <LayoutList className="w-5 h-5 mr-2 text-green-500" />
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{filteredTasks.length}</p>
          {filterStage && filterStage !== "all" && (
            <p className="text-xs text-gray-500 mt-1">In {getStageDisplayName(filterStage)}</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center">
            <ClipboardCheck className="w-5 h-5 mr-2 text-green-700" />
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {filteredTasks.filter((task) => task.status === "COMPLETE").length}
          </p>
          <ProgressBar
            value={
              filteredTasks.filter((task) => task.status === "COMPLETE").length
            }
            max={filteredTasks.length}
          />
        </Card>

        <Card>
          <div className="flex items-center">
            <UsersRound className="w-5 h-5 mr-2 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
          </div>
          <p className="text-3xl font-bold">
            {filteredUserContributions.length}
          </p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Hourglass className="w-5 h-5 mr-2 text-gray-800" />
            <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold">
            {formatHours(totalAssignedHours)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-500">
              Approval Hours
            </h3>
          </div>
          <p className="text-3xl font-bold">
            {formatHours(totalAssignedHours * 0.8)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-500">
              Fabrication Hours
            </h3>
          </div>
          <p className="text-3xl font-bold">
            {formatHours(totalAssignedHours * 0.2)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="w-5 h-5 mr-2 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-500">
              Total Assigned Hours
            </h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(assignedHour)}</p>
          {filterStage && filterStage !== "all" && (
            <p className="text-xs text-gray-500 mt-1">For selected stage</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center">
            <Timer className="w-5 h-5 mr-2 text-orange-500" />
            <h3 className="text-sm font-medium text-gray-500">
              Total-Time Taken
            </h3>
          </div>
          <p className="text-3xl font-bold">{formatHours(totalTakenHours)}</p>
          {filterStage && filterStage !== "all" && (
            <p className="text-xs text-gray-500 mt-1">For selected stage</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Project Efficiency</h3>
          </div>
          <p className="text-3xl font-bold">
            {totalAssignedHours && totalTakenHours > 0 ? Math.round(((totalAssignedHours * 0.8) / totalTakenHours) * 100) : 0} %
          </p>
          {filterStage && filterStage !== "all" && (
            <p className="text-xs text-gray-500 mt-1">Stage efficiency</p>
          )}
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        {/* Project Overview Card */}
        <div className="p-5 border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-blue-800">
            <AlertCircle className="w-5 h-5" />
            {filterStage && filterStage !== "all" ? `${getStageDisplayName(filterStage)} Overview` : "Project Overview"}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Tasks:</span>
              <span className="text-lg font-semibold">
                {filteredTasks.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="text-lg font-semibold text-green-600">
                {
                  filteredTasks.filter((task) => task.status === "COMPLETE")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Review:</span>
              <span className="text-lg font-semibold text-blue-500">
                {
                  filteredTasks.filter((task) => task.status === "IN_REVIEW")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Break:</span>
              <span className="text-lg font-semibold text-red-500">
                {filteredTasks.filter((task) => task.status === "BREAK").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="text-lg font-semibold text-amber-500">
                {
                  filteredTasks.filter((task) => task.status === "IN_PROGRESS")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Not Started:</span>
              <span className="text-lg font-semibold text-gray-500">
                {
                  filteredTasks.filter((task) => task.status === "ASSIGNED")
                    .length
                }
              </span>
            </div>
            {filterStage && filterStage !== "all" && stageStats && (
              <div className="pt-2 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Modeling</p> <span className="text-gray-500 font-semibold">{((modelingHours?._sum?.totalExecHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Model Checking</p> <span className="text-gray-500 font-semibold">{((modelingHours?._sum?.totalCheckHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Detailing</p> <span className="text-gray-500 font-semibold">{((detailingHours?._sum?.totalExecHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Detail Checking</p> <span className="text-gray-500 font-semibold">{((detailingHours?._sum?.totalCheckHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Erection</p> <span className="text-gray-500 font-semibold">{((erectionHours?._sum?.totalExecHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Erection Checking</p> <span className="text-gray-500 font-semibold">{((erectionHours?._sum?.totalCheckHr || 0) / 60).toFixed(2)} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stage Efficiency:</span>
                  <span className="text-lg font-semibold text-purple-600">
                    {stageStats.efficiency.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="p-5 bg-white border shadow-sm rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <PieChart className="w-5 h-5" /> Task Status Distribution
          </h2>
          <div className="h-[300px] text-sm">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} tasks`, "Count"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for the selected {filterStage && filterStage !== "all" ? "stage" : "period"}
              </div>
            )}
          </div>
        </div>

        {/* Task Type Hours Comparison */}
        <div className="p-5 bg-white border shadow-sm rounded-xl">
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
            <BarChart2 className="w-5 h-5" /> Hours by Task Type
          </h2>
          <div className="h-[300px] w-full">
            {taskTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(2)} hours`, ""]}
                    labelStyle={{ color: "black" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="assigned"
                    name="Assigned Hours"
                    fill="#8884d8"
                  />
                  <Bar dataKey="taken" name="Hours Taken" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for the selected {filterStage && filterStage !== "all" ? "stage" : "period"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Contributions Chart with improved styling */}
      {/* <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl">
        <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
          <UsersRound className="w-5 h-5" /> Team Contributions
          {filterStage && filterStage !== "all" && (
            <span className="text-sm font-normal text-gray-500">
              (for {getStageDisplayName(filterStage)})
            </span>
          )}
        </h2>
        <div className="h-[250px]">
          {filteredUserContributions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredUserContributions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Tasks",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "taskCount") return [`${value} tasks`, "Task Count"]
                    if (name === "totalAssignedHours") return [`${value.toFixed(2)} hours`, "Assigned Hours"]
                    if (name === "totalWorkedHours") return [`${value} hours`, "Worked Hours"]
                    return [value, name]
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                />
                <Legend />
                <Bar dataKey="taskCount" name="Task Count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar
                  dataKey="totalAssignedHours"
                  name="Assigned Hours"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="totalWorkedHours"
                  name="Worked Hours"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No user contribution data available for the selected {filterStage && filterStage !== "all" ? "stage" : "period"}
            </div>
          )}
        </div>
      </div> */}
    </>
  );
};

export default Overview