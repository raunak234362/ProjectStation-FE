"use client"

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import Service from "../../../../../config/Service"
import Button from "../../../../fields/Button"
import { Calendar, CheckCircle, ChevronDown, Clock, FileText, Filter, Loader2, PieChart, Target, X } from "lucide-react"

const EmployeeStatus = ({ employee, onClose }) => {
  console.log(" EmployeeStatus", employee)
  const [employeeStatus, setEmployeeStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState(null)
  const [dateFilter, setDateFilter] = useState({
    type: "all", // all, month, year
    month: new Date().getMonth(), // 0-11
    year: new Date().getFullYear(),
  })
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const fetchEmployeeStatus = async () => {
    try {
      setLoading(true)
      const response = await Service.getUsersStats(employee)
      setEmployeeStatus(response.data)
      setFilteredData(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching employee stats:", error)
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to the data
  const applyFilters = () => {
    if (!employeeStatus) return

    // Create a deep copy of the employee status
    const filteredStatus = JSON.parse(JSON.stringify(employeeStatus))

    if (dateFilter.type === "all") {
      setFilteredData(filteredStatus)
      return
    }

    // Filter tasks based on date
    filteredStatus.tasks = employeeStatus.tasks.filter((task) => {
      if (!task.start_date) return false;

      const taskDate = new Date(task.start_date);

      if (dateFilter.type === "month") {
        return taskDate.getMonth() === dateFilter.month && taskDate.getFullYear() === dateFilter.year;
      }

      if (dateFilter.type === "year") {
        return taskDate.getFullYear() === dateFilter.year;
      }

      return true;
    });

    console.log(filteredStatus.tasks, "filteredStatus.tasks");

    // Filter working hours based on date from tasks
    filteredStatus.workingHourTask = employeeStatus.tasks
      .flatMap((task) => task.workingHourTask || [])
      .filter((entry) => {
        if (!entry.date) return false;

        const entryDate = new Date(entry.date);

        if (dateFilter.type === "month") {
          return entryDate.getMonth() === dateFilter.month && entryDate.getFullYear() === dateFilter.year;
        }

        if (dateFilter.type === "year") {
          return entryDate.getFullYear() === dateFilter.year;
        }

        return true;
      });

    setFilteredData(filteredStatus)
  }

  useEffect(() => {
    applyFilters()
  }, [dateFilter, employeeStatus])

  const employeeProjects =
    filteredData?.tasks
      ?.filter((task) => task.project) // Filter tasks that have a project
      ?.map((task) => task.project) // Map to extract projects
      ?.filter((project, index, self) => index === self.findIndex((p) => p.id === project.id)) || [] // Remove duplicates based on project id
  console.log(employeeProjects, "employeeProjects")

  const handleClose = () => {
    onClose(true)
  }

  useEffect(() => {
    fetchEmployeeStatus()
  }, [])

  // Calculate stats from the data
  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0
    const [hours, minutes, seconds] = duration.split(":").map(Number)
    return hours * 60 + minutes + Math.floor(seconds / 60)
  }

  const calculateStats = () => {
    if (!filteredData) return null

    console.log(filteredData, "filteredData")
    // Calculate total assigned hours from tasks
    const totalAssignedHours = (
      filteredData.tasks.reduce((total, task) => total + parseDurationToMinutes(task.duration), 0) / 60
    ).toFixed(2)

    // Calculate total worked hours from workingHourUser
    const totalWorkedHours = (
      filteredData.tasks
        .flatMap((task) => task.workingHourTask || [])
        .reduce((total, entry) => total + (entry.duration || 0), 0) / 60
    ).toFixed(2)

    console.log(totalWorkedHours, "totalWorkedHours")
    // Count projects
    const projectCount = employeeProjects ? employeeProjects.length : 0

    // Count tasks by status
    const tasksByStatus = filteredData.tasks.reduce((acc, task) => {
      const status = task.status || "Unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return {
      totalAssignedHours,
      totalWorkedHours,
      projectCount,
      taskCount: filteredData.tasks.length,
      tasksByStatus,
    }
  }

  const stats = calculateStats()

  // Generate month and year options for filters
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85">
      <div className="w-11/12 p-5 overflow-y-auto bg-white rounded-lg shadow-lg h-5/6 md:p-5 md:w-8/12">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-lg font-bold bg-teal-400 px-3 py-2 rounded-lg shadow-md text-white">Employee Status</h2>
          <Button className="bg-red-500 hover:bg-red-600 flex items-center gap-2" onClick={handleClose}>
            <X size={16} /> Close
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            <span className="ml-2 text-gray-600">Loading employee data...</span>
          </div>
        ) : filteredData ? (
          <div className="space-y-6">
            {/* Employee Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {filteredData.f_name} {filteredData.m_name} {filteredData.l_name}
                  </h3>
                  <p className="text-gray-600">{filteredData.emp_code}</p>
                  <p className="text-gray-600">{filteredData.email}</p>
                  <p className="text-gray-600">{filteredData.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-gray-700">{filteredData.role || "N/A"}</p>
                  <p className="text-sm font-medium text-gray-500 mt-2">Designation</p>
                  <p className="text-gray-700">{filteredData.designation || "N/A"}</p>
                </div>
                <div>
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${filteredData.is_active ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className="text-sm font-medium">{filteredData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  {filteredData.is_manager && (
                    <div className="mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full inline-block">
                      Manager
                    </div>
                  )}
                  {filteredData.is_deptmanager && (
                    <div className="mt-1 ml-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full inline-block">
                      Dept Manager
                    </div>
                  )}
                  {filteredData.is_hr && (
                    <div className="mt-1 ml-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full inline-block">
                      HR
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Date Filter</h3>
                </div>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Filter size={16} />
                    {dateFilter.type === "all"
                      ? "All Time"
                      : dateFilter.type === "month"
                        ? `${months[dateFilter.month]} ${dateFilter.year}`
                        : `Year ${dateFilter.year}`}
                    <ChevronDown size={16} />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            value={dateFilter.type}
                            onChange={(e) => setDateFilter({ ...dateFilter, type: e.target.value })}
                          >
                            <option value="all">All Time</option>
                            <option value="month">By Month</option>
                            <option value="year">By Year</option>
                          </select>
                        </div>

                        {dateFilter.type === "month" && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              value={dateFilter.month}
                              onChange={(e) => setDateFilter({ ...dateFilter, month: Number.parseInt(e.target.value) })}
                            >
                              {months
                                .map((month, index) => ({ name: month, originalIndex: index }))
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((month) => (
                                  <option key={month.name} value={month.originalIndex}>
                                    {month.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}

                        {(dateFilter.type === "month" || dateFilter.type === "year") && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              value={dateFilter.year}
                              onChange={(e) => setDateFilter({ ...dateFilter, year: Number.parseInt(e.target.value) })}
                            >
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
                            onClick={() => setShowFilterDropdown(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter chips/tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 text-xs rounded-full ${dateFilter.type === "all" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}
                  onClick={() => setDateFilter({ ...dateFilter, type: "all" })}
                >
                  All Time
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full ${dateFilter.type === "month" && dateFilter.month === new Date().getMonth() && dateFilter.year === new Date().getFullYear() ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}
                  onClick={() =>
                    setDateFilter({ type: "month", month: new Date().getMonth(), year: new Date().getFullYear() })
                  }
                >
                  Current Month
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full ${dateFilter.type === "year" && dateFilter.year === new Date().getFullYear() ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}
                  onClick={() =>
                    setDateFilter({ type: "year", month: new Date().getMonth(), year: new Date().getFullYear() })
                  }
                >
                  Current Year
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-full ${dateFilter.type === "year" && dateFilter.year === new Date().getFullYear() - 1 ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}
                  onClick={() =>
                    setDateFilter({ type: "year", month: new Date().getMonth(), year: new Date().getFullYear() - 1 })
                  }
                >
                  Last Year
                </button>
              </div>

              {/* Filter summary */}
              {dateFilter.type !== "all" && (
                <div className="mt-3 text-xs text-gray-500">
                  Showing data for:
                  <span className="font-medium ml-1">
                    {dateFilter.type === "month"
                      ? `${months[dateFilter.month]} ${dateFilter.year}`
                      : `Year ${dateFilter.year}`}
                  </span>
                  <span className="ml-2">
                    ({filteredData.tasks.length} tasks, {filteredData.workingHourUser.length} time entries)
                  </span>
                </div>
              )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hours Assigned vs Worked */}
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-teal-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Hours</h3>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Assigned</span>
                    <span className="text-xs font-medium">{stats?.totalAssignedHours || 0} hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{
                        width: `${stats?.totalWorkedHours ? Math.min(100, (stats.totalAssignedHours / stats.totalWorkedHours) * 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Worked</span>
                    <span className="text-xs font-medium">{stats?.totalWorkedHours || 0} hrs</span>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Projects</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-800">{stats?.projectCount || 0}</p>
                  <p className="text-xs text-gray-500">Assigned projects</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Tasks</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-800">{stats?.taskCount || 0}</p>
                  <p className="text-xs text-gray-500">Total tasks</p>
                </div>
              </div>

              {/* Efficiency */}
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Efficiency</h3>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalAssignedHours && stats.totalAssignedHours > 0
                      ? Math.round((stats.totalAssignedHours / stats.totalWorkedHours) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500">Hours worked vs assigned</p>
                </div>
              </div>
            </div>

            {/* Tasks Breakdown */}
            <div className="grid ">
              {/* Tasks List */}
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-800">Tasks</h3>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {filteredData.tasks.length} total
                  </span>
                </div>
                <div className="overflow-y-auto max-h-64">
                  {filteredData.tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-200 px-5">
                      {filteredData.tasks.map((task, index) => (
                        <li key={index} className="py-3 text-sm">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{task.title || `Task ${index + 1}`}</p>
                              <p className="text-xs text-gray-500">
                                {task.description?.substring(0, 60) || "No description"}
                                {task.description?.length > 60 ? "..." : ""}
                              </p>
                              {task.created_at && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Created: {new Date(task.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${task.status === "COMPLETE"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "IN_PROGRESS"
                                    ? "bg-blue-100 text-blue-800"
                                    : task.status === "IN_REVIEW"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {task.status || "Unknown"}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                Total Assigned Hours:{" "}
                                {task.duration ? (parseDurationToMinutes(task.duration) / 60).toFixed(2) : 0} hrs
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                Total Working Hours:{" "}
                                {task.workingHourTask
                                  ? task.workingHourTask
                                    .reduce((total, hour) => total + (hour.duration / 60 || 0), 0)
                                    .toFixed(2)
                                  : "0.00"}{" "}
                                hrs
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No tasks found for the selected period</p>
                  )}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-800">Assigned Projects</h3>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {employeeProjects.length} projects
                </span>
              </div>
              {employeeProjects && employeeProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employeeProjects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-800">{project.name || `Project ${index + 1}`}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.description?.substring(0, 100) || "No description"}
                        {project.description?.length > 100 ? "..." : ""}
                      </p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-gray-500">
                          Status: <span className="font-medium">{project.status || "Unknown"}</span>
                        </span>
                        <span className="text-gray-500">
                          Deadline:{" "}
                          <span className="font-medium">
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No projects found for the selected period</p>
              )}
            </div>

            {/* Task Status Distribution */}
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center mb-4">
                <PieChart className="h-5 w-5 text-teal-500 mr-2" />
                <h3 className="text-md font-medium text-gray-800">Task Status Distribution</h3>
              </div>
              {stats?.tasksByStatus && Object.keys(stats.tasksByStatus).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{status}</span>
                        <span className="text-xs text-gray-500">
                          {count} tasks ({Math.round((count / stats.taskCount) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${status === "COMPLETE"
                            ? "bg-green-500"
                            : status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : status === "IN_REVIEW"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          style={{ width: `${(count / stats.taskCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No task data available for the selected period</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No employee data found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeStatus
