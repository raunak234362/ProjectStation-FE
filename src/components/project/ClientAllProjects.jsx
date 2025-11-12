/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  List,
  Loader2,
  PauseCircle,
  Search,
  Users,
} from "lucide-react";
import Service from "../../config/Service";
import { showProjects } from "../../store/projectSlice";

import { useTable, useSortBy } from "react-table";
import ClientProjectStatus from "./clientProjectTab/ClientProjectStatus";

// Format currency
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ClientAllProjects = () => {
  const projects =
    useSelector((state) => state?.projectData?.projectData) || [];
  const taskData = useSelector((state) => state?.taskData?.taskData) || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("name-asc");

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : "";
  const dispatch = useDispatch();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await Service.allprojects(token);
      dispatch(showProjects(response?.data));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  // Status configuration
  const statusConfig = {
    ACTIVE: {
      color: "bg-blue-100 text-blue-800",
      icon: <Loader2 className="w-4 h-4 mr-1" />,
      label: "Active",
    },
    COMPLETE: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
      label: "Complete",
    },
    ASSIGNED: {
      color: "bg-purple-100 text-purple-800",
      icon: <Users className="w-4 h-4 mr-1" />,
      label: "Assigned",
    },
    IN_REVIEW: {
      color: "bg-orange-100 text-orange-800",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      label: "In Review",
    },
    ONHOLD: {
      color: "bg-red-100 text-red-800",
      icon: <PauseCircle className="w-4 h-4 mr-1" />,
      label: "On Hold",
    },
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Calculate progress
  const calculateProjectProgress = (project) => {
    if (project?.tasks && Array.isArray(project.tasks)) {
      const completedStatuses = [
        "COMPLETE",
        "VALIDATE_COMPLETE",
        "COMPLETE_OTHER",
      ];
      const completedTasks = project.tasks.filter((task) =>
        completedStatuses.includes(task?.status)
      ).length;

      const totalTasks = project.tasks.length;
      return {
        completedTasks,
        totalTasks,
        percentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    }

    const projectTasks = taskData.filter(
      (task) => task.project_id === project.id
    );
    const completedTasks = projectTasks.filter(
      (task) => task.status === "COMPLETE"
    ).length;
    const totalTasks = projectTasks.length;

    return {
      completedTasks,
      totalTasks,
      percentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  };

  const enhancedProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      progress: calculateProjectProgress(project),
    }));
  }, [projects, taskData]);

  // ✅ Filtering + Sorting applied to GRID & TABLE
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = enhancedProjects.filter((project) => {
      const matchesSearch =
        project?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        project?.description?.toLowerCase()?.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // ✅ Sorting logic
    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "start-asc":
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      case "start-desc":
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case "end-asc":
        filtered.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
        break;
      case "end-desc":
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        break;
      case "budget-asc":
        filtered.sort((a, b) => a.budget - b.budget);
        break;
      case "budget-desc":
        filtered.sort((a, b) => b.budget - a.budget);
        break;
      default:
        break;
    }

    return filtered;
  }, [enhancedProjects, searchTerm, statusFilter, sortOption]);

  // Progress bar
  const ProgressBar = ({ percentage, showLabel = true }) => {
    const getColor = (percent) => {
      if (percent >= 80) return "bg-green-500";
      if (percent >= 60) return "bg-blue-500";
      if (percent >= 40) return "bg-yellow-500";
      return "bg-red-500";
    };
    return (
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
          <div
            className={`h-2 rounded-full ${getColor(
              percentage
            )} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-sm text-gray-500 min-w-[40px]">
            {percentage}%
          </span>
        )}
      </div>
    );
  };

  // ✅ React Table
  const columns = useMemo(
    () => [
      {
        Header: "Project Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.original.name}
            </div>
            <div className="text-sm text-gray-500">{row.original.location}</div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => <StatusBadge status={value} />,
      },
      {
        Header: "Contractor",
        accessor: "fabricator",
        Cell: ({ value }) => value?.fabName,
        sortType: (a, b) => {
          const aName = a.original.fabricator?.fabName || "";
          const bName = b.original.fabricator?.fabName || "";
          return aName.localeCompare(bName);
        },
      },
      {
        Header: "Progress",
        accessor: (row) => row.progress?.percentage,
        id: "progressPercentage",
        Cell: ({ row }) => (
          <ProgressBar percentage={row.original.progress?.percentage} />
        ),
        sortType: (a, b) =>
          (a.original.progress?.percentage || 0) -
          (b.original.progress?.percentage || 0),
      },

      // ✅ SORTABLE START DATE
      {
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ value }) => formatDate(value),
        sortType: (a, b) =>
          new Date(a.original.startDate) - new Date(b.original.startDate),
      },

      // ✅ SORTABLE END DATE
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ value }) => formatDate(value),
        sortType: (a, b) =>
          new Date(a.original.endDate) - new Date(b.original.endDate),
      },

      {
        Header: "Budget",
        accessor: "budget",
        Cell: ({ value }) => formatCurrency(value),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: filteredAndSortedProjects,
        initialState: {
          sortBy: [{ id: "name", desc: false }],
        },
        disableSortRemove: true,
      },
      useSortBy
    );

  const handleRowClick = (projectId) => setSelectedProject(projectId);
  const handleClose = () => setSelectedProject(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-fit overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 px-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETE">Completed</option>
                <option value="ONHOLD">On Hold</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* ✅ Sort Dropdown */}
            <div className="relative">
              <select
                className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="start-asc">Start Date (Newest)</option>
                <option value="start-desc">Start Date (Oldest)</option>
                <option value="end-asc">End Date (Newest)</option>
                <option value="end-desc">End Date (Oldest)</option>
                <option value="budget-asc">Budget (Low → High)</option>
                <option value="budget-desc">Budget (High → Low)</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* View Toggle */}
            <button
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            <button
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-3 h-[75vh] overflow-y-auto">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-gray-500">
              Try changing search or filter criteria.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAndSortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className="cursor-pointer bg-white border rounded-lg shadow-sm hover:shadow-md transition p-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>

                {/* Progress */}
                <div className="mt-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress.percentage}%</span>
                  </div>
                  <ProgressBar
                    percentage={project.progress.percentage}
                    showLabel={false}
                  />
                </div>

                <div className="text-sm">
                  <div>
                    <span className="font-medium">Budget:</span>{" "}
                    {formatCurrency(project.budget)}
                  </div>
                  <div>
                    <span className="font-medium">Start:</span>{" "}
                    {formatDate(project.startDate)}
                  </div>
                  <div>
                    <span className="font-medium">End:</span>{" "}
                    {formatDate(project.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table
              {...getTableProps()}
              className="min-w-[800px] w-full border-collapse text-sm"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup, i) => (
                  <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        key={idx}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowUpDown className="w-4 h-4 ml-1 rotate-180" />
                            ) : (
                              <ArrowUpDown className="w-4 h-4 ml-1" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4 ml-1 opacity-30" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={row.original.id}
                      {...row.getRowProps()}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(row.original.id)}
                    >
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProject && (
        <ClientProjectStatus
          projectId={selectedProject}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ClientAllProjects;
