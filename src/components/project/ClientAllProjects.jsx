/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  PauseCircle,
  Search,
  Users,
  Calendar,
  DollarSign,
  ChevronDown,
  FileText,
  Upload,
  Edit3,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react"
import Service from "../../config/Service.js"
import { showProjects } from "../../store/projectSlice.js"

const ClientAllProjects = () => {
  const projects = useSelector((state) => state?.projectData?.projectData) || []
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  })
  const [viewMode, setViewMode] = useState("grid")
  const [isLoading, setIsLoading] = useState(true)

  const token = sessionStorage.getItem("token")
  const dispatch = useDispatch()

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await Service.allprojects(token)
      dispatch(showProjects(response?.data))
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Status configuration
  const statusConfig = {
    ACTIVE: {
      color: "bg-blue-50 text-blue-700 border border-blue-200",
      icon: <Loader2 className="w-3 h-3" />,
      label: "Active",
    },
    IN_PROGRESS: {
      color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      icon: <Clock className="w-3 h-3" />,
      label: "In Progress",
    },
    COMPLETE: {
      color: "bg-green-50 text-green-700 border border-green-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Complete",
    },
    ASSIGNED: {
      color: "bg-purple-50 text-purple-700 border border-purple-200",
      icon: <Users className="w-3 h-3" />,
      label: "Assigned",
    },
    IN_REVIEW: {
      color: "bg-orange-50 text-orange-700 border border-orange-200",
      icon: <AlertCircle className="w-3 h-3" />,
      label: "In Review",
    },
    ON_HOLD: {
      color: "bg-red-50 text-red-700 border border-red-200",
      icon: <PauseCircle className="w-3 h-3" />,
      label: "On Hold",
    },
  }

  // Project stage configuration
  const stageConfig = {
    PLANNING: {
      color: "bg-gray-100 text-gray-700",
      icon: <Target className="w-3 h-3" />,
      label: "Planning",
    },
    DESIGN: {
      color: "bg-indigo-100 text-indigo-700",
      icon: <Edit3 className="w-3 h-3" />,
      label: "Design",
    },
    PROCUREMENT: {
      color: "bg-cyan-100 text-cyan-700",
      icon: <Upload className="w-3 h-3" />,
      label: "Procurement",
    },
    CONSTRUCTION: {
      color: "bg-orange-100 text-orange-700",
      icon: <Zap className="w-3 h-3" />,
      label: "Construction",
    },
    TESTING: {
      color: "bg-purple-100 text-purple-700",
      icon: <AlertCircle className="w-3 h-3" />,
      label: "Testing",
    },
    HANDOVER: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Handover",
    },
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.ACTIVE
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  // Stage badge component
  const StageBadge = ({ stage }) => {
    const config = stageConfig[stage] || stageConfig.PLANNING
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  // Completion progress component
  const CompletionProgress = ({ completion }) => {
    const percentage = Math.min(Math.max(completion || 0, 0), 100)
    const getProgressColor = (percent) => {
      if (percent >= 80) return "bg-green-500"
      if (percent >= 60) return "bg-blue-500"
      if (percent >= 40) return "bg-yellow-500"
      return "bg-red-500"
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[35px]">{percentage}%</span>
      </div>
    )
  }

  // Notification badges component
  const NotificationBadges = ({ notifications }) => {
    const { rfi = 0, submittals = 0, changeOrders = 0 } = notifications || {}
    const hasNotifications = rfi > 0 || submittals > 0 || changeOrders > 0

    if (!hasNotifications) return null

    return (
      <div className="flex flex-wrap gap-1">
        {rfi > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
            <FileText className="w-3 h-3" />
            RFI ({rfi})
          </span>
        )}
        {submittals > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            <Upload className="w-3 h-3" />
            Submittals ({submittals})
          </span>
        )}
        {changeOrders > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">
            <Edit3 className="w-3 h-3" />
            CO ({changeOrders})
          </span>
        )}
      </div>
    )
  }

  // Notification indicator for grid view
  const NotificationIndicator = ({ notifications }) => {
    const { rfi = 0, submittals = 0, changeOrders = 0 } = notifications || {}
    const totalNotifications = rfi + submittals + changeOrders

    if (totalNotifications === 0) return null

    return (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {totalNotifications > 99 ? "99+" : totalNotifications}
      </div>
    )
  }

  // Filtering and sorting logic
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        project?.description?.toLowerCase()?.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || project?.status === statusFilter
      const matchesStage = stageFilter === "all" || project?.stage === stageFilter
      return matchesSearch && matchesStatus && matchesStage
    })

    // Sort projects
    filtered.sort((a, b) => {
      if (!sortConfig.key) return 0

      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle nested properties
      if (sortConfig.key === "fabricator") {
        aValue = a.fabricator?.fabName || ""
        bValue = b.fabricator?.fabName || ""
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [projects, searchTerm, statusFilter, stageFilter, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleViewClick = (projectId) => {
    setSelectedProject(projectId)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedProject(null)
    setIsModalOpen(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track your construction projects</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETE">Complete</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Stage Filter */}
            <div className="relative w-full lg:w-48">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stages</option>
                <option value="PLANNING">Planning</option>
                <option value="DESIGN">Design</option>
                <option value="PROCUREMENT">Procurement</option>
                <option value="CONSTRUCTION">Construction</option>
                <option value="TESTING">Testing</option>
                <option value="HANDOVER">Handover</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Project Display */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Building2 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || stageFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first project."}
            </p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <div
              key={project.id}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Notification Indicator */}
              <NotificationIndicator notifications={project.notifications} />

              {/* Card Header */}
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 mr-3">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>

                {/* Stage */}
                <div className="mb-3">
                  <StageBadge stage={project.stage} />
                </div>

                {project.description && <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>}
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Completion Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Completion</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <CompletionProgress completion={project.completion} />
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>

                {/* Contractor */}
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{project.fabricator?.fabName}</span>
                </div>

                {/* Budget */}
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">{formatCurrency(project.budget)}</span>
                </div>

                {/* Timeline */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>

                {/* Notifications */}
                <NotificationBadges notifications={project.notifications} />

                {/* Action Button */}
                <button
                  onClick={() => handleViewClick(project.id)}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Project Name
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("fabricator")}
                  >
                    <div className="flex items-center gap-1">
                      Contractor
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("budget")}
                  >
                    <div className="flex items-center gap-1">
                      Budget
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notifications
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {project.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={project.status} />
                        <StageBadge stage={project.stage} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CompletionProgress completion={project.completion} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{project.fabricator?.fabName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col space-y-1">
                        <span>Start: {formatDate(project.startDate)}</span>
                        <span>End: {formatDate(project.endDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</td>
                    <td className="px-6 py-4">
                      <NotificationBadges notifications={project.notifications} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewClick(project.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal would go here */}
      {/* {isModalOpen && (
        <ViewDetails 
          data={selectedProject} 
          onClose={handleModalClose} 
          token={token} 
        />
      )} */}
    </div>
  )
}

export default ClientAllProjects
