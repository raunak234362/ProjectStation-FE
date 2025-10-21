/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import Service from "../../../config/Service";

const CoListTable = ({ selectedCO, fetchCO }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [coTableData, setCoTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const coID = selectedCO?.id;

  const truncateWords = (text, limit = 20) => {
    if (!text) return "";
    const words = String(text).trim().split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : words.join(" ");
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await Service.fetchCOTable(coID);
      setCoTableData(response.coRow || []);
      await fetchCO();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [selectedCO]);

  const handleElementView = useCallback((data) => {
    setSelectedElement(data);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => truncateWords(value, 20),
      },
      { Header: "Reference Document / Drawing", accessor: "referenceDoc" },
      { Header: "Element Name", accessor: "elements" },
      {
        Header: "Element Quantity",
        accessor: "QtyNo",
        Cell: ({ value }) => value || 0,
      },
      {
        Header: "Hours",
        accessor: "hours",
        Cell: ({ value }) =>
          value !== undefined && value !== null ? `${value} hrs` : "0 hrs",
      },
      {
        Header: "Element Cost",
        accessor: "cost",
        Cell: ({ value }) =>
          value !== undefined && value !== null ? `$ ${value}` : "$0",
      },
    ],
    []
  );

  const data = useMemo(() => coTableData || [], [coTableData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  // Calculate totals
  const totalQty = useMemo(
    () =>
      coTableData.reduce(
        (sum, item) => sum + (Number(item.QtyNo) || 0),
        0
      ),
    [coTableData]
  );

  const totalHours = useMemo(
    () =>
      coTableData.reduce(
        (sum, item) => sum + (Number(item.hours) || 0),
        0
      ),
    [coTableData]
  );

  const totalCost = useMemo(
    () =>
      coTableData.reduce(
        (sum, item) => sum + (Number(item.cost) || 0),
        0
      ),
    [coTableData]
  );

  const renderSkeletonRows = (count = 6) => {
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
      <div className="overflow-x-auto rounded-md border max-h-[80vh]">
        <table
          {...getTableProps()}
          className="min-w-[900px] w-full border-collapse text-sm text-center"
        >
          <thead className="sticky top-0 z-10 bg-teal-200">
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <tr
                key={headerGroup.id || headerGroupIdx}
                {...headerGroup.getHeaderGroupProps()}
              >
                <th className="px-4 py-2 border">Sl.No</th>
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
              renderSkeletonRows(6)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-4 text-center">
                  No Projects Found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id || row.index}
                    className="hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => handleElementView(row.original.id)}
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
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

          {/* 🟢 Summary Row */}
          {!loading && rows.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td
                  colSpan={4}
                  className="text-right px-4 py-2 border text-gray-800"
                >
                  Total:
                </td>
                <td className="px-2 py-2 border text-blue-700">
                  {totalQty.toLocaleString()}
                </td>
                <td className="px-2 py-2 border text-green-700">
                  {totalHours.toLocaleString()} hrs
                </td>
                <td className="px-4 py-2 border text-indigo-700">
                  $ {totalCost.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default CoListTable;
