/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Plus,
  X,
  TrendingUp,
  Activity,
  Briefcase,
  Bell,
  Settings,
  ArrowRight,
} from "lucide-react";
import "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import Service from "../../config/Service";
import ActionCenter from "./ActionCenter";
import ClientAllProjects from "../project/ClientAllProjects";

// UI Component Styles
const buttonStyles = {
  base: "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  variants: {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  },
  sizes: {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  },
};

const badgeStyles = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
};

const progressColors = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  yellow: "bg-yellow-600",
  purple: "bg-purple-600",
};

const modalSizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

// UI Components
const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) => (
  <button
    className={`${buttonStyles.base} ${buttonStyles.variants[variant]} ${buttonStyles.sizes[size]} ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
      hover ? "hover:shadow-md transition-shadow duration-200" : ""
    } ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles[variant]} ${className}`}
  >
    {children}
  </span>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors ${className}`}
    {...props}
  />
);

const Progress = ({ value, max = 100, className = "", color = "blue" }) => {
  const percentage = Math.min(Math.max(0, value), max);
  return (
    <div
      className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}
    >
      <div
        className={`h-full transition-all duration-300 ${progressColors[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => (
  <div className={`border-b border-gray-200 ${className}`}>
    <nav className="flex -mb-px space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${modalSizes[size]} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    ACTIVE: {
      variant: "info",
      icon: <Activity className="w-3.5 h-3.5 mr-1" />,
    },
    IN_PROGRESS: {
      variant: "warning",
      icon: <Clock className="w-3.5 h-3.5 mr-1" />,
    },
    COMPLETE: {
      variant: "success",
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    },
    ASSIGNED: {
      variant: "purple",
      icon: <Briefcase className="w-3.5 h-3.5 mr-1" />,
    },
    IN_REVIEW: {
      variant: "warning",
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    },
  };

  const { variant, icon } = statusConfig[status] || {
    variant: "default",
    icon: null,
  };
  return (
    <Badge variant={variant}>
      {icon}
      {status.replace("_", " ")}
    </Badge>
  );
};

const StatCard = ({
  title,
  value,
  subtitle,
  suptitle,
  icon,
  trend,
  color,
  progress,
}) => (
  <Card hover className="p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color} mr-4`}>{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {subtitle && <p className="text-md text-gray-500 mt-2">{subtitle}</p>}
        {suptitle && <p className="text-md text-gray-500 mt-1">{suptitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">{trend}</span>
          </div>
        )}
        {progress !== undefined && (
          <Progress value={progress} color="blue" className="mt-3" />
        )}
      </div>
    </div>
  </Card>
);

// Chart Configuration
const chartColors = {
  completed: { bg: "rgba(34,197,94,0.8)", border: "rgba(34,197,94,1)" },
  inProgress: { bg: "rgba(59,130,246,0.8)", border: "rgba(59,130,246,1)" },
  assigned: { bg: "rgba(168,85,247,0.8)", border: "rgba(168,85,247,1)" },
  inReview: { bg: "rgba(234,179,8,0.8)", border: "rgba(234,179,8,1)" },
};

const getChartOptions = (type, labels) => ({
  indexAxis: type === "bar" ? "y" : undefined,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position:
        type === "pie" && window.innerWidth < 768
          ? "bottom"
          : type === "pie"
          ? "right"
          : "top",
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        font: { size: 12 },
        padding: type === "pie" && window.innerWidth < 768 ? 10 : 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      cornerRadius: 8,
    },
  },
  scales:
    type === "bar"
      ? {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            stacked: true,
          },
          y: {
            grid: { display: false },
            stacked: true,
            ticks: {
              callback: (value) => {
                const label = labels[value];
                const maxLength = window.innerWidth < 768 ? 15 : 25;
                return label?.length > maxLength
                  ? `${label.substring(0, maxLength)}...`
                  : label;
              },
            },
          },
        }
      : undefined,
});

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const projectData =
    useSelector((state) => state?.projectData?.projectData) || [];
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all",
    sortField: "name",
    sortDirection: "asc",
  });
  const [modal, setModal] = useState({ isOpen: false, selectedProject: null });
  const [chartType, setChartType] = useState("bar");
  const [actionTab, setActionTab] = useState("rfi");
  const [rfiData, setRfiData] = useState({ items: [], pending: [], count: 0 });
  const [submittalData, setSubmittalData] = useState({
    items: [],
    pending: [],
    count: 0,
  });

  // Fetch RFI and Submittals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rfiResponse, submittalResponse] = await Promise.all([
          Service.inboxRFI().catch(() => ({ data: [] })),
          Service.reciviedSubmittal().catch(() => ({ data: [] })),
        ]);
        setRfiData((prev) => ({ ...prev, items: rfiResponse.data || [] }));
        setSubmittalData((prev) => ({
          ...prev,
          items: submittalResponse.data || [],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setRfiData((prev) => {
      const pending = prev.items.filter((rfi) => !rfi?.rfiresponse);
      return { ...prev, pending, count: pending.length };
    });
    setSubmittalData((prev) => {
      const pending = prev.items.filter((sub) => !sub?.submittalsResponse);
      return { ...prev, pending, count: pending.length };
    });
  }, [rfiData.items, submittalData.items]);

  // Prepare project data
  const projectsWithTasks = useMemo(
    () =>
      projectData.map((project) => ({
        ...project,
        tasks: project.tasks || [],
      })),
    [projectData]
  );

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projectsWithTasks];
    const { searchTerm, status, sortField, sortDirection } = filters;

    if (status !== "all") {
      result = result.filter((project) => project.status === status);
    }
    if (searchTerm) {
      result = result.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      const aValue =
        sortField === "fabricator"
          ? a.fabricator?.fabName || ""
          : a[sortField] || "";
      const bValue =
        sortField === "fabricator"
          ? b.fabricator?.fabName || ""
          : b[sortField] || "";
      const comparison =
        typeof aValue === "string"
          ? aValue.localeCompare(bValue)
          : aValue - bValue;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [projectsWithTasks, filters]);

  // Task statistics
  const taskStats = useMemo(() => {
    const stats = {
      completed: 0,
      inProgress: 0,
      onHold: 0,
      assigned: 0,
      inReview: 0,
      total: 0,
    };
    projectsWithTasks.forEach((project) => {
      project.tasks.forEach((task) => {
        stats[task.status.toLowerCase()] =
          (stats[task.status.toLowerCase()] || 0) + 1;
        stats.total += 1;
      });
    });
    return stats;
  }, [projectsWithTasks]);

  // Chart data
  const chartData = useMemo(() => {
    const labels = projectsWithTasks.map((p) =>
      p.name?.length > 25 ? `${p.name.substring(0, 25)}...` : p.name
    );
    const datasets = [
      {
        label: "Completed",
        data: projectsWithTasks.map(
          (p) => p.tasks.filter((t) => t.status === "COMPLETE").length
        ),
        ...chartColors.completed,
      },
      {
        label: "In Progress",
        data: projectsWithTasks.map(
          (p) => p.tasks.filter((t) => t.status === "IN_PROGRESS").length
        ),
        ...chartColors.inProgress,
      },
      {
        label: "Assigned",
        data: projectsWithTasks.map(
          (p) => p.tasks.filter((t) => t.status === "ASSIGNED").length
        ),
        ...chartColors.assigned,
      },
      {
        label: "In Review",
        data: projectsWithTasks.map(
          (p) => p.tasks.filter((t) => t.status === "IN_REVIEW").length
        ),
        ...chartColors.inReview,
      },
    ].map((set) => ({ ...set, borderWidth: 1, borderRadius: 4 }));

    return {
      bar: { labels, datasets },
      pie: {
        labels: ["Completed", "In Progress", "Assigned", "In Review"],
        datasets: [
          {
            data: [
              taskStats.completed,
              taskStats.inProgress,
              taskStats.assigned,
              taskStats.inReview,
            ],
            backgroundColor: Object.values(chartColors).map((c) => c.bg),
            borderColor: Object.values(chartColors).map((c) => c.border),
            borderWidth: 2,
          },
        ],
      },
    };
  }, [projectsWithTasks, taskStats]);

  // Handlers
  const handleViewClick = (projectId) => {
    const project = projectData.find((p) => p.id === projectId);
    setModal({ isOpen: true, selectedProject: project });
  };

  const handleModalClose = () =>
    setModal({ isOpen: false, selectedProject: null });

  return (
    <div className="w-full h-[100vh] overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  {rfiData.count + submittalData.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {rfiData.count + submittalData.count}
                    </span>
                  )}
                </button>
              </div>
              {/* <Button
                onClick={() => navigate("../rfq/add-rfq")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create RFQ
              </Button>
              <Button variant="success" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </Button> */}
              {/* <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 mx-5">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
              title="Total Projects"
              value={projectData.length}
              subtitle={`${
                projectData.filter((p) => p.status === "COMPLETE").length
              } Completed projects`}
              suptitle={`${
                projectData.filter((p) => p.status === "ONHOLD").length
              } On Hold projects`}
              icon={<Building2 className="w-4 h-4 text-blue-600" />}
              color="bg-blue-50"
              progress={
                projectData.length > 0
                  ? (projectData.filter((p) => p.status === "COMPLETE").length /
                      projectData.length) *
                    100
                  : 0
              }
            />
           
            <StatCard
              title="Pending Actions"
              value={rfiData.count + submittalData.count}
              subtitle={`${rfiData.count} RFI, ${submittalData.count} Submittals`}
              icon={<AlertCircle className="w-4 h-4 text-purple-600" />}
              color="bg-purple-50"
              progress={
                rfiData.count + submittalData.count > 0
                  ? (rfiData.count / (rfiData.count + submittalData.count)) *
                    100
                  : 0
              }
            />
          </div>
          {/* Recent Activity */}
          <div>
            <Card className="p-3">
              <h2 className="text-md font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {projectData.slice(0, 3).map((project, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                        {project.status === "ACTIVE" ? (
                          <Activity className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={project.status} />
                        <span className="text-xs text-gray-500">
                          {project.completion || 0}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="mt-4 text-center">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View All Activity
                </button>
              </div> */}
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            {/* <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Project Analytics
                  </h2>
                  <p className="text-sm text-gray-600">
                    Task completion across projects
                  </p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                  {["bar", "pie"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`p-2 rounded-md transition-colors ${
                        chartType === type
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type === "bar" ? (
                        <BarChart3 className="w-5 h-5" />
                      ) : (
                        <PieChart className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="w-full"
                style={{
                  height:
                    chartType === "bar"
                      ? `${Math.max(300, chartData.bar.labels.length * 40)}px`
                      : "400px",
                }}
              >
                {chartType === "bar" && (
                  <Bar
                    data={chartData.bar}
                    options={getChartOptions("bar", chartData.bar.labels)}
                  />
                )}
                {chartType === "pie" && (
                  <Pie
                    data={chartData.pie}
                    options={getChartOptions("pie", chartData.pie.labels)}
                  />
                )}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                {Object.entries(chartColors).map(([key, { bg }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${bg}`}></div>
                    <span className="text-sm text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)} (
                      {taskStats[key]})
                    </span>
                  </div>
                ))}
              </div>
            </Card> */}

            {/* Projects Section */}
            <Card className="p-1">
              <ClientAllProjects onViewClick={handleViewClick} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Center */}
            <Card className="p-6">
              <ActionCenter />
            </Card>

            {/* Quick Actions */}
            {/* <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("rfq")}
                  className="w-full justify-center py-3"
                  variant="primary"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Create New RFQ
                </Button>
                <Button
                  className="w-full justify-center py-3"
                  variant="success"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button
                  className="w-full justify-center py-3"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card> */}
          </div>
        </div>
      </main>

      {/* Project Detail Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        title={modal.selectedProject?.name || "Project Details"}
        size="lg"
      >
        {modal.selectedProject && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Project Information
                </h4>
                <div className="space-y-3">
                  <StatusBadge status={modal.selectedProject.status} />
                  <p className="text-sm text-gray-600">
                    {modal.selectedProject.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium">
                        {modal.selectedProject.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contractor</p>
                      <p className="text-sm font-medium">
                        {modal.selectedProject.fabricator?.fabName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium">
                        {new Date(
                          modal.selectedProject.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-medium">
                        {new Date(
                          modal.selectedProject.endDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Progress Overview
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">
                        {modal.selectedProject.completion || 0}%
                      </span>
                    </div>
                    <Progress
                      value={modal.selectedProject.completion || 0}
                      color="blue"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-lg font-semibold">
                      ${modal.selectedProject.budget?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary">Generate Report</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
