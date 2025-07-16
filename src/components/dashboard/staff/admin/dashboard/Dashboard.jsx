
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Bar, Pie, Line } from "react-chartjs-2";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "chart.js/auto";
import {
  LayoutGrid,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle2,
  Download,
} from "lucide-react";
import Button from "../../../../fields/Button";
import Service from "../../../../../config/Service";
import AllProjects from "../../../../project/AllProjects";

const ProjectDashboard = () => {
  const userType = sessionStorage.getItem("userType");
  const projectData = useSelector((state) => state?.projectData?.projectData || []);
  const taskData = useSelector((state) => state.taskData.taskData || []);
  const [activeChart, setActiveChart] = useState("line");
  const [departmentTask, setDepartmentTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Process department tasks for department managers
  useEffect(() => {
    if (userType === "department-manager") {
      const departmentTaskData = taskData.flatMap((tasks) => tasks?.tasks || []);
      setDepartmentTask(departmentTaskData);
    }
  }, [userType, taskData]);

  // Fetch dashboard counts
  useEffect(() => {
    const fetchDashboardCount = async () => {
      setIsLoading(true);
      try {
        await Service.getDashboardCounts();
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };
    fetchDashboardCount();
  }, []);

  // Prepare project data with tasks
  const projectsWithTasks = useMemo(() =>
    projectData.map((project) => ({
      ...project,
      tasks: (userType === "department-manager" ? departmentTask : taskData).filter(
        (task) => task?.project_id === project.id
      ),
    })), [projectData, taskData, departmentTask, userType]);

  // Calculate task statistics
  const tasksToUse = useMemo(() =>
    userType === "department-manager" ? departmentTask : taskData, [userType, departmentTask, taskData]);

  const taskStats = useMemo(() => ({
    completed: tasksToUse?.filter((task) => task?.status === "COMPLETE")?.length || 0,
    inProgress: tasksToUse?.filter((task) => task?.status === "IN_PROGRESS")?.length || 0,
    assigned: tasksToUse?.filter((task) => task?.status === "ASSIGNED")?.length || 0,
    inReview: tasksToUse?.filter((task) => task?.status === "IN_REVIEW")?.length || 0,
    total: tasksToUse?.length || 0,
  }), [tasksToUse]);

  // Project statistics
  const projectStats = useMemo(() => ({
    total: projectData?.length || 0,
    active: projectData?.filter((p) => p.status === "ACTIVE")?.length || 0,
    completed: projectData?.filter((p) => p.status === "COMPLETE")?.length || 0,
    onHold: projectData?.filter((p) => p.status === "ONHOLD")?.length || 0,
  }), [projectData]);

  // Chart colors
  const chartColors = useMemo(() => ({
    completed: "rgba(16, 185, 129, 0.8)",
    inProgress: "rgba(59, 130, 246, 0.8)",
    assigned: "rgba(139, 92, 246, 0.8)",
    inReview: "rgba(245, 158, 11, 0.8)",
    onHold: "rgba(239, 68, 68, 0.8)",
  }), []);

  // Project Task Data for Bar Chart
  const projectTaskData = useMemo(() => {
    const projects = userType === "department-manager"
      ? taskData.map((p) => p.name).filter(Boolean)
      : projectData.map((p) => p.name).filter(Boolean);
    return {
      labels: projects,
      datasets: [
        {
          label: "Tasks Completed",
          data: projects.map((projectName) => {
            const project = userType === "department-manager"
              ? taskData.find((p) => p.name === projectName)
              : projectData.find((p) => p.name === projectName);
            return tasksToUse?.filter(
              (task) => task?.project_id === project?.id && task?.status === "COMPLETE"
            ).length || 0;
          }),
          backgroundColor: chartColors.completed,
          borderRadius: 6,
        },
        {
          label: "Tasks In Review",
          data: projects.map((projectName) => {
            const project = userType === "department-manager"
              ? taskData.find((p) => p.name === projectName)
              : projectData.find((p) => p.name === projectName);
            return tasksToUse?.filter(
              (task) => task?.project_id === project?.id && task?.status === "IN_REVIEW"
            ).length || 0;
          }),
          backgroundColor: chartColors.inReview,
          borderRadius: 6,
        },
        {
          label: "Tasks In Progress",
          data: projects.map((projectName) => {
            const project = userType === "department-manager"
              ? taskData.find((p) => p.name === projectName)
              : projectData.find((p) => p.name === projectName);
            return tasksToUse?.filter(
              (task) => task?.project_id === project?.id && task?.status === "IN_PROGRESS"
            ).length || 0;
          }),
          backgroundColor: chartColors.inProgress,
          borderRadius: 6,
        },
        {
          label: "Tasks Assigned",
          data: projects.map((projectName) => {
            const project = userType === "department-manager"
              ? taskData.find((p) => p.name === projectName)
              : projectData.find((p) => p.name === projectName);
            return tasksToUse?.filter(
              (task) => task?.project_id === project?.id && task?.status === "ASSIGNED"
            ).length || 0;
          }),
          backgroundColor: chartColors.assigned,
          borderRadius: 6,
        },
      ],
    };
  }, [projectData, taskData, tasksToUse, userType, chartColors]);

  // Pie Chart Data
  const pieData = useMemo(() => ({
    labels: ["Completed", "In Progress", "Assigned", "In Review"],
    datasets: [
      {
        data: [taskStats.completed, taskStats.inProgress, taskStats.assigned, taskStats.inReview],
        backgroundColor: [
          chartColors.completed,
          chartColors.inProgress,
          chartColors.assigned,
          chartColors.inReview,
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  }), [taskStats, chartColors]);

  // Line Chart Data
  const lineData = useMemo(() => ({
    labels: projectsWithTasks?.map((project) => project?.name).filter(Boolean) || [],
    datasets: [
      {
        label: "Tasks Completed",
        data: projectsWithTasks?.map(
          (project) => project?.tasks?.filter((task) => task?.status === "COMPLETE")?.length || 0
        ),
        borderColor: chartColors.completed,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.completed,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "Tasks In Progress",
        data: projectsWithTasks?.map(
          (project) => project?.tasks?.filter((task) => task?.status === "IN_PROGRESS")?.length || 0
        ),
        borderColor: chartColors.inProgress,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.inProgress,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "Tasks Assigned",
        data: projectsWithTasks?.map(
          (project) => project?.tasks?.filter((task) => task?.status === "ASSIGNED")?.length || 0
        ),
        borderColor: chartColors.assigned,
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.assigned,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  }), [projectsWithTasks, chartColors]);

  // Dynamic Bar Chart Height
  const getBarChartHeight = useMemo(() => {
    const projectCount = projectTaskData.labels.length;
    const baseHeight = 300;
    const heightPerProject = 40;
    return Math.max(baseHeight, projectCount * heightPerProject);
  }, [projectTaskData.labels.length]);


  // Render skeleton for summary cards
  const renderSummarySkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl">
          <Skeleton height={20} width={100} />
          <Skeleton height={30} width={60} />
          <Skeleton height={15} width={80} />
        </div>
      ))}
    </div>
  );

  // Render skeleton for table
  const renderTableSkeleton = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-[70vh]">
      <table className="min-w-[800px] w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-teal-200">
          <tr>
            {[...Array(8)].map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton width={80} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              {[...Array(8)].map((_, j) => (
                <td key={j} className="px-4 py-2 border">
                  <Skeleton />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render skeleton for chart
  const renderChartSkeleton = () => (
    <div className="mb-6 bg-white border border-gray-200 rounded-xl">
      <div className="border-b border-gray-200 p-4">
        <Skeleton width={300} height={20} />
      </div>
      <div className="p-6">
        <Skeleton height={400} />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full h-[100vh] p-4 bg-gray-50 rounded-lg overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Project Dashboard</h1>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          {isLoading ? (
            renderSummarySkeleton()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Projects</p>
                    <h3 className="text-2xl font-bold text-gray-800">{projectStats.total}</h3>
                    <p className="text-xs text-gray-500">Completed: {projectStats.completed}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <LayoutGrid className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Projects</p>
                    <h3 className="text-2xl font-bold text-gray-800">{projectStats.active}</h3>
                    <p className="text-xs text-gray-500">On-Hold: {projectStats.onHold}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                    <h3 className="text-2xl font-bold text-gray-800">{taskStats.total}</h3>
                    <p className="text-xs text-gray-500">Completed: {taskStats.completed}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                    <h3 className="text-2xl font-bold text-gray-800">{taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-full">
                    <PieChart className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart Section */}
          {userType !== "department-manager" && (
            isLoading ? renderChartSkeleton() : (
              <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveChart("bar")}
                      className={`px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors ${activeChart === "bar" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Project Task Overview
                    </button>
                    <button
                      onClick={() => setActiveChart("pie")}
                      className={`px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors ${activeChart === "pie" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <PieChart className="w-4 h-4" />
                      Task Distribution
                    </button>
                    <button
                      onClick={() => setActiveChart("line")}
                      className={`px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors ${activeChart === "line" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <LineChart className="w-4 h-4" />
                      Task Trends
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-full" style={{ height: activeChart === "bar" ? `${getBarChartHeight}px` : "400px" }}>
                    {activeChart === "bar" && (
                      <Bar
                        data={projectTaskData}
                        options={{
                          indexAxis: "y",
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, font: { size: 12 } } },
                            tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 12, titleFont: { size: 14 }, bodyFont: { size: 13 }, cornerRadius: 8 },
                          },
                          scales: {
                            x: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" }, stacked: true },
                            y: {
                              grid: { display: false },
                              stacked: true,
                              ticks: {
                                callback: function (value) {
                                  const label = this.getLabelForValue(value);
                                  const maxLength = window.innerWidth < 768 ? 15 : 25;
                                  return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
                                },
                              },
                            },
                          },
                        }}
                      />
                    )}
                    {activeChart === "pie" && (
                      <Pie
                        data={pieData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: window.innerWidth < 768 ? "bottom" : "right", labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
                            tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 12, titleFont: { size: 14 }, bodyFont: { size: 13 }, cornerRadius: 8 },
                          },
                        }}
                      />
                    )}
                    {activeChart === "line" && (
                      <Line
                        data={lineData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, font: { size: 12 } } },
                            tooltip: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 12, titleFont: { size: 14 }, bodyFont: { size: 13 }, cornerRadius: 8 },
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: {
                                callback: function (value) {
                                  const label = this.getLabelForValue(value);
                                  const maxLength = window.innerWidth < 768 ? 8 : 15;
                                  return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
                                },
                                maxRotation: 45,
                                minRotation: 45,
                              },
                            },
                            y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" } },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          )}

        
          {/* Table */}
          {isLoading ? (
            renderTableSkeleton()
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-[70vh]">
              <AllProjects/>
            </div>
          )}

        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProjectDashboard;