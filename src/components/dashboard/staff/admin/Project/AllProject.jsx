/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, GetProject } from "../../../../index.js";
import Service from "../../../../../config/Service.js";
import { showProjects } from "../../../../../store/projectSlice.js";
import ProjectStatus from "../Project/ProjectStatus.jsx";
import { useTable, useSortBy } from "react-table";

const AllProjects = () => {
  const projects = useSelector((state) => state?.projectData?.projectData);
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData);

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "name", order: "asc" });
  const [filters, setFilters] = useState({
    fabricator: "",
    status: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setProjectFilter(projects);
  }, [projects]);

  useEffect(() => {
    filterAndSortData();
  }, [searchQuery, filters, sortOrder, projects]);

  const filterAndSortData = () => {
    let filtered = projects?.filter((project) => {
      const searchMatch = project?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const filterMatch =
        (!filters?.fabricator || project?.fabricator?.fabName === filters?.fabricator) &&
        (!filters?.status || project?.status === filters?.status);
      return searchMatch && filterMatch;
    });

    filtered.sort((a, b) => {
      let aKey = a[sortOrder?.key];
      let bKey = b[sortOrder?.key];

      if (sortOrder?.key === "fabricator") {
        aKey = a.fabricator?.fabName || "";
        bKey = b.fabricator?.fabName || "";
      }

      const aValue = typeof aKey === "string" ? aKey.toLowerCase() : aKey ?? "";
      const bValue = typeof bKey === "string" ? bKey.toLowerCase() : bKey ?? "";

      return sortOrder?.order === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

    setProjectFilter(filtered);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClick = (projectID) => {
    setSelectedProject(projectID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };
  // console.log("------------------------------------->", projectFilter);
  const data = useMemo(() => projectFilter || [], [projectFilter]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Name",
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
      },
      {
        Header: "Start Date",
        accessor: (row) => {
          if (!row.startDate) return "N/A";
          const date = new Date(row.startDate);
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const yyyy = date.getFullYear();
          return `${mm}-${dd}-${yyyy}`;
        },
        id: "startDate",
      },
      {
        Header: "Approval Date",
        accessor: (row) => {
          if (!row.approvalDate) return "N/A";
          const date = new Date(row.approvalDate);
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const yyyy = date.getFullYear();
          return `${mm}-${dd}-${yyyy}`;
        },
        id: "approvalDate",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      {/* Search and Filters */}
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
          <option value="">All Fabricator</option>
          {[...(fabricators || [])].sort((a, b) => (a.fabName || "").toLowerCase().localeCompare((b.fabName || "").toLowerCase())).map((fab) => (
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
          <option value="ACTIVE">ACTIVE</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="COMPLETE">COMPLETED</option>
          <option value="DELAY">DELAY</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="ON-HOLD">ON-HOLD</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-md border max-h-[80vh]">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-center"
        >
          <thead className="sticky top-0 z-10 bg-teal-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 font-semibold border whitespace-nowrap"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " " : " ") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No Projects Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-4 py-2 border">
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
