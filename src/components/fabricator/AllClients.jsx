/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../index";
import DataTable from "../DataTable";
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
        header: "Client Name",
        accessorFn: (row) =>
          `${row?.f_name || ""} ${row?.m_name || ""} ${row?.l_name || ""
            }`.trim(),
        id: "clientName",
        enableColumnFilter: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "City",
        accessorKey: "city",
        filterType: "select",
        filterOptions: [...new Set(filteredClientData.map(c => c.city).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "State",
        accessorKey: "state",
        filterType: "select",
        filterOptions: [...new Set(filteredClientData.map(c => c.state).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Country",
        accessorKey: "country",
        filterType: "select",
        filterOptions: [...new Set(filteredClientData.map(c => c.country).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <Button onClick={() => handleViewClick(row.original.id)}>View</Button>
        ),
      },
    ],
    [filteredClientData]
  );

  return (
    <div className="bg-white md:w-full w-[90vw] my-4 p-4">
      <DataTable
        columns={columns}
        data={filteredClientData}
        searchPlaceholder="Search clients..."
      />

      {selectedClient && (
        <GetClientById
          clientId={selectedClient}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllClients;
