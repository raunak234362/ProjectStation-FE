/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import { useSignals } from "@preact/signals-react/runtime";
import GetMilestone from "./GetMilestone";

const AllMilestone = ({ milestoneData }) => {
  useSignals();
  console.log("milestoneData in AllMilestone:", milestoneData.value);

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    // Ensure data is an array
    if (Array.isArray(milestoneData?.value)) {
      return milestoneData.value;
    }
    return [];
  }, [milestoneData]);

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
    <div>
      <table {...getTableProps()} className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup, headerGroupIdx) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id || headerGroupIdx}
            >
              {headerGroup.headers.map((column, colIdx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id || colIdx}
                  className="p-2 text-left border-b cursor-pointer"
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
                  className="hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="p-2 border-b"
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
                className="p-4 text-center text-gray-500"
              >
                No milestone data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <GetMilestone milestone={selectedMilestone} onClose={closeModal} />
      )}
    </div>
  );
};

export default AllMilestone;
