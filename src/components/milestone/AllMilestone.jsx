/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import { useSignals } from "@preact/signals-react/runtime";
import GetMilestone from "./GetMilestone";

const TaskProgressBar = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return { color: "bg-green-500", width: "100%", percentage: "100%" };
      case "IN_REVIEW":
        return { color: "bg-yellow-500", width: "50%", percentage: "50%" };
      case "ACTIVE":
        return { color: "bg-gray-500", width: "25%", percentage: "25%" };
      default:
        return {
          color: "bg-gray-300 dark:bg-gray-600",
          width: "10%",
          percentage: "0%",
        };
    }
  };

  const { color, width, percentage } = getStatusStyles(status);

  if (!status || !["COMPLETED", "IN_REVIEW", "ACTIVE"].includes(status)) {
    return <span className="text-gray-500 dark:text-gray-400">No Status</span>;
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-300 ${color}`}
          style={{ width }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {percentage}
      </span>
    </div>
  );
};

const AllMilestone = ({ milestoneData }) => {
  useSignals();
  console.log("milestoneData in AllMilestone:", milestoneData.value);

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    if (Array.isArray(milestoneData?.value)) {
      // Only include milestones with valid status
      return milestoneData.value.filter((milestone) =>
        ["COMPLETED", "IN_REVIEW", "ACTIVE"].includes(milestone.status)
      );
    }
    return [];
  }, [milestoneData]);

  console.log("Filtered milestone data:", data);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Approval Date",
        accessor: "approvalDate",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "-",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => <TaskProgressBar status={value} />,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const handleRowClick = useCallback((milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMilestone(null);
    setIsModalOpen(false);
  }, []);

  return (
    <section className="w-full  bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <div className=" mx-auto">
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-700"
          >
            <thead className="bg-gray-100 dark:bg-gray-800">
              {headerGroups.map((headerGroup, headerGroupIdx) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.id || headerGroupIdx}
                >
                  {headerGroup.headers.map((column, colIdx) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id || colIdx}
                      className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 border-b border-neutral-200 dark:border-neutral-700 cursor-pointer"
                    >
                      {column.render("Header")}
                      <span>
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
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id || row.index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-4 py-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 border-b border-neutral-200 dark:border-neutral-700"
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
                    className="px-4 py-4 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300"
                  >
                    No valid milestone data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <GetMilestone milestone={selectedMilestone} onClose={closeModal} />
      )}
    </section>
  );
};

export default AllMilestone;
