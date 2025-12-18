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
    const completedStatuses = [
      "COMPLETE",
      "VALIDATE_COMPLETE",
      "COMPLETE_OTHER",
      "USER_FAULT",
    ];
    const completed = tasks.filter((task) =>
      completedStatuses.includes(task.status)
    ).length;

    return Math.round((completed / tasks.length) * 100);
  };

  // Group tasks by milestone (subject + id) and compute completion percentage
  // Group tasks by milestone (subject + id) and compute completion percentage
  const getMilestoneStatus = (tasks) => {
    const milestones = projectData?.mileStones || projectData?.milestones || [];
    const groups = new Map();

    // 1. Initialize groups from milestones array
    milestones.forEach(ms => {
      const id = ms.id;
      const subject = ms.subject || ms.Subject || ms.name;
      const key = `${id || subject}`;
      groups.set(key, {
        id: id || key,
        subject: subject || "Unnamed Milestone",
        tasks: [],
        startDate: ms.startDate || ms.StartDate || ms.date || projectData?.startDate,
        endDate: ms.endDate || ms.EndDate,
        approvalDate: ms.approvalDate || ms.ApprovalDate || ms.endDate || ms.EndDate,
        percentage: ms.percentage,
      });
    });

    // 2. Associate tasks with groups
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        const ms = task.milestone || task.mileStone || {};
        const id = task.milestone_id || task.mileStone_id || (typeof ms === 'object' ? ms.id : null);
        const subject =
          (typeof ms === 'object' ? (ms.subject || ms.Subject || ms.name) : null) ||
          task.milestone_name ||
          (typeof ms === 'string' ? ms : null);

        if (!id && !subject) return;

        const key = `${id || subject}`;
        if (groups.has(key)) {
          groups.get(key).tasks.push(task);
        } else {
          const msObj = typeof ms === 'object' ? ms : {};
          groups.set(key, {
            id: id || key,
            subject: subject || "Unnamed Milestone",
            tasks: [task],
            startDate: msObj.startDate || msObj.StartDate || task.startDate || projectData?.startDate,
            endDate: msObj.endDate || msObj.EndDate || task.endDate,
            approvalDate: msObj.approvalDate || msObj.ApprovalDate || msObj.endDate || msObj.EndDate || task.endDate,
            percentage: msObj.percentage,
          });
        }
      });
    }

    return Array.from(groups.values()).map((group) => {
      // 1. Manual Override Priority
      if (group.percentage !== undefined && group.percentage !== null && group.percentage !== "") {
        const manual = Math.min(100, Math.max(0, Math.round(Number(group.percentage))));
        return { ...group, progress: manual, taskPercentage: manual, timePercent: manual };
      }

      // 2. Daily Percentage Distribution Logic
      const start = new Date(group.startDate);
      const approval = new Date(group.approvalDate);

      if (!group.startDate || !group.approvalDate || isNaN(start.getTime()) || isNaN(approval.getTime())) {
        return { ...group, progress: 0, taskPercentage: 0, timePercent: 0 };
      }

      const totalDays = Math.ceil((approval - start) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays <= 0) return { ...group, progress: 0, taskPercentage: 0, timePercent: 0 };

      const dailyPercentage = 100 / totalDays;
      let currentProgress = 0;
      let carriedOver = 0;

      const completedStatuses = ["COMPLETE", "VALIDATE_COMPLETE", "COMPLETE_OTHER", "USER_FAULT"];

      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];

        const tasksForDay = group.tasks.filter(t => {
          const dueDate = t.due_date || t.endDate;
          if (!dueDate) return false;
          try {
            const taskDate = new Date(dueDate).toISOString().split('T')[0];
            return taskDate === dateString;
          } catch (e) {
            return false;
          }
        });

        if (tasksForDay.length > 0) {
          const allCompleted = tasksForDay.every(t => completedStatuses.includes(t.status));
          if (allCompleted) {
            currentProgress += dailyPercentage + carriedOver;
            carriedOver = 0;
          } else {
            carriedOver += dailyPercentage;
          }
        } else {
          carriedOver += dailyPercentage;
        }
      }

      // For display consistency with existing UI
      const progress = Math.min(100, Math.round(currentProgress || 0));

      return {
        ...group,
        progress,
        taskPercentage: progress,
        timePercent: progress, // Using progress for both for now as per new logic
      };
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
                <div key={ms.id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium text-sm">
                      {ms.subject}
                    </span>

                    <span className="text-xs text-gray-500">
                      Tasks: {ms.taskPercentage}% | Time: {ms.timePercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1 relative">
                    {/* Time Progress (background shadow layer) */}
                    <div
                      className="absolute top-0 left-0 h-2 rounded-full bg-gray-400 opacity-40"
                      style={{ width: `${ms.timePercent}%` }}
                    ></div>

                    {/* Task Completion (real progress) */}
                    <div
                      className="absolute top-0 left-0 h-2 rounded-full bg-teal-500"
                      style={{ width: `${ms.taskPercentage}%` }}
                    ></div>
                  </div>
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
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </h4>
                <div
                  className="text-gray-700 w-full text-sm md:text-base whitespace-normal text-right sm:text-left"
                  dangerouslySetInnerHTML={{
                    __html: projectData?.description || "N/A",
                  }}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </h4>

                {projectData?.status || "Not available"}
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
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Project Manager
                </h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.manager
                    ? `${projectData?.manager?.f_name || ""} ${projectData?.manager?.l_name || ""
                    }`
                    : "Not available"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Team</h4>
                <p className="text-gray-800 font-semibold">
                  {projectData?.team?.name || "Not available"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
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
                    Approval Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.approvalDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Submission Date
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(projectData?.endDate)}
                  </p>
                </div>
              </div>
              <div className="grid grid-rows-2 gap-5">
                {/* Connection Design Scope */}
                <div>
                  <h2 className="text-sm font-medium text-gray-800 mb-1">
                    Connection Design Scope
                  </h2>
                  <div className="flex flex-row space-x-5 mt-2 w-full">
                    {/* Main Design */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-1  ${projectData?.connectionDesign
                          ? "text-green-600 bg-green-200/70 rounded-xl px-2 py-1"
                          : "text-red-600 bg-red-200/70 rounded-xl px-2 py-1"
                          }`}
                      >
                        Main Design
                      </h4>
                    </div>

                    {/* Misc Design */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-1  ${projectData?.miscDesign
                          ? "text-green-600 bg-green-200/70 rounded-xl px-2 py-1"
                          : "text-red-600 bg-red-200/70 rounded-xl px-2 py-1"
                          }`}
                      >
                        Misc Design
                      </h4>
                    </div>

                    {/* Customer Design */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-1  ${projectData?.customerDesign
                          ? "text-green-600 bg-green-200/70 rounded-xl px-2 py-1"
                          : "text-red-600 bg-red-200/70 rounded-xl px-2 py-1"
                          }`}
                      >
                        Connection Design
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Detailing Scope */}
                <div>
                  <h2 className="text-sm font-medium text-gray-800 mb-1">
                    Detailing Scope
                  </h2>
                  <div className="flex flex-row space-x-5 mt-2 w-full">
                    {/* Main Steel */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-1  ${projectData?.detailingMain
                          ? "text-green-600 bg-green-200/70 rounded-xl px-2 py-1"
                          : "text-red-600 bg-red-200/70 rounded-xl px-2 py-1"
                          }`}
                      >
                        Main Steel
                      </h4>
                    </div>

                    {/* Miscellaneous Steel */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-1  ${projectData?.detailingMisc
                          ? "text-green-600 bg-green-200/70 rounded-xl px-2 py-1"
                          : "text-red-600 bg-red-200/70 rounded-xl px-2 py-1"
                          }`}
                      >
                        Miscellaneous Steel
                      </h4>
                    </div>
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
              href={`${import.meta.env.VITE_BASE_URL
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
