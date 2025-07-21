/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Service from "../../../config/Service";
import { useTable, useSortBy } from "react-table";

const EstimationTaskList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const [tasks, setTasks] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "Estimation Number",
        accessor: (row) => row.estimation?.estimationNumber || "",
        id: "estimationNumber",
      },
      {
        Header: "Assigned To",
        accessor: (row) =>
          [
            row.assignedTo?.f_name,
            row.assignedTo?.m_name,
            row.assignedTo?.l_name,
          ]
            .filter(Boolean)
            .join(" ") || "",
        id: "assignedTo",
      },
      {
        Header: "Project Name",
        accessor: (row) => row.estimation?.projectName || "",
        id: "projectName",
      },
      {
        Header: "Estimate Date",
        accessor: (row) => row.estimation?.estimateDate || "",
        id: "estimateDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Tools",
        accessor: (row) => row.estimation?.tools || "",
        id: "tools",
      },
      {
        Header: "Tools",
        accessor: "status",
      },
    ],
    []
  );

  const data = useMemo(() => tasks || [], [tasks]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const fetchEstimationTasks = async () => {
    try {
      const response = await Service.allEstimationTasks();
      console.log("Estimation Tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching estimation tasks:", error);
    }
  };

  useEffect(() => {
    fetchEstimationTasks();
  }, []);

  const handleViewClick = (estID) => {
    setSelectedEstimation(estID);
    setIsModalOpen(true);
  };

  // const handleModalClose = () => {
  //   setSelectedEstimation(null);
  //   setIsModalOpen(false);
  // };

  return (
    <div>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200 text-sm text-left"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup, headerGroupIdx) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id || headerGroupIdx}
            >
              {headerGroup.headers.map((column, colIdx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-3 font-semibold text-gray-700 tracking-wider cursor-pointer"
                  key={column.id || colIdx}
                >
                  {column.render("Header")}
                  <span className="ml-1 text-xs">
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-100"
        >
          {rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-50"
                  key={row.id}
                  onClick={() => handleViewClick(row.original)}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-2 text-gray-700"
                      key={cell.column.id}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No estimations available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EstimationTaskList;
