/* eslint-disable react/prop-types */

import { useCallback, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import GetCo from "./GetCo";

const ListOfCO = ({ coData, fetchCO }) => {
  const [selectedCO, setSelectedCO] = useState(null);

  const data = useMemo(() => coData, [coData]);

  const truncateWords = (text, limit = 10) => {
    if (!text) return "";
    const words = String(text).trim().split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : words.join(" ");
  };

  const columns = useMemo(
    () => [
      { Header: "Subject", accessor: "remarks" },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => truncateWords(value, 10),
      },
      {
        Header: "Date",
        accessor: "sentOn",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      { Header: "Status", accessor: "status" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const handleRowClick = useCallback((co) => {
    console.log("Clicked CO:", co);
    setSelectedCO(co);
    // setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setSelectedCO(null);
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
              <th>Sl.no</th>
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
                  <td>{row.index + 1}</td>
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
                No RFI data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedCO && (
        <GetCo
          initialSelectedCO={selectedCO}
          fetchCO={fetchCO}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ListOfCO;
