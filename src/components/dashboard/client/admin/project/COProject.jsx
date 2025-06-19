/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from "react";
import { useSortBy, useTable, usePagination } from "react-table";
import Input from "../../../../fields/Input";
import Service from "../../../../../config/Service";
import Button from "../../../../fields/Button";
import { useSelector } from "react-redux";
import ViewCOTable from "../co/ViewCOTable";

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      {/*CO/sents
        CO/recieves*/}
      <table
        {...getTableProps()}
        className="min-w-full mt-5 text-lg text-center border border-collapse text-md rounded-xl"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="bg-teal-200/70"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="sticky top-0 z-10 px-2 py-2 bg-teal-200 border-2"
                >
                  {column.render("Header")}
                  <div>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="px-2 py-1 text-center border-2"
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="px-2 py-2 border-2">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<"}
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">>"}
        </button>

        <span className="ml-2">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>

        <span className="ml-2">
          Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="w-16 px-2 py-1 border rounded"
          />
        </span>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-2 py-1 ml-2 border rounded"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

const AllSentCO = ({ project }) => {
  // console.log("jjjjjjjjjjjjjjj", project)
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [click, setClick] = useState(false);
  const CO = project?.changeOrder;

  const projectInfo = useSelector((state) => state.projectData.projectData);
  const [filteredCO, setFilteredCO] = useState(null);
  const handleClick = (row) => {
    setFilteredCO(row);
    setClick(true);
  };
  const handleClose = () => {
    // console.log("Hittting Close")
    setFilteredCO(null);
    setClick(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Sl.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Project Name",
        accessor: (row) => {
          const projects = projectInfo.find((proj) => proj.id === row?.project);
          return <div>{projects?.name}</div>;
        },
        id: "project",
      },
      {
        Header: "Subject Remarks",
        accessor: "remarks",
      },
      {
        Header: "Change Order No",
        accessor: "changeOrder",
      },
      {
        Header: "Date",
        accessor: "sentOn",
        id: "date",
        Cell: ({ value }) => {
          const date = new Date(value).toLocaleDateString();
          return <div>{date}</div>;
        },
      },
      {
        Header: "Status",
        accessor:"status"
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Button onClick={() => handleClick(row.original)}>View</Button>
        ),
      },
    ],
    []
  );
  console.log("data------------------>",CO)
  const data = useMemo(() => CO || [], [CO]);

  return (
    <>
      <div className="p-4">
        <div className="max-h-[600px] overflow-auto">
          {/*search filter*/}
          <Table columns={columns} data={data} />
        </div>
      </div>
      {click && (
        <ViewCOTable
          onClose={handleClose}
          coData={filteredCO}
          coId={filteredCO.id}
        />
      )}
    </>
  );
};

export default AllSentCO;
