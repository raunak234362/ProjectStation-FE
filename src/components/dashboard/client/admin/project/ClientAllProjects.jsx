/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, GetProject } from "../../../../index.js";
import Service from "../../../../../config/Service.js";
import ViewDetails from "./ViewDetails.jsx";
import { showProjects } from "../../../../../store/projectSlice.js";
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  LayoutGrid,
  ListFilter,
  Loader2,
  MapPin,
  PauseCircle,
  Search,
  Users,
  View,
} from "lucide-react";

const ClientAllProjects = () => {
  const projects = useSelector((state) => state?.projectData?.projectData);
  const taskData = useSelector((state) => state.taskData.taskData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fabricatorFilter, setFabricatorFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const fetchproject = async () => {
    const response = await Service.allprojects(token);
    dispatch(showProjects(response?.data));
  };
  useEffect(() => {
    fetchproject();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFabricatorFilter = (e) => {
    setFabricatorFilter(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredProjects = sortedProjects?.filter((project) => {
    return (
      project?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || project?.status === statusFilter) &&
      (fabricatorFilter === "" || project?.fabricator === fabricatorFilter)
    );
  });

  const handleViewClick = async (projectID) => {
    setSelectedProject(projectID);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-blue-100 text-blue-800",
        icon: <Loader2 className="w-4 h-4 mr-1" />,
      },
      IN_PROGRESS: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4 mr-1" />,
      },
      COMPLETE: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
      },
      ASSIGNED: {
        color: "bg-purple-100 text-purple-800",
        icon: <Users className="w-4 h-4 mr-1" />,
      },
      IN_REVIEW: {
        color: "bg-orange-100 text-orange-800",
        icon: <AlertCircle className="w-4 h-4 mr-1" />,
      },
      ON_HOLD: {
        color: "bg-red-100 text-red-800",
        icon: <PauseCircle className="w-4 h-4 mr-1" />,
      },
    };
  };

  // console.log("Filtered Projects:", filteredProjects);
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="mb-4 text-lg font-medium text-gray-900 sm:mb-0">
            Projects
          </h2>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="py-2 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                {/* <select
                  className="py-2 pl-3 pr-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={fabricatorFilter}
                  onChange={(e) => setFabricatorFilter(e.target.value)}
                >
                  <option value="all">All Contractors</option>
                  {fabricators.map((fab, index) => (
                    <option key={index} value={fab}>
                      {fab}
                    </option>
                  ))}
                </select> */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`p-2 rounded-md ${viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
                onClick={() => setViewMode("list")}
              >
                <ListFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="p-6">
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No projects found matching your criteria.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const projectTasks = taskData.filter(
                (task) => task.project_id === project.id
              );
              const completedTaskCount = projectTasks.filter(
                (task) => task.status === "COMPLETE"
              ).length;
              const totalTaskCount = projectTasks.length;
              const completionPercentage =
                totalTaskCount > 0
                  ? Math.round((completedTaskCount / totalTaskCount) * 100)
                  : 0;
              // Calculate completed tasks for the projecT
              const completedTasks = project?.tasks?.filter(
                (task) => task?.status === "COMPLETE"
              )?.length;

              // console.log("Filtered Projects:", completedTasks);

              return (
                <div
                  key={project.id}
                  className="overflow-hidden bg-white border rounded-lg shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="mb-1 text-lg font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="mb-4 text-sm text-gray-500">
                      {project.description}
                    </p>
                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">Progress</span>
                        <span>
                          {project?.tasks?.length === 0 || !project?.tasks
                            ? "Not started"
                            : `${((completedTasks / project?.tasks?.length) * 100).toFixed(2)}%`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-600 rounded-full"
                          style={{
                            width:
                              project?.tasks?.length === 0 || !project?.tasks
                                ? "0%"
                                : `${((completedTasks / project?.tasks?.length) * 100).toFixed(2)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                      <div>
                        <span className="font-medium">Budget:</span>
                        <span className="ml-1">
                          ${project.budget?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tasks:</span>
                        <span className="ml-1">
                          {completedTasks}/{project?.tasks?.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">Start:</span>
                        <span className="ml-1">
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">End:</span>
                        <span className="ml-1">
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between px-6 py-3 bg-gray-50">
                    <div className="text-sm text-gray-500">
                      <Building2 className="inline w-4 h-4 mr-1" />
                      {project.fabricator.fabName}
                    </div>
                    <button
                      onClick={() => handleViewClick(project.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => {
                      if (sortField === "name") {
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        );
                      } else {
                        setSortField("name");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    <div className="flex items-center">
                      Project Name
                      {sortField === "name" && (
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    onClick={() => {
                      if (sortField === "fabricator") {
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        );
                      } else {
                        setSortField("fabricator");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    <div className="flex items-center">
                      Contractor
                      {sortField === "fabricator" && (
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Progress
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Timeline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Budget
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const projectTasks = taskData.filter(
                    (task) => task.project_id === project.id
                  );
                  const completedTaskCount = projectTasks.filter(
                    (task) => task.status === "COMPLETE"
                  ).length;
                  const totalTaskCount = projectTasks.length;
                  const completionPercentage =
                    totalTaskCount > 0
                      ? Math.round((completedTaskCount / totalTaskCount) * 100)
                      : 0;

                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.fabricator.fabName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full h-2 mr-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {completionPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(project.startDate).toLocaleDateString()} -{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${project.budget?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => handleViewClick(project.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <ViewDetails data={selectedProject} onClose={handleModalClose} token={token} />
      )}
    </div>
  );
};

export default ClientAllProjects;
