/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import Service from "../../config/Service";
import GetSentSubmittals from "./GetSubmittal";

const AllSubmittals = ({ projectData }) => {
  const [submittalsData, setSubmittalsData] = useState([]);
  const [selectedSubmittals, setSelectedSubmittals] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectId = projectData?.id;

  const fetchSubmittalsByProjectId = async () => {
    try {
      const response = await Service.getSubmittalByProjectId(projectId);
      setSubmittalsData(response.data || []);
    } catch (error) {
      console.error("Error fetching RFIs:", error);
      setSubmittalsData([]);
    }
  };

  useEffect(() => {
    if (projectId) fetchSubmittalsByProjectId();
  }, [projectId]);

  const data = useMemo(() => submittalsData, [submittalsData]);

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
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Recepient",
        accessor: (row) => {
          const r = row?.recepients;
          if (!r) return "-";
          const names = [r.f_name, r.m_name, r.l_name].filter(Boolean).join(" ");
          return names || "-";
        },
        id: "recepient",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) =>
          value ? (
            <span className="text-green-600 font-semibold">Waiting</span>
          ) : (
            <span className="text-red-500 font-semibold">Responded</span>
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

  const handleRowClick = useCallback((submittals) => {
    console.log("Clicked RFI:", submittals);
    setSelectedSubmittals(submittals);
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setSelectedSubmittals(null);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All RFIs</h2>
      <div className="overflow-x-auto border rounded-md">
        <table {...getTableProps()} className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup, headerGroupIdx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || headerGroupIdx}>
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
                      <td {...cell.getCellProps()} key={cell.column.id} className="p-2 border-b">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  No RFI data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
                <GetSentSubmittals submittalId={selectedSubmittals.id} isOpen={isModalOpen} onClose={handleModalClose} />
            )}
    </div>
  );
};

export default AllSubmittals;
