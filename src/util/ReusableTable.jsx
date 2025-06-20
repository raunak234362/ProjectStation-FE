/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import DateFilter from "./DateFilter";


const ReusableTable = ({
  fetchData,
  columns,
  filters = [],
  searchableKeys = [],
  searchPlaceholder = "Search...",
  onRowClick,
}) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [dateFilter, setDateFilter] = useState({ type: "all" });
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const fetchTableData = async ({ pageIndex, pageSize }) => {
    setLoading(true);
    try {
      const response = await fetchData({
        searchQuery,
        filters: filterValues,
        dateFilter,
        pageIndex,
        pageSize,
      });
      setData(response?.data || []);
      setPageCount(response?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchTableData({ pageIndex, pageSize });
  }, [searchQuery, filterValues, dateFilter, pageIndex, pageSize]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-white/80 rounded-md">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full md:max-w-xs border p-2 rounded"
          value={searchQuery}
          onChange={handleSearch}
        />

        {filters.map((filter) => (
          <select
            key={filter.name}
            name={filter.name}
            value={filterValues[filter.name] || ""}
            onChange={handleFilterChange}
            className="w-full md:max-w-xs p-2 border rounded"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}

        <div className="w-full md:max-w-xs">
          <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table
          {...getTableProps()}
          className="min-w-full border-collapse text-sm text-center"
        >
          <thead className="bg-teal-200 sticky top-0 z-10">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 border font-medium"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data found.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="border px-4 py-2">
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="space-x-2">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="p-1 border rounded"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReusableTable;
