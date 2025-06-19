"use client"

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux"
import { Button, GetProject } from "../../../../index.js"
import { useState, useMemo } from "react"

const Dashboard = () => {
  const projects = useSelector((state) => state?.projectData.projectData)
  const staffs = useSelector((state) => state?.userData?.staffData?.data)
  const clients = useSelector((state) => state?.fabricatorData?.clientData)
  const user = useSelector((state) => state?.userData?.user)

  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [fabricatorFilter, setFabricatorFilter] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" })
  const [activeTab, setActiveTab] = useState("overview")

  const handleSearch = (e) => setSearchTerm(e.target.value)
  const handleStatusFilter = (e) => setStatusFilter(e.target.value)
  const handleFabricatorFilter = (e) => setFabricatorFilter(e.target.value)
  const handleDateRange = (e) => setDateRange(e.target.value)

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Enhanced metrics calculations
  const salesMetrics = useMemo(() => {
    const totalProjects = projects?.length || 0
    const awardedProjects = projects?.filter((p) => p.status === "AWARDED" || p.status === "COMPLETED")?.length || 0
    const activeProjects = projects?.filter((p) => p.status === "ACTIVE")?.length || 0
    const rfqReceived = projects?.filter((p) => p.status === "RFQ" || p.status === "ASSIGNED")?.length || 0
    const completedProjects = projects?.filter((p) => p.status === "COMPLETED")?.length || 0
    const onHoldProjects = projects?.filter((p) => p.status === "ON-HOLD")?.length || 0
    const delayedProjects = projects?.filter((p) => p.status === "DELAY")?.length || 0

    // Calculate total project value (assuming projects have a 'value' field)
    const totalValue = projects?.reduce((sum, project) => sum + (project.value || 0), 0) || 0
    const awardedValue =
      projects
        ?.filter((p) => p.status === "AWARDED" || p.status === "COMPLETED")
        ?.reduce((sum, project) => sum + (project.value || 0), 0) || 0

    // Win rate calculation
    const winRate = totalProjects > 0 ? ((awardedProjects / totalProjects) * 100).toFixed(1) : 0

    return {
      totalProjects,
      awardedProjects,
      activeProjects,
      rfqReceived,
      completedProjects,
      onHoldProjects,
      delayedProjects,
      totalValue,
      awardedValue,
      winRate,
      conversionRate: rfqReceived > 0 ? ((awardedProjects / rfqReceived) * 100).toFixed(1) : 0,
    }
  }, [projects])

  const statusCounts = useMemo(() => {
    const counts = {}
    projects?.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1
    })
    return counts
  }, [projects])

  const monthlyData = useMemo(() => {
    const months = {}
    projects?.forEach((project) => {
      const date = new Date(project.createdAt || Date.now())
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!months[monthKey]) {
        months[monthKey] = { rfq: 0, awarded: 0, completed: 0 }
      }
      if (project.status === "RFQ" || project.status === "ASSIGNED") months[monthKey].rfq++
      if (project.status === "AWARDED") months[monthKey].awarded++
      if (project.status === "COMPLETED") months[monthKey].completed++
    })
    return months
  }, [projects])

  const sortedProjects = useMemo(() => {
    return [...(projects || [])].sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }, [projects, sortConfig])

  const filteredProjects = sortedProjects.filter((project) => {
    const nameMatch = project.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === "" || project?.status === statusFilter
    const fabricatorMatch = fabricatorFilter === "" || project?.fabricator?.fabName === fabricatorFilter
    return nameMatch && statusMatch && fabricatorMatch
  })

  const uniqueFabricators = [...new Set(projects?.map((p) => p.fabricator?.fabName).filter(Boolean))]

  const handleViewClick = (id) => {
    setSelectedProject(id)
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

  return (
    <div className="w-full h-[89vh] overflow-hidden mx-5">
      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-3xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg shadow-lg">
          Sales Dashboard
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={handleDateRange}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="h-[85vh] overflow-y-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {["overview", "projects", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-md font-medium capitalize transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total RFQs Received"
                value={salesMetrics.rfqReceived}
                icon="📋"
                color="bg-blue-500"
                trend="+12%"
              />
              <MetricCard
                title="Projects Awarded"
                value={salesMetrics.awardedProjects}
                icon="🏆"
                color="bg-green-500"
                trend="+8%"
              />
              <MetricCard
                title="Win Rate"
                value={`${salesMetrics.winRate}%`}
                icon="📈"
                color="bg-purple-500"
                trend="+2.3%"
              />
              <MetricCard
                title="Total Sales Value"
                value={formatCurrency(salesMetrics.totalValue)}
                icon="💰"
                color="bg-yellow-500"
                trend="+15%"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <SmallMetricCard title="Active Projects" value={salesMetrics.activeProjects} color="text-blue-600" />
              <SmallMetricCard title="Completed" value={salesMetrics.completedProjects} color="text-green-600" />
              <SmallMetricCard title="On Hold" value={salesMetrics.onHoldProjects} color="text-yellow-600" />
              <SmallMetricCard title="Delayed" value={salesMetrics.delayedProjects} color="text-red-600" />
              <SmallMetricCard
                title="Conversion Rate"
                value={`${salesMetrics.conversionRate}%`}
                color="text-purple-600"
              />
              <SmallMetricCard title="Total Clients" value={clients?.length || 0} color="text-indigo-600" />
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Monthly Performance</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {Object.entries(monthlyData)
                  .slice(-6)
                  .map(([month, data]) => (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col gap-1 items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${(data.rfq / Math.max(...Object.values(monthlyData).map((d) => d.rfq))) * 100}px`,
                          }}
                          title={`RFQs: ${data.rfq}`}
                        ></div>
                        <div
                          className="w-full bg-green-500"
                          style={{
                            height: `${(data.awarded / Math.max(...Object.values(monthlyData).map((d) => d.awarded))) * 80}px`,
                          }}
                          title={`Awarded: ${data.awarded}`}
                        ></div>
                        <div
                          className="w-full bg-purple-500 rounded-b"
                          style={{
                            height: `${(data.completed / Math.max(...Object.values(monthlyData).map((d) => d.completed))) * 60}px`,
                          }}
                          title={`Completed: ${data.completed}`}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{month}</span>
                    </div>
                  ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">RFQs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Awarded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search by project name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  {["RFQ", "ASSIGNED", "ACTIVE", "ON-HOLD", "INACTIVE", "DELAY", "AWARDED", "COMPLETED"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ),
                  )}
                </select>
                <select
                  value={fabricatorFilter}
                  onChange={handleFabricatorFilter}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Fabricators</option>
                  {uniqueFabricators.map((fab) => (
                    <option key={fab} value={fab}>
                      {fab}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Projects ({filteredProjects.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        Project Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("status")}
                      >
                        Status {sortConfig.key === "status" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fabricator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No projects found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={project.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {project.fabricator?.fabName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(project.value || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              onClick={() => handleViewClick(project.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
              <div className="space-y-3">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const percentage = ((count / (projects?.length || 1)) * 100).toFixed(1)
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        <span className="text-sm font-medium">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-lg font-bold text-green-600">{salesMetrics.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Average Project Value</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(salesMetrics.totalValue / (projects?.length || 1))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Active Fabricators</span>
                  <span className="text-lg font-bold text-purple-600">{uniqueFabricators.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Projects at Risk</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {salesMetrics.onHoldProjects + salesMetrics.delayedProjects}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedProject && <GetProject projectId={selectedProject} isOpen={isModalOpen} onClose={handleModalClose} />}
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-1">
            <span className="font-medium">{trend}</span> from last period
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>{icon}</div>
    </div>
  </div>
)

const SmallMetricCard = ({ title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-600 mt-1">{title}</div>
  </div>
)

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "ACTIVE":
        return "bg-blue-100 text-blue-800"
      case "AWARDED":
        return "bg-purple-100 text-purple-800"
      case "RFQ":
        return "bg-yellow-100 text-yellow-800"
      case "ASSIGNED":
        return "bg-indigo-100 text-indigo-800"
      case "ON-HOLD":
        return "bg-orange-100 text-orange-800"
      case "DELAY":
        return "bg-red-100 text-red-800"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {status}
    </span>
  )
}

export default Dashboard
