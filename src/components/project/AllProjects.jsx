/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable, useSortBy } from "react-table";
import Button from "../fields/Button";
import { CheckCircle2, Loader2, PauseCircle, AlertCircle } from "lucide-react";
import ProjectStatus from "./projectTab/ProjectStatus";

const AllProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state?.projectData?.projectData || []);
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData || []);
  const allTasks = useSelector((state) => state?.taskData?.taskData || []);
  const userType = useMemo(() => sessionStorage.getItem("userType"), []);

  const departmentTasks = useMemo(() => {
    return (
      allTasks?.flatMap((task) =>
        task?.tasks?.map((subTask) => ({
          ...subTask,
          project: task?.name,
          manager: task?.manager,
        }))
      ) || []
    );
  }, [allTasks]);

  const taskData = useMemo(() => {
    return userType === "department-manager" ? departmentTasks : allTasks;
  }, [userType, departmentTasks, allTasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "name", order: "asc" });
  const [filters, setFilters] = useState({
    fabricator: "",
    status: "",
    manager: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const managerOptions = useMemo(() => {
    const managers = new Set(
      projects
        ?.map((project) => project?.manager?.f_name)
        .filter((name) => name)
    );
    return [...managers].sort();
  }, [projects]);

  const handleSearch = useCallback((e) => setSearchQuery(e.target.value), []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleViewClick = useCallback((projectID) => {
    setSelectedProject(projectID);
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

  const filterAndSortData = useCallback(() => {
    let filtered = projects?.filter((project) => {
      const searchMatch = project?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const fabricatorMatch =
        !filters.fabricator ||
        project?.fabricator?.fabName === filters.fabricator;
      const statusMatch = !filters.status || project?.status === filters.status;
      const managerMatch =
        !filters.manager || project?.manager?.f_name === filters.manager;
      return searchMatch && fabricatorMatch && statusMatch && managerMatch;
    });

    filtered.sort((a, b) => {
      let aKey, bKey;

      if (sortOrder.key === "fabricator") {
        aKey = a.fabricator?.fabName || "N/A";
        bKey = b.fabricator?.fabName || "N/A";
      } else if (sortOrder.key === "manager") {
        aKey = a.manager?.f_name || "N/A";
        bKey = b.manager?.f_name || "N/A";
      } else {
        aKey = a[sortOrder.key];
        bKey = b[sortOrder.key];
      }

      const aValue = typeof aKey === "string" ? aKey.toLowerCase() : aKey ?? "";
      const bValue = typeof bKey === "string" ? bKey.toLowerCase() : bKey ?? "";

      return sortOrder.order === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    setProjectFilter(filtered);
    setLoading(false);
  }, [projects, searchQuery, filters, sortOrder]);

  useEffect(() => {
    filterAndSortData();
  }, [filterAndSortData]);

  const data = useMemo(() => projectFilter || [], [projectFilter]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Project Name",
        accessor: "name",
      },
      {
        Header: "Fabricator",
        accessor: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
      },
      {
        Header: "Manager",
        accessor: (row) => row?.manager?.f_name || "N/A",
        id: "manager",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const status = row.original.status;
          let StatusIcon = CheckCircle2;
          let statusColor = "text-green-500";
          let statusBgColor = "bg-green-50";

          if (status === "ACTIVE") {
            StatusIcon = Loader2;
            statusColor = "text-blue-500";
            statusBgColor = "bg-blue-50";
          } else if (status === "ON-HOLD") {
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
        Header: "Tasks",
        id: "tasks",
        Cell: ({ row }) => {
          const project = row.original;
          const projectTasks = taskData?.filter(
            (task) => task?.project_id === project.id
          );
          const completedTasksCount = projectTasks?.filter(
            (task) => task.status === "COMPLETE"
          ).length;
          return (
            <div>
              <div className="text-xs font-medium text-gray-700 sm:text-sm">
                {projectTasks?.length || 0}
              </div>
              <div className="text-xs text-gray-500">
                {completedTasksCount || 0} completed
              </div>
            </div>
          );
        },
      },
      {
        Header: "Start Date",
        accessor: (row) => formatDate(row.startDate),
        id: "startDate",
      },
      {
        Header: "Approval Date",
        accessor: (row) => formatDate(row.approvalDate),
        id: "approvalDate",
      },
    ],
    [handleViewClick, taskData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const renderSkeletonRows = (count = 10) => {
    return Array.from({ length: count }).map((_, rowIdx) => (
      <tr key={rowIdx} className="animate-pulse">
        {columns.map((_, colIdx) => (
          <td key={colIdx} className="px-4 py-2 border">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <input
          type="text"
          placeholder="Search by name"
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          name="fabricator"
          value={filters.fabricator}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Fabricators</option>
          {fabricators?.map((fab) => (
            <option key={fab.id} value={fab.fabName}>
              {fab.fabName}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ON-HOLD">ON-HOLD</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="DELAY">DELAY</option>
          <option value="COMPLETE">COMPLETED</option>
        </select>
        <select
          name="manager"
          value={filters.manager}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Managers</option>
          {managerOptions.map((manager) => (
            <option key={manager} value={manager}>
              {manager}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border max-h-[80vh]">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-center"
        >
          <thead className="sticky top-0 z-10 bg-teal-200">
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <tr
                key={headerGroup.id || headerGroupIdx}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, colIdx) => (
                  <th
                    key={column.id || colIdx}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 font-semibold border whitespace-nowrap"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              renderSkeletonRows(8)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No Projects Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id || row.index}
                    className="hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => handleViewClick(row.original.id)}
                  >
                    {row.cells.map((cell) => (
                      <td
                        key={cell.column.id || cell.getCellProps().key}
                        {...cell.getCellProps()}
                        className="px-4 py-2 border"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
