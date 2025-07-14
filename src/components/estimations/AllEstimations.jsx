/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import { useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import GetEstimation from "./getEstimation/GetEstimation";

const AllEstimations = ({ estimationData }) => {
  console.log("All Estimations Data:", estimationData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState(null);
  const columns = useMemo(
    () => [
      {
        Header: "Estimation No.",
        accessor: "estimationNumber",
      },
      {
        Header: "Project Name",
        accessor: "projectName",
      },
      {
        Header: "Tools",
        accessor: "tools",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Estimate Date",
        accessor: "estimateDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Created By",
        accessor: "createdBy.username",
      },
    ],
    []
  );

  const data = useMemo(() => estimationData || [], [estimationData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const handleViewClick = (estID) => {
    setSelectedEstimation(estID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEstimation(null);
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto mt-4 border rounded-lg">
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
      {selectedEstimation && (
        <GetEstimation
          estimation={selectedEstimation}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllEstimations;
