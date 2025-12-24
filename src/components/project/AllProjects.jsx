/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { CheckCircle2, PauseCircle, AlertCircle, Loader2 } from "lucide-react";
import ProjectStatus from "./projectTab/ProjectStatus";
import DataTable from "../DataTable";

const AllProjects = () => {
  const projects = useSelector(
    (state) => state?.projectData?.projectData || []
  );
  const allTasks = useSelector((state) => state?.taskData?.taskData || []);
  const userType = useMemo(() => sessionStorage.getItem("userType"), []);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = useCallback((project) => {
    setSelectedProject(project.id);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedProject(null);
    setIsModalOpen(false);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const columns = useMemo(
    () => [
      {
        header: "Project Name",
        accessorKey: "name",
        enableColumnFilter: true,
      },
      {
        header: "Fabricator",
        accessorFn: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
        filterType: "select",
        filterOptions: [...new Set(projects.map(p => p.fabricator?.fabName).filter(Boolean))].sort().map(name => ({ label: name, value: name })),
      },
      {
        header: "Manager",
        accessorFn: (row) => row?.manager?.f_name || "N/A",
        id: "manager",
        filterType: "select",
        filterOptions: [...new Set(projects.map(p => p.manager?.f_name).filter(Boolean))].sort().map(name => ({ label: name, value: name })),
      },
      {
        header: "Status",
        accessorKey: "status",
        filterType: "select",
        filterOptions: [
          { label: "ACTIVE", value: "ACTIVE" },
          { label: "ASSIGNED", value: "ASSIGNED" },
          { label: "COMPLETED", value: "COMPLETE" },
          { label: "ON-HOLD", value: "ONHOLD" },
          { label: "DELAY", value: "DELAY" },
          { label: "INACTIVE", value: "INACTIVE" },
        ],
        cell: ({ getValue }) => {
          const status = getValue();
          let StatusIcon = CheckCircle2;
          let statusColor = "text-green-500";
          let statusBgColor = "bg-green-50";

          if (status === "ACTIVE") {
            StatusIcon = Loader2;
            statusColor = "text-blue-500";
            statusBgColor = "bg-blue-50";
          } else if (status === "ONHOLD") {
            StatusIcon = PauseCircle;
            statusColor = "text-amber-500";
            statusBgColor = "bg-amber-50";
          } else if (status === "DELAY" || status === "INACTIVE") {
            StatusIcon = AlertCircle;
            statusColor = "text-red-500";
            statusBgColor = "bg-red-50";
          }

          return (
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 inline-flex items-center gap-1 text-xs font-medium rounded-full ${statusBgColor} ${statusColor}`}
            >
              <StatusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {status}
            </span>
          );
        },
      },
      {
        header: "Tasks",
        id: "tasks",
        cell: ({ row }) => {
          const project = row.original;
          const projectTasks =
            allTasks?.filter((task) => task?.project_id === project.id) || [];
          const completedTasksCount =
            projectTasks?.filter(
              (task) =>
                task.status === "COMPLETE" ||
                task.status === "VALIDATE_COMPLETE" ||
                task.status === "COMPLETE_OTHER" ||
                task.status === "USER_FAULT"
            ).length || 0;
          const totalTasks = projectTasks.length;
          const progress =
            totalTasks > 0
              ? Math.round((completedTasksCount / totalTasks) * 100)
              : 0;

          let barColor = "bg-red-500";
          if (progress >= 80) barColor = "bg-green-500";
          else if (progress >= 50) barColor = "bg-yellow-500";
          else if (progress >= 20) barColor = "bg-orange-500";

          return (
            <div className="flex flex-col items-center min-w-[120px]">
              <div className="text-xs font-medium text-gray-700 mb-1">
                {completedTasksCount} / {totalTasks} completed
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 ${barColor} rounded`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-gray-500 mt-1">{progress}%</div>
            </div>
          );
        },
      },
      {
        header: "Approval Date",
        accessorFn: (row) => row.deadline || row.approvalDate,
        id: "deadline",
        cell: ({ row, getValue }) => {
          const status = row.original.status;
          const deadline = getValue();
          if (status === "COMPLETE")
            return (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Completed
              </span>
            );

          if (!deadline) return <span className="text-gray-400">N/A</span>;

          const deadlineDate = new Date(deadline);
          const today = new Date();
          const diffDays = Math.ceil(
            (deadlineDate - today) / (1000 * 60 * 60 * 24)
          );

          let color = "bg-green-100 text-green-700";
          if (diffDays < 0) color = "bg-red-100 text-red-700";
          else if (diffDays <= 3) color = "bg-yellow-100 text-yellow-700";

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
            >
              {formatDate(deadline)}
            </span>
          );
        },
      },
      {
        header: "Fabrication Date",
        accessorFn: (row) => formatDate(row.endDate),
        id: "fabricationDate",
      },
    ],
    [projects, allTasks]
  );

  return (
    <div className="w-full h-full p-4 rounded-lg bg-white/70">
      <DataTable
        columns={columns}
        data={projects}
        onRowClick={handleViewClick}
        searchPlaceholder="Search projects..."
      />

      {selectedProject && (
        <ProjectStatus
          projectId={selectedProject}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllProjects;
