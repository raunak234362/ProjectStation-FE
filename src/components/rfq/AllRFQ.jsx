/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback } from "react";
import Service from "../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { useSortBy, useTable } from "react-table";
import GetRFQ from "./GetRFQ";
import { showRFQs } from "../../store/rfqSlice";

function AllRFQ() {
  const [rfq, setRfq] = useState([]);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userType = sessionStorage.getItem("userType");
  const dispatch = useDispatch();
  const fetchInboxRFQ = async () => {
    try {
      let rfqDetail;
      if (userType === "client") {
        rfqDetail = await Service.sentRFQ();
      } else {
        rfqDetail = await Service.inboxRFQ();
      }
      setRfq(rfqDetail);
      dispatch(showRFQs(rfqDetail));
    } catch (error) {
      console.error("Error fetching RFQ:", error);
    }
  };

  useEffect(() => {
    fetchInboxRFQ();
  }, []);

  const filteredRFQ = useMemo(() => {
    return rfq.filter((item) => {
      const combined =
        `${item.projectName} ${item.subject} ${item.sender_id}`.toLowerCase();
      return combined.includes(searchTerm.toLowerCase());
    });
  }, [rfq, searchTerm]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        id: "sno",
      },
      {
        Header: "Project Name",
        accessor: "projectName",
      },
      {
        Header: "Mail ID",
        accessor: (row) => {
          // Show recepients for client, otherwise show sender
          if (userType === "client") {
            return row.recepients?.email || row.sender || "Null";
          } else {
            return row.sender?.email || row.recepients || "Null";
          }
        },
        id: "mailId",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Date",
        accessor: (row) => {
          const date = new Date(row.createdAt);
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          const yy = String(date.getFullYear()).slice(-2);
          const hh = String(date.getHours()).padStart(2, "0");
          const min = String(date.getMinutes()).padStart(2, "0");
          return `${mm}/${dd}/${yy} , ${hh}:${min}`;
        },
        id: "createdAt",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ];
    if (userType !== "client") {
      baseColumns.splice(3, 0, {
        Header: "Fabricator",
        accessor: (row) => row?.sender?.fabricator?.fabName || "",
        id: "fabricator",
        Cell: ({ value }) => (value ? value : null),
      });
    }
    return baseColumns;
  }, [userType]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredRFQ }, useSortBy);

  const handleRowClick = useCallback((rfqItem) => {
    setSelectedRFQ(rfqItem);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedRFQ(null);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="w-full p-4 rounded-lg bg-white/70">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by project, subject, sender..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-md">
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
                  No RFI data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <GetRFQ
          data={selectedRFQ}
          onClose={handleModalClose}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}

export default AllRFQ;
