/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useState, useCallback, useMemo } from "react";
import Button from "../fields/Button";
import { X } from "lucide-react";
import RFQDetail from "./RFQDetail";
import ResponseRFQ from "./ResponseRFQ";
import UpdateStatus from "./UpdateStatus";
import { useTable, useSortBy } from "react-table";

const GetRFQ = ({ data, onClose, isOpen }) => {
  const userType = sessionStorage.getItem("userType");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  console.log("RFQ Data:", data);
  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const RFQData = data || {};
  const handleViewModalOpen = (id) => {
    setSelectedResponseId(id);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setSelectedResponseId(null);
    setViewModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sl.no",
        accessor: (_row, i) => i + 1,
        id: "serial",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => value || "N/A",
      },
      {
        Header: "Status",
        accessor: (row) => {
          let status = userType === "client" ? row.status : row.wbtStatus;
          if (status === "RE_APPROVAL") return "Revised";
          if (status === "CLOSE") return "Rejected";
          return status || "N/A";
        },
        id: "status",
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ row }) => (
          <Button
            onClick={() => handleViewModalOpen(row.original.id)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-2 rounded"
          >
            View
          </Button>
        ),
      },
    ],
    [data]
  );

  const tableInstance = useTable(
    { columns, data: data?.response || [] },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <div className="sticky top-0 z-50 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-md">
          <div className="text-lg text-white">
            <span className="font-bold">Subject:</span> {data?.subject}
          </div>
          <button
            className="p-2 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={handleModalClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RFQ Details and Response Form */}
        <section
          className={`mb-8 gap-4 ${
            userType === "client"
              ? "flex flex-col w-full"
              : "grid md:grid-cols-2 grid-cols-1 justify-between w-full"
          }`}
        >
          <div>
            <RFQDetail data={data} />
          </div>
          {userType !== "client" && (
            <div>
              <ResponseRFQ onClose={handleModalClose} rfqID={data.id} />
            </div>
          )}
        </section>

        {/* Table of Responses */}
        <section>
          <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:text-2xl">
            RFQ Responses
          </h3>
          <div className="p-5 bg-gray-50 rounded-lg shadow-inner min-h-[100px] overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full text-sm text-center text-gray-700 border-collapse rounded-xl"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-teal-200/90"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-2 py-2 border-2 whitespace-nowrap"
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
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-2 py-4 text-center">
                      No responses found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="bg-white">
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-2 py-2 border-2"
                          >
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
        </section>

        {/* Update Status Modal */}
        {viewModalOpen && selectedResponseId && (
          <UpdateStatus
            rfqID={RFQData.id}
            rfqResponseId={selectedResponseId}
            onClose={handleViewModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default GetRFQ;
