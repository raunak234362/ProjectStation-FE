/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";
import Service from "../../../../../config/Service";
import GetSentSubmittals from "../submittals/GetSentSubmittals"
import { useSortBy, useTable, usePagination } from "react-table";

// Utility function to get nested values safely
function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows, for pagination use page instead of row
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

                  // className="px-2 py-2 border-2"
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

// const getNestedValue = (obj, path) => {
//   return path.split(".").reduce((acc, part) => acc && acc[part], obj);
// };

const SubmittalsProject = ({project}) => {
    const submittals = project.submittals;
    console.log(submittals)
  const [selectedSubmittals, setSelectedSubmittals] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = async (submittalsId) => {
    console.log(submittalsId);
    setSelectedSubmittals(submittalsId);
    setIsModalOpen(true);
  };
  console.log("submittalsId", selectedSubmittals);

  const handleModalClose = async () => {
    setSelectedSubmittals(null);
    setIsModalOpen(false);
  };
    
const staff = useSelector((state) => state?.userData?.staffData);
    console.log(staff);
    
     const columns = React.useMemo(() => [
       {
         Header: "Sl.no",
         accessor: (row, i) => i + 1,
         id: "slno",
       },
       {
         Header: "Subject",
         accessor: "subject",
         id: "project_name",
       },
       {
         Header: "Mail Id",
             accessor: (row) => {
                 const sender = staff?.find((sender) => sender.id === row?.sender_id)
                 return <div>{sender?.email}</div>
           },
         id: "mailId",
       },
       {
         Header: "Sender",
           accessor: (row) => {
               const sender = staff?.find((sender) => sender?.id === row?.sender_id)
               console.log(row.sender_id);
               return <div>{sender?.f_name}</div>;
           },
         id: "senderId",
       },
       {
         Header: "Date",
         accessor: "date",
         id: "date",
         Cell: ({ value }) => {
           const date = new Date(value).toLocaleDateString();
           return <div>{date}</div>;
         },
       },
       {
         Header: "Status",
           accessor: (row) => {
             const status = submittals.status === "true" ? "Replied" : "Not Replied";
             return <div>{status}</div>;
           },
       },
       {
         Header: "Actions",
         Cell: ({ row }) => (
           <Button onClick={() => handleViewClick(row.original)}>View</Button>
         ),
       },
     ]);
    const data = React.useMemo(() => submittals || [submittals]);
    
  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        <Table columns={columns} data={data} />
        {selectedSubmittals && (
          <GetSentSubmittals
            submittalId={selectedSubmittals.id}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default SubmittalsProject;
