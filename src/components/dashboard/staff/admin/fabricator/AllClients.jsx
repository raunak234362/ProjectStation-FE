import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetClient } from "../../../../index";
import DataTable from "../../../../DataTable";

const AllClients = () => {
  const clientData = useSelector((state) => state?.fabricatorData?.clientData || []);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (clientId) => {
    setSelectedClient(clientId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Fabricator",
        accessorFn: (row) => row?.fabricator?.fabName || "N/A",
        id: "fabricator",
        filterType: "select",
        filterOptions: [...new Set(clientData.map(c => c.fabricator?.fabName).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Client Name",
        accessorFn: (row) => `${row?.f_name || ""} ${row?.m_name || ""} ${row?.l_name || ""}`.trim(),
        id: "clientName",
      },
      {
        header: "City",
        accessorKey: "city",
        filterType: "select",
        filterOptions: [...new Set(clientData.map(c => c.city).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "State",
        accessorKey: "state",
        filterType: "select",
        filterOptions: [...new Set(clientData.map(c => c.state).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Country",
        accessorKey: "country",
        filterType: "select",
        filterOptions: [...new Set(clientData.map(c => c.country).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original.id)}>
            View
          </Button>
        ),
      },
    ],
    [clientData]
  );

  return (
    <div className="bg-white md:w-full w-[90vw] my-4 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Clients</h2>
      <DataTable
        columns={columns}
        data={clientData}
        searchPlaceholder="Search by name, fabricator, city, state or country"
      />
      {selectedClient && (
        <GetClient
          clientId={selectedClient}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllClients;
