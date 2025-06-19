/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Calendar, Edit2, FileText, Globe, HardDrive, Layers, Plus, X, ChevronRight, BarChart2 } from "lucide-react"
import AddWB from "./wb/AddWB"
import EditProject from "./EditProject"
import AllWorkBreakdown from "./wb/AllWorkBreakdown"

// UI Components
const Button = ({ children, variant = "primary", size = "md", className = "", onClick, ...props }) => {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "hover:bg-gray-100 text-gray-700",
  }

  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-teal-100 text-teal-800",
  }

  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]}`}>{children}</span>
}

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

const CardHeader = ({ title, icon, action }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-teal-500">{icon}</span>}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-6 px-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// Main Component
const GetProject = ({ projectId, onClose, projectData }) => {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedEditProject, setSelectedEditProject] = useState(null)
  const [selectedProjectWB, setSelectedProjectWB] = useState(null)
  const [addWorkBreakdown, setAddWorkBreakdown] = useState(false)
  const [allWorkBreakdown, setAllWorkBreakdown] = useState(false)
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddWorkBreakdown = () => {
    setAddWorkBreakdown(true)
    setSelectedProject(projectData.id)
  }

  const handleAllWorkBreakdown = () => {
    setAllWorkBreakdown(true)
    setSelectedProjectWB(projectData.id)
  }

  const handleCloseAWB = async () => {
    setAddWorkBreakdown(false)
    setSelectedProject(null)
  }

  const handleCloseAllWB = async () => {
    setAllWorkBreakdown(false)
    setSelectedProjectWB(null)
  }

  const handleClose = async () => {
    onClose(true)
  }

  const handleEditClick = () => {
    setIsModalOpen(true)
    setSelectedEditProject(projectData)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedEditProject(null)
  }

  const handleStatusView = (projectID) => {
    setSelectedProjectStatus(projectID)
    setIsStatusModalOpen(true)
  }

  const handleStatusClose = () => {
    setSelectedProjectStatus(null)
    setIsStatusModalOpen(false)
  }

  const tabs = [
    { id: "details", label: "Project Details" },
    { id: "fabricator", label: "Fabricator" },
    { id: "workbreakdown", label: "Work Breakdown" },
    { id: "files", label: "Files" },
  ]

  const getStatusVariant = (status) => {
    const statusMap = {
      Completed: "success",
      "In Progress": "info",
      "On Hold": "warning",
      Delayed: "danger",
      "Not Started": "default",
    }
    return statusMap[status] || "default"
  }

  const renderProjectDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Description</h4>
          <p className="text-gray-800 font-semibold">{projectData?.description || "Not available"}</p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Status</h4>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(projectData?.status)}>{projectData?.status || "Not available"}</Badge>
            <Button size="sm" variant="ghost" onClick={() => handleStatusView(projectId)}>
              View Details
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Department</h4>
          <p className="text-gray-800 font-semibold">{projectData?.department?.name || "Not available"}</p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Team</h4>
          <p className="text-gray-800 font-semibold">{projectData?.team?.name || "Not available"}</p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Project Manager</h4>
          <p className="text-gray-800 font-semibold">
            {projectData?.manager?.f_name || projectData?.manager?.m_name || projectData?.manager?.l_name
              ? `${projectData?.manager?.f_name || ""} ${projectData?.manager?.m_name || ""} ${projectData?.manager?.l_name || ""}`.trim()
              : "Not available"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Estimated Hours</h4>
          <p className="text-gray-800 font-semibold">{projectData?.estimatedHours || "Not available"}</p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Stage</h4>
          <p className="text-gray-800 font-semibold">{projectData?.stage || "Not available"}</p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-500 mb-1">Tools</h4>
          <p className="text-gray-800 font-semibold">{projectData?.tools || "Not available"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium text-gray-500 mb-1">Start Date</h4>
            <p className="text-gray-800 font-semibold">
              {projectData?.startDate
                ? (() => {
                    const date = new Date(projectData.startDate);
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${mm}-${dd}-${yyyy}`;
                  })()
                : "Not available"}
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-500 mb-1">End Date</h4>
            <p className="text-gray-800 font-semibold font-semibold">{projectData?.startDate
                ? (() => {
                    const date = new Date(projectData.endDate);
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${mm}-${dd}-${yyyy}`;
                  })()
                : "Not available"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <h4 className="text-md font-medium text-gray-500 mb-1">Main Design</h4>
            <Badge variant={projectData?.connectionDesign ? "success" : "default"}>
              {projectData?.connectionDesign ? "Required" : "Not required"}
            </Badge>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-500 mb-1">Misc Design</h4>
            <Badge variant={projectData?.miscDesign ? "success" : "default"}>
              {projectData?.miscDesign ? "Required" : "Not required"}
            </Badge>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-500 mb-1">Connection Design</h4>
            <Badge variant={projectData?.customerDesign ? "success" : "default"}>
              {projectData?.customerDesign ? "Required" : "Not required"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFabricatorDetails = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Fabricator Name</h4>
        <p className="text-gray-800 font-medium">{projectData?.fabricator?.fabName || "Not available"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
          {projectData?.fabricator?.website ? (
            <a
              href={projectData?.fabricator?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
            >
              <Globe size={16} />
              <span>Visit Website</span>
            </a>
          ) : (
            <p className="text-gray-500">Not available</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Drive</h4>
          {projectData?.fabricator?.drive ? (
            <a
              href={projectData?.fabricator.drive}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
            >
              <HardDrive size={16} />
              <span>Access Drive</span>
            </a>
          ) : (
            <p className="text-gray-500">Not available</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Files</h4>
        {Array.isArray(projectData?.fabricator?.files) && projectData?.fabricator?.files.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {projectData?.fabricator?.files?.map((file, index) => (
              <a
                key={index}
                href={`${import.meta.env.VITE_BASE_URL}/fabricator/fabricator/viewfile/${projectData?.fabricatorID}/${file.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <FileText size={16} className="text-teal-500" />
                <span className="text-gray-700 text-sm">{file.originalName || `File ${index + 1}`}</span>
                <ChevronRight size={16} className="text-gray-400 ml-auto" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No files available</p>
        )}
      </div>
    </div>
  )

  const renderWorkBreakdown = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <AddWB projectId={projectId} projectData={projectData}/>
      </div>

      {/* <Card>
        <CardHeader title="Work Breakdown Summary" icon={<BarChart2 size={18} />} />
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Select <b>View All Work Breakdown</b> to see the detailed breakdown for this project.</p>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )

  const renderFiles = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Project Files</h4>
        <Button size="sm" variant="outline">
          <Plus size={14} />
          Add Files
        </Button>
      </div>

      {Array.isArray(projectData?.files) && projectData?.files.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {projectData?.files?.map((file, index) => (
            <a
              key={index}
              href={`${import.meta.env.VITE_BASE_URL}/api/project/projects/viewfile/${projectId}/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <FileText size={18} className="text-teal-500" />
              <div>
                <p className="text-gray-800 text-sm font-medium">{file.originalName || `File ${index + 1}`}</p>
                <p className="text-xs text-gray-500">Added on {new Date().toLocaleDateString()}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No files available for this project</p>
          <Button size="sm" variant="ghost" className="mt-2">
            <Plus size={14} />
            Upload Files
          </Button>
        </div>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderProjectDetails()
      case "fabricator":
        return renderFabricatorDetails()
      case "workbreakdown":
        return renderWorkBreakdown()
      case "files":
        return renderFiles()
      default:
        return renderProjectDetails()
    }
  }

  return (
    <>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 text-white p-2 rounded-lg">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{projectData?.name || "Project Details"}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-teal-500 text-white font-semibold" size="sm" onClick={handleEditClick}>
              <Edit2 size={16} />
              Edit
            </Button>
            {/* <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={16} />
              Close
            </Button> */}
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>

        {/* Footer */}
        {/* <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Button variant="primary" size="sm" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div> */}

        {/* {selectedProjectWB && (
          <AllWorkBreakdown projectId={selectedProjectWB} onClose={handleCloseAllWB} />
        )} */}

     
{/* 
      {selectedProjectWB && (
        <AllWorkBreakDown
          projectId={selectedProjectWB}
          onClose={handleCloseAllWB}
        />
      )} */}

      {selectedEditProject && (
        <EditProject project={selectedEditProject} onClose={handleModalClose} />
      )}

      {/* {selectedProjectStatus && (
        <ProjectStatus
          projectId={selectedProjectStatus}
          onClose={handleStatusClose}
        />
      )} */}
    </>
  );
};

export default GetProject;
