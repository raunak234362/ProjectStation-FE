/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../index";
import toast from "react-hot-toast";
import Service from "../../config/Service";
import RFIResponse from "./response/RFIResponse";
import { X } from "lucide-react";
import RFIDetail from "./RFIDetail";
import { useSortBy, useTable } from "react-table";
import ResponseFromClient from "./response/ResponseFromClient";

const FileLinks = ({ files, rfiId, isResponse = false, responseId = null }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  if (!Array.isArray(files) || files.length === 0) {
    return <span className="text-sm text-gray-500">Not available</span>;
  }

  return files.map((file, index) => {
    const fileUrl = isResponse
      ? `${baseURL}/api/RFI/rfi/response/viewfile/${responseId}/${file.id}`
      : `${baseURL}/api/RFI/rfi/viewfile/${rfiId}/${file.id}`;

    return (
      <a
        key={file.id || index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-teal-600 hover:underline block"
      >
        {file.originalName || `File ${index + 1}`}
      </a>
    );
  });
};

const GetRFI = ({ rfiId, isOpen, onClose }) => {
  const [rfi, setRFI] = useState(null);
  const [rfiResponse, setRFIResponse] = useState([]);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const userType = useMemo(() => sessionStorage.getItem("userType") || "", []);

  const fetchRFI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Service.fetchRFIById(rfiId);
      console.log("Fetched RFI:", response.data);
      setRFI((prev) => {
        const newData = response?.data;
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    } catch (error) {
      toast.error("Failed to fetch RFI");
      console.error("Error fetching RFI:", error);
    } finally {
      setLoading(false);
    }
  }, [rfiId]);

  console.log("GetRFI component rendered with rfiId:", rfi);

  const fetchRFIResponses = useCallback(async () => {
    try {
      const response = await Service.fetchRFIResponseById(rfiId);
      setRFIResponse((prev) => {
        const newData = response?.data || [];
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    } catch (error) {
      toast.error("Failed to fetch RFI responses");
      console.error("Error fetching RFI responses:", error);
    }
  }, [rfiId]);

  const handleViewModalOpen = useCallback((rfiResponseData) => {
    console.log("Opening modal for response ID:", rfiResponseData);
    setSelectedResponseId(rfiResponseData);
  }, []);

  const handleViewModalClose = useCallback(() => {
    setSelectedResponseId(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Sl.no",
        accessor: (_row, i) => i + 1,
        id: "serial",
        disableSortBy: true,
      },
      {
        Header: "Description",
        accessor: "reason",
        Cell: ({ value }) => value || "N/A",
      },
      {
        Header: "Status",
        accessor: (row) => {
          return userType === "client"
            ? row.responseState
            : row.wbtStatus || "N/A";
        },
        id: "status",
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ row }) => (
          <Button
            onClick={() => {
              handleViewModalOpen(row.original);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-2 rounded"
          >
            View
          </Button>
        ),
        disableSortBy: true,
      },
    ],
    [userType, handleViewModalOpen]
  );

  const tableData = useMemo(() => rfi?.rfiresponse || [], [rfi?.rfiresponse]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData }, useSortBy);

  useEffect(() => {
    if (isOpen && rfiId) {
      fetchRFI();
      fetchRFIResponses();
    }
  }, [rfiId, isOpen, fetchRFI, fetchRFIResponses]);

  if (!isOpen) return null;

  if (loading || !rfi) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          {loading ? "Loading RFI details..." : "No RFI data available"}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const { subject, recepients, rfiresponse, id: rfiID } = rfi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white h-[90%] w-11/12 max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-gradient-to-r from-teal-400 to-teal-100 border-b rounded-t-md">
          <div className="text-lg text-white font-medium">
            <span className="font-bold">Subject:</span> {subject || "N/A"}
          </div>
          <button
            className="p-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-6 overflow-y-auto h-full space-y-6">
          <div className={`grid gap-4 ${userType === "client" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
            <RFIDetail rfi={rfi} FileLinks={FileLinks} rfiId={rfiID} />
            {userType === "client" && (
              <RFIResponse
                rfiResponse={rfiResponse}
                rfi={rfi}
                onClose={onClose}
              />
            )}
          </div>

          <section>
            <h3 className="px-3 py-2 mt-3 font-bold text-white bg-teal-400 rounded-lg shadow-md md:text-2xl">
              RFI Responses
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
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-2 py-2 border-2 whitespace-nowrap"
                          key={column.id}
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
                      <td
                        colSpan={columns.length}
                        className="px-2 py-4 text-center"
                      >
                        No responses found
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="bg-white hover:bg-gray-50"
                          key={row.id}
                        >
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="px-2 py-2 border-2"
                              key={cell.column.id}
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
        </div>
      </div>
      {selectedResponseId && (
        <ResponseFromClient
          handleViewModalClose={handleViewModalClose}
          responseData={selectedResponseId}
        />
      )}
    </div>
  );
};

export default GetRFI;
