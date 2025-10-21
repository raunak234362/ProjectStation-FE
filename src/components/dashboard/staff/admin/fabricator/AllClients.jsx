/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetClient } from "../../../../index";
const AllClients = () => {
  const clientData = useSelector((state) => state?.fabricatorData?.clientData);

  console.log(clientData);

  // const [searchQuery, setSearchQuery] = useState('')
  // const [fabricatorFilter, setFabricatorFilter] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedClient, setSelectedClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get unique fabricators for filter dropdown
  // const uniqueFabricators = [
  //   ...new Set(clientData?.map((client) => client?.fabricator?.name)),
  // ]

  // Filtering, searching, and sorting logic
  // const filteredClients = clientData
  //   ?.filter((client) => {
  //     // Filter by fabricator
  //     if (fabricatorFilter !== 'All' && client.fabricator?.name !== fabricatorFilter) {
  //       return false
  //     }
  //     // Search filter (case-insensitive)
  //     const fullName = `${client.f_name} ${client.m_name} ${client.l_name}`.toLowerCase()
  //     return (
  //       fullName.includes(searchQuery.toLowerCase()) ||
  //       client?.fabricator?.headquater?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       client?.fabricator?.headquater?.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       client?.fabricator?.headquater?.country.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //   })
  //   ?.sort((a, b) => {
  //     // Sorting logic based on sortConfig
  //     if (sortConfig.key) {
  //       const order = sortConfig.direction === 'asc' ? 1 : -1
  //       const aValue = a[sortConfig.key] || ''
  //       const bValue = b[sortConfig.key] || ''
  //       return aValue.localeCompare(bValue) * order
  //     }
  //     return 0
  //   })

  // // Handle sort click
  // const handleSort = (key) => {
  //   setSortConfig((prevState) => ({
  //     key,
  //     direction: prevState.direction === 'asc' ? 'desc' : 'asc',
  //   }))
  // }

  // const openClientWindow = (id) => {
  //   window.open(`/dashboard/client/${id}`, '_blank');
  // };
  const handleViewClick = async (clientId) => {
    setSelectedClient(clientId);
    setIsModalOpen(true);
  };

  console.log(selectedClient);

  const handleModalClose = async () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white md:w-full w-[90vw] my-4">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Search Field */}
        {/* <input
          type="text"
          className="border p-2 rounded"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={fabricatorFilter}
          onChange={(e) => setFabricatorFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Fabricators</option>
          {clientData.map((fabricator) => (
            <option key={fabricator} value={fabricator}>
              {fabricator}
            </option>
          ))}
        </select> */}
      </div>

      <div className=" bg-white p-5 h-fit overflow-y-auto">
        <table className=" h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl top-0">
          <thead>
            <tr className="bg-teal-200/70">
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('fabricator.name')}
              >
                Sl.no{" "}
                {sortConfig.key === "s.no" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('fabricator.name')}
              >
                Fabricator{" "}
                {sortConfig.key === "fabricator.name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('f_name')}
              >
                Client Name{" "}
                {sortConfig.key === "f_name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('fabricator.headquater.city')}
              >
                City{" "}
                {sortConfig.key === "fabricator.headquater.city" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('fabricator.headquater.state')}
              >
                State{" "}
                {sortConfig.key === "fabricator.headquater.state" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                // onClick={() => handleSort('fabricator.headquater.country')}
              >
                Country{" "}
                {sortConfig.key === "fabricator.headquater.country" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientData?.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="6" className="text-center">
                  No Client Found
                </td>
              </tr>
            ) : (
              clientData?.map((client, index) => (
                <tr key={client.id} className="hover:bg-blue-gray-100 border">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">
                    {client?.fabricator?.fabName}
                  </td>
                  <td className="border px-2 py-1">
                    {client?.f_name} {client?.m_name} {client?.l_name}
                  </td>
                  <td className="border px-2 py-1">{client?.city}</td>
                  <td className="border px-2 py-1">{client?.state}</td>
                  <td className="border px-2 py-1">{client?.country}</td>
                  <td className="border px-2 py-1">
                    <Button onClick={() => handleViewClick(client.id)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedClient && (
          <GetClient
            clientId={selectedClient}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllClients;
