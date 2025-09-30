/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Calendar, Edit2, FileText, Plus, ChevronRight } from "lucide-react";
import Button from "../../fields/Button";
import { Badge, Card, CardHeader, Tabs } from "@material-tailwind/react";
import { CardContent } from "@mui/material";

// Reusable UI Components (Button, Badge, Card, etc.) ...

// Main Component
const ClientProjectDetail = ({
  projectId,
  projectData,
  fetchProjectByID,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  const [selectedEditProject, setSelectedEditProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedEditProject(projectData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEditProject(null);
  };

  const handleStatusView = (projectID) => {
    setSelectedProjectStatus(projectID);
    setIsStatusModalOpen(true);
  };

  const handleStatusClose = () => {
    setSelectedProjectStatus(null);
    setIsStatusModalOpen(false);
  };

  const tabs = [
    { id: "details", label: "Details & Fabricator" },
    { id: "files", label: "Files" },
  ];

  const getStatusVariant = (status) => {
    const statusMap = {
      COMPLETE: "success",
      "In Progress": "info",
      "On Hold": "warning",
      Delayed: "danger",
      "Not Started": "default",
    };
    return statusMap[status] || "default";
  };

  // NEW: Calculate overall task completion %
  const getTaskCompletionPercentage = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.status === "COMPLETE").length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Group tasks by milestone (subject + id) and compute completion percentage
  // Group tasks by milestone (subject + id) and compute completion percentage
 const getMilestoneStatus = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) return [];

  const groups = new Map();

  tasks.forEach((task) => {
    // console.log("Task milestone raw:", task.milestone, task.mileStone, task);

    const ms = task.milestone || task.mileStone || {};
    const id = task.milestone_id || task.mileStone_id || ms.id;
    const subject = ms.subject || ms.Subject || ms.name || task.milestone_name;

    if (!id && !subject) return; // ✅ only skip if both missing

    const key = `${id || subject}`;
    if (!groups.has(key)) groups.set(key, { id, subject: subject || "Unnamed Milestone", tasks: [] });
    groups.get(key).tasks.push(task);
  });

  return Array.from(groups.values()).map((group) => {
    const total = group.tasks.length;
    const completedCount = group.tasks.filter((t) => t.status === "COMPLETE").length;
    const percentage = total ? Math.round((completedCount / total) * 100) : 0;
    return { ...group, total, completedCount, percentage };
  });
};


  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const renderDetailsAndFabricator = () => (
    <div className="space-y-6">
      {/* Project Status Card */}
      <Card>
        <CardHeader title="Project Status" icon={<Calendar size={18} />} />
        <CardContent className="space-y-4">
          {/* Task Completion */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Task Completion
            </h4>
            <p className="text-gray-800 font-semibold">
              {getTaskCompletionPercentage(projectData?.tasks)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-teal-500 h-2.5 rounded-full"
                style={{
                  width: `${getTaskCompletionPercentage(projectData?.tasks)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Milestones
            </h4>
            {getMilestoneStatus(projectData?.tasks).length > 0 ? (
              getMilestoneStatus(projectData?.tasks).map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center gap-5 mb-1"
                >
                  {/* ✅ Show milestone subject */}
                  <span className="text-gray-800 text-sm font-semibold">
                    {ms.subject}
                  </span>

                  {/* ✅ Show percentage */}
                  <span className="text-gray-700 font-semibold text-sm">
                    {ms.percentage}% completed
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No milestones available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Details Card */}
      <Card>
        <CardHeader
          title="Project Details"
          icon={<Calendar size={18} />}
          action={
            <Button
              variant="outline"
              className="bg-teal-500 text-white font-semibold"
              size="sm"
              onClick={handleEditClick}
            >
              <Edit2 size={16} />
              Edit
            </Button>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h4>
                <div
                  className="text-gray-700 w-full text-sm md:text-base whitespace-normal"
                  dangerouslySetInnerHTML={{
                    __html: projectData?.description || "N/A",
                  }}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  {projectData?.status || "Not available"}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Department
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.department?.name || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Team</h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.team?.name || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Project Manager
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.manager?.f_name ||
                  projectData?.manager?.m_name ||
                  projectData?.manager?.l_name
                    ? `${projectData?.manager?.f_name || ""} ${
                        projectData?.manager?.m_name || ""
                      } ${projectData?.manager?.l_name || ""}`.trim()
                    : "Not available"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Estimated Hours
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.estimatedHours || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Stage
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.stage || "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Tools
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.tools || "Not available"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.startDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    End Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div className="font-medium text-gray-800">
                  Connection Design Scope:
                </div>
                <div>
                  <div>Main: </div>
                  <div>
                    {projectData?.connectionDesign ? (
                      <span className="text-green-600 font-semibold">
                        Required
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Not Required
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div>MISC: </div>
                  <div>
                    {projectData?.miscDesign ? (
                      <span className="text-green-600 font-semibold">
                        Required
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Not Required
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div>Custom: </div>
                  <div>
                    {projectData?.customerDesign ? (
                      <span className="text-green-600 font-semibold">
                        Required
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Not Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="font-medium text-gray-800">
                  Detailing Scope:
                </div>
                <div>
                  <div>Main: </div>
                  <div>
                    {projectData?.detailingMain ? (
                      <span className="text-green-600 font-semibold">
                        Required
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Not Required
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div>MISC: </div>
                  <div>
                    {projectData?.detailingMisc ? (
                      <span className="text-green-600 font-semibold">
                        Required
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Not Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
              href={`${
                import.meta.env.VITE_BASE_URL
              }/api/project/projects/viewfile/${projectId}/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <FileText size={18} className="text-teal-500" />
              <div>
                <p className="text-gray-800 text-sm font-medium">
                  {file.originalName || `File ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500">
                  Added on {new Date().toLocaleDateString()}
                </p>
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
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsAndFabricator();
      case "files":
        return renderFiles();
      default:
        return renderDetailsAndFabricator();
    }
  };

  return (
    <>
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
    </>
  );
};

export default ClientProjectDetail;
