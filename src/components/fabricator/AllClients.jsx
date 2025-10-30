/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTable } from "react-table";
import { Button } from "../index";
import GetClientById from "./GetClientById";

const AllClients = ({ fabricator }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);
  const filteredClientData = useMemo(
    () =>
      (clientData || []).filter(
        (client) =>
          client?.fabricatorId === fabricator?.id &&
          !client?.is_disabled
      ),
    [clientData, fabricator]
  );
  const handleViewClick = (clientId) => {
    setSelectedClient(clientId);
  };

  const handleModalClose = () => {
    setSelectedClient(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (_row, i) => i + 1,
        id: "serial",
      },
      {
        Header: "Client Name",
        accessor: (row) =>
          `${row?.f_name || ""} ${row?.m_name || ""} ${
            row?.l_name || ""
          }`.trim(),
        id: "clientName",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => filteredClientData || [], [filteredClientData]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="bg-white md:w-full w-[90vw] my-4">
      <div className="bg-white p-5 overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full border-collapse text-center text-sm md:text-base rounded-xl"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-teal-200/70"
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="px-3 py-2">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No Client Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-100 border"
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="border px-3 py-2">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {selectedClient && (
          <GetClientById
            clientId={selectedClient}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllClients;
