/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "chart.js/auto";
import {
  Search,
  Building2,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Plus,
  Bell,
  Settings,
  X,
  TrendingUp,
  Activity,
  Briefcase,
} from "lucide-react";
import Service from "../../config/Service";

// Custom UI Components
const Button = ({ children, onClick, className = "", variant = "primary", size = "md", disabled = false, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 shadow-sm",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 shadow-sm",
  };
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", hover = false }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? "hover:shadow-md transition-shadow duration-200" : ""} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Progress = ({ value, max = 100, className = "", color = "blue" }) => {
  const percentage = Math.min(Math.max(0, value), max);
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div className={`h-full transition-all duration-300 ${colors[color]}`} style={{ width: `${percentage}%` }} />
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
            activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const projectData = useSelector((state) => state?.projectData?.projectData || []);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeChart, setActiveChart] = useState("bar");
  const [RFI, setRFI] = useState([]);
  const [count, setCount] = useState(0);
  const [noreplyRFI, setNoReplyRFI] = useState([]);
  const [submittals, setSubmittals] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const [noreplySubmittals, setNoreplySubmittals] = useState([]);
  const [itemType, setItemType] = useState("rfi");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch RFI and Submittals
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rfiResponse, submittalResponse] = await Promise.all([
          Service.inboxRFI(),
          Service.reciviedSubmittal(),
        ]);
        setRFI(rfiResponse?.data || []);
        setSubmittals(submittalResponse?.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process RFI and Submittals
  useEffect(() => {
    const pendingRFI = RFI.filter((rfi) => rfi?.rfiresponse === null);
    setCount(pendingRFI.length);
    setNoReplyRFI(pendingRFI);

    const pendingSubmittals = submittals.filter((sub) => sub?.submittalsResponse === null);
    setSubCount(pendingSubmittals.length);
    setNoreplySubmittals(pendingSubmittals);
  }, [RFI, submittals]);

  // Prepare project data with tasks
  const projectsWithTasks = useMemo(() =>
    projectData.map((project) => ({
      ...project,
      tasks: project.tasks || [],
    })), [projectData]);

  // Calculate task statistics
  const taskStats = useMemo(() => ({
    completed: projectsWithTasks.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "COMPLETE").length, 0),
    inProgress: projectsWithTasks.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "IN_PROGRESS").length, 0),
    assigned: projectsWithTasks.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "ASSIGNED").length, 0),
    inReview: projectsWithTasks.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "IN_REVIEW").length, 0),
    total: projectsWithTasks.reduce((acc, project) => acc + project.tasks.length, 0),
  }), [projectsWithTasks]);

  // Project statistics
  const projectStats = useMemo(() => ({
    total: projectData.length,
    active: projectData.filter((p) => p.status === "ACTIVE").length,
  }), [projectData]);

  // Chart colors
  const chartColors = useMemo(() => ({
    completed: { bg: "rgba(34,197,94,0.8)", border: "rgba(34,197,94,1)" },
    inProgress: { bg: "rgba(59,130,246,0.8)", border: "rgba(59,130,246,1)" },
    assigned: { bg: "rgba(168,85,247,0.8)", border: "rgba(168,85,247,1)" },
    inReview: { bg: "rgba(234,179,8,0.8)", border: "rgba(234,179,8,1)" },
  }), []);

  // Chart Data
  const barData = useMemo(() => ({
    labels: projectsWithTasks.map((project) => project?.name?.length > 25 ? `${project.name.substring(0, 25)}...` : project.name),
    datasets: [
      {
        label: "Completed",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "COMPLETE").length),
        backgroundColor: chartColors.completed.bg,
        borderColor: chartColors.completed.border,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "In Progress",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "IN_PROGRESS").length),
        backgroundColor: chartColors.inProgress.bg,
        borderColor: chartColors.inProgress.border,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Assigned",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "ASSIGNED").length),
        backgroundColor: chartColors.assigned.bg,
        borderColor: chartColors.assigned.border,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "In Review",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "IN_REVIEW").length),
        backgroundColor: chartColors.inReview.bg,
        borderColor: chartColors.inReview.border,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }), [projectsWithTasks, chartColors]);

  const pieData = useMemo(() => ({
    labels: ["Completed", "In Progress", "Assigned", "In Review"],
    datasets: [
      {
        data: [taskStats.completed, taskStats.inProgress, taskStats.assigned, taskStats.inReview],
        backgroundColor: [chartColors.completed.bg, chartColors.inProgress.bg, chartColors.assigned.bg, chartColors.inReview.bg],
        borderColor: [chartColors.completed.border, chartColors.inProgress.border, chartColors.assigned.border, chartColors.inReview.border],
        borderWidth: 2,
      },
    ],
  }), [taskStats, chartColors]);

  const lineData = useMemo(() => ({
    labels: projectsWithTasks.map((project) => project?.name?.length > 15 ? `${project.name.substring(0, 15)}...` : project.name),
    datasets: [
      {
        label: "Completed",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "COMPLETE").length),
        borderColor: chartColors.completed.border,
        backgroundColor: "rgba(34,197,94,0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.completed.bg,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "In Progress",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "IN_PROGRESS").length),
        borderColor: chartColors.inProgress.border,
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.inProgress.bg,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
      {
        label: "Assigned",
        data: projectsWithTasks.map((project) => project.tasks.filter((t) => t.status === "ASSIGNED").length),
        borderColor: chartColors.assigned.border,
        backgroundColor: "rgba(168,85,247,0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: chartColors.assigned.bg,
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  }), [projectsWithTasks, chartColors]);

  // Dynamic Bar Chart Height
  const getBarChartHeight = useMemo(() => {
    const projectCount = barData.labels.length;
    const baseHeight = 300;
    const heightPerProject = 40;
    return Math.max(baseHeight, projectCount * heightPerProject);
  }, [barData.labels.length]);

  // Filter and Sort Projects
  const filterAndSortProjects = useCallback(() => {
    let filtered = [...projectsWithTasks];
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "fabricator") {
        aValue = a.fabricator?.fabName || "";
        bValue = b.fabricator?.fabName || "";
      }
      aValue = typeof aValue === "string" ? aValue.toLowerCase() : aValue ?? "";
      bValue = typeof bValue === "string" ? bValue.toLowerCase() : bValue ?? "";
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });
    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, sortField, sortDirection, projectsWithTasks]);

  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

  // Handlers
  const handleViewClick = useCallback((projectId) => {
    const project = projectData.find((p) => p.id === projectId);
    setSelectedProject(project);
    setIsModalOpen(true);
  }, [projectData]);

  const handleModalClose = useCallback(() => {
    setSelectedProject(null);
    setIsModalOpen(false);
  }, []);

  const handleSearch = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleStatusFilter = useCallback((e) => setStatusFilter(e.target.value), []);
  const gotoAddRFQ = useCallback(() => navigate("../rfq/add-rfq"), [navigate]);

  // Status Badge Component
  const StatusBadge = useCallback(({ status }) => {
    const statusConfig = {
      ACTIVE: { variant: "info", icon: <Activity className="w-3.5 h-3.5 mr-1" /> },
      IN_PROGRESS: { variant: "warning", icon: <Clock className="w-3.5 h-3.5 mr-1" /> },
      COMPLETE: { variant: "success", icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> },
      ASSIGNED: { variant: "purple", icon: <Users className="w-3.5 h-3.5 mr-1" /> },
      IN_REVIEW: { variant: "warning", icon: <AlertCircle className="w-3.5 h-3.5 mr-1" /> },
      ON_HOLD: { variant: "danger", icon: <Clock className="w-3.5 h-3.5 mr-1" /> },
    };
    const config = statusConfig[status] || { variant: "default", icon: null };
    return (
      <Badge variant={config.variant}>
        {config.icon}
        {status?.replace("_", " ") || "Unknown"}
      </Badge>
    );
  }, []);

  // Stat Card Component
  const StatCard = useCallback(({ title, value, subtitle, icon, trend, color, progress }) => (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${color} mr-4`}>{icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} color="blue" />
            </div>
          )}
        </div>
      </div>
    </Card>
  ), []);

  // Skeleton Renderers
  const renderStatCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton height={20} width={100} />
          <Skeleton height={30} width={60} />
          <Skeleton height={15} width={120} />
          <Skeleton height={8} width="100%" className="mt-3" />
        </Card>
      ))}
    </div>
  );

  const renderChartSkeleton = () => (
    <Card className="p-6">
      <Skeleton height={20} width={200} />
      <Skeleton height={15} width={150} className="mt-2" />
      <Skeleton height={400} className="mt-6" />
    </Card>
  );

  const renderActionCenterSkeleton = () => (
    <Card className="p-6">
      <Skeleton height={20} width={150} />
      <Skeleton height={20} width={100} className="mt-4" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border border-gray-200 rounded-lg mt-3">
          <Skeleton height={15} width="80%" />
          <Skeleton height={12} width="60%" className="mt-2" />
          <Skeleton height={12} width="40%" className="mt-2" />
        </div>
      ))}
    </Card>
  );

  const renderQuickActionsSkeleton = () => (
    <Card className="p-6">
      <Skeleton height={20} width={150} />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} height={40} className="mt-3" />
      ))}
    </Card>
  );

  const renderRecentActivitySkeleton = () => (
    <Card className="p-6">
      <Skeleton height={20} width={150} />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 mt-4">
          <Skeleton circle width={32} height={32} />
          <div className="flex-1">
            <Skeleton height={15} width="70%" />
            <Skeleton height={12} width="50%" className="mt-2" />
          </div>
        </div>
      ))}
    </Card>
  );

  const renderProjectsSkeleton = () => (
    <Card className="p-6">
      <Skeleton height={20} width={200} />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 mt-4">
          <Skeleton width={50} height={50} />
          <div className="flex-1">
            <Skeleton height={15} width="80%" />
            <Skeleton height={12} width="60%" className="mt-2" />
          </div>
        </div>
      ))}
    </Card>
  );

  if (error) {
    return (
      <div className="w-full h-[89vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full h-[89vh] overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {(count + subCount) > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {count + subCount}
                      </span>
                    )}
                  </button>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <Button onClick={gotoAddRFQ} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create RFQ
                </Button>
                <Button variant="success" className="hidden md:flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8 max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search projects" value={searchTerm} onChange={handleSearch} className="pl-10" />
            </div>
            <Select value={statusFilter} onChange={handleStatusFilter} className="flex-1">
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Completed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="ON_HOLD">On Hold</option>
            </Select>
          </div>

          {/* Key Metrics */}
          {isLoading ? renderStatCardSkeleton() : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Projects"
                value={projectStats.total}
                subtitle={`${projectStats.active} active projects`}
                icon={<Building2 className="w-6 h-6 text-blue-600" />}
                trend="+12% from last month"
                color="bg-blue-100"
                progress={projectStats.total > 0 ? (projectStats.active / projectStats.total) * 100 : 0}
              />
              <StatCard
                title="Completed Tasks"
                value={taskStats.completed}
                subtitle={`${taskStats.total} total tasks`}
                icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                trend="+8% from last week"
                color="bg-green-100"
                progress={taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}
              />
              <StatCard
                title="In Progress"
                value={taskStats.inProgress}
                subtitle={`${taskStats.assigned} assigned tasks`}
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                color="bg-yellow-100"
                progress={taskStats.inProgress + taskStats.assigned > 0 ? (taskStats.inProgress / (taskStats.inProgress + taskStats.assigned)) * 100 : 0}
              />
              <StatCard
                title="Pending Actions"
                value={count + subCount}
                subtitle={`${count} RFI, ${subCount} Submittals`}
                icon={<AlertCircle className="w-6 h-6 text-purple-600" />}
                color="bg-purple-100"
                progress={count + subCount > 0 ? (count / (count + subCount)) * 100 : 0}
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chart Section */}
              {isLoading ? renderChartSkeleton() : (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Project Analytics</h2>
                      <p className="text-sm text-gray-600">Task completion across projects</p>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setActiveChart("bar")}
                        className={`p-2 rounded-md transition-colors ${activeChart === "bar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveChart("pie")}
                        className={`p-2 rounded-md transition-colors ${activeChart === "pie" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
                      >
                        <PieChart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveChart("line")}
                        className={`p-2 rounded-md transition-colors ${activeChart === "line" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
                      >
                        <LineChart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full" style={{ height: activeChart === "bar" ? `${getBarChartHeight}px` : "400px" }}>
                    {activeChart === "bar" && (
                      <Bar
                        data={barData}
                        options={{
                          indexAxis: "y",
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, font: { size: 12 }, padding: 20 } },
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
                            legend: { position: window.innerWidth < 768 ? "bottom" : "right", labels: { usePointStyle: true, padding: window.innerWidth < 768 ? 10 : 20, font: { size: 12 } } },
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
                            legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6, font: { size: 12 }, padding: 20 } },
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
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-600">Completed ({taskStats.completed})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600">In Progress ({taskStats.inProgress})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm text-gray-600">Assigned ({taskStats.assigned})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm text-gray-600">In Review ({taskStats.inReview})</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Projects Section */}
              {isLoading ? renderProjectsSkeleton() : (
                <Card className="p-1">
                  {/* <ClientAllProjects onViewClick={handleViewClick} /> */}
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Center */}
              {isLoading ? renderActionCenterSkeleton() : (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Action Center</h2>
                  <Tabs
                    tabs={[
                      { id: "rfi", label: `RFI (${count})` },
                      { id: "submittals", label: `Submittals (${subCount})` },
                    ]}
                    activeTab={itemType}
                    onChange={setItemType}
                    className="mb-4"
                  />
                  <div className="space-y-3">
                    {itemType === "rfi" ? (
                      noreplyRFI.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No pending RFI responses</p>
                        </div>
                      ) : (
                        noreplyRFI.map((rfi, index) => (
                          <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{rfi?.subject || "No Subject"}</h3>
                                <p className="text-xs text-gray-500 mt-1">{rfi?.description || "No description provided"}</p>
                              </div>
                              <Badge variant="warning">Pending</Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-500">
                                {rfi?.createdAt ? new Date(rfi.createdAt).toLocaleDateString() : "No date"}
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : noreplySubmittals.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No pending submittals</p>
                      </div>
                    ) : (
                      noreplySubmittals.map((sub, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{sub?.subject || "No Subject"}</h3>
                              <p className="text-xs text-gray-500 mt-1">{sub?.description || "No description provided"}</p>
                            </div>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-xs text-gray-500">
                              {sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "No date"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}

              {/* Quick Actions */}
              {isLoading ? renderQuickActionsSkeleton() : (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button onClick={gotoAddRFQ} className="w-full justify-center py-3" variant="primary">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Create New RFQ
                    </Button>
                    <Button className="w-full justify-center py-3" variant="success">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button className="w-full justify-center py-3" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </Card>
              )}

              {/* Recent Activity */}
              {isLoading ? renderRecentActivitySkeleton() : (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {projectData.slice(0, 3).map((project, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                            {project.status === "ACTIVE" ? (
                              <Activity className="w-4 h-4" />
                            ) : project.status === "COMPLETE" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{project.name || "Unnamed Project"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={project.status} />
                            <span className="text-xs text-gray-500">{project.completion || 0}% complete</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Activity</button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* Project Detail Modal */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedProject?.name || "Project Details"} size="lg">
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Project Information</h4>
                  <div className="space-y-3">
                    <div>
                      <StatusBadge status={selectedProject.status} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{selectedProject.description || "No description available"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">{selectedProject.location || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contractor</p>
                        <p className="text-sm font-medium">{selectedProject.fabricator?.fabName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium">{selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium">{selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Progress Overview</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Overall Progress</span>
                        <span className="text-sm font-medium">{selectedProject.completion || 0}%</span>
                      </div>
                      <Progress value={selectedProject.completion || 0} color="blue" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-lg font-semibold">{selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : "N/A"}</p>
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
    </SkeletonTheme>
  );
};

export default ClientDashboard;