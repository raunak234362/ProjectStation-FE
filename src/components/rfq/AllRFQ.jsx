/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback } from "react";
import Service from "../../config/Service";
import { useSelector } from "react-redux";
import { useSortBy, useTable } from "react-table";
import GetRFQ from "./GetRFQ";

function AllRFQ() {
  const [rfq, setRfq] = useState([]);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userType = sessionStorage.getItem("userType");
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  const fetchInboxRFQ = async () => {
    try {
      let rfqDetail;
      if (userType === "client") {
        rfqDetail = await Service.sentRFQ();
      } else {
        rfqDetail = await Service.inboxRFQ();
      }
      setRfq(rfqDetail);
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

  const columns = useMemo(
    () => [
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
          const matchedClient = clientData.find(
            (client) =>
              client.email === row.sender_id || client.id === row.sender_id
          );
          return matchedClient ? matchedClient.email : row.sender_id;
        },
        id: "mailId",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    [clientData]
  );

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
