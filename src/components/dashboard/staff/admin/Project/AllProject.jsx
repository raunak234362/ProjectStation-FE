import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../index.js";
import Service from "../../../../../config/Service.js";
import { showProjects } from "../../../../../store/projectSlice.js";
import ProjectStatus from "../Project/ProjectStatus.jsx";
import DataTable from "../../../../DataTable";

const AllProjects = () => {
  const projects = useSelector((state) => state?.projectData?.projectData || []);
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData || []);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await Service.allProject();
      dispatch(showProjects(response || []));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleViewClick = (projectID) => {
    setSelectedProject(projectID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Fabricator",
        accessorFn: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
        filterType: "select",
        filterOptions: [...new Set(projects.map(p => p.fabricator?.fabName).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Manager",
        accessorFn: (row) => row?.manager?.f_name || "N/A",
        id: "manager",
      },
      {
        header: "Status",
        accessorKey: "status",
        filterType: "select",
        filterOptions: [...new Set(projects.map(p => p.status).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        cell: (info) => {
          const value = info.getValue();
          if (!value) return "N/A";
          const date = new Date(value);
          return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`;
        },
      },
      {
        header: "Approval Date",
        accessorKey: "approvalDate",
        cell: (info) => {
          const value = info.getValue();
          if (!value) return "N/A";
          const date = new Date(value);
          return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`;
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original.id)}>View</Button>
        ),
      },
    ],
    [projects]
  );

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Projects</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          searchPlaceholder="Search projects..."
        />
      )}

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
