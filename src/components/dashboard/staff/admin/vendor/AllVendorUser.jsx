/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetVendorUser } from "../../../../index";

const AllVendorUser = () => {
  const vendors = useSelector((state) => state.vendorData?.vendorUserData);

  const [vendorUser, setVendorUser] = useState([]);
  const [selectedVendorUser, setSelectedVendorUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "f_name", order: "asc" });
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    vendor: "",
  });

  useEffect(() => {
    setFilteredVendors(vendors);
  }, [vendors]);

  // Handle search filtering
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterAndSortData(e.target.value, filters, sortOrder);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    filterAndSortData(searchQuery, { ...filters, [name]: value }, sortOrder);
  };

  // Sort vendors based on the column header clicked
  const handleSort = (key) => {
    const order =
      sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    setSortOrder({ key, order });
    filterAndSortData(searchQuery, filters, { key, order });
  };

  // Function to handle filtering and sorting
  const filterAndSortData = (searchQuery, filters, sortOrder) => {
    let filtered = vendors.filter((ven) => {
      const searchMatch =
        `${ven.f_name} ${ven.m_name} ${ven.l_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ven.vendor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ven.vendor.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ven.vendor.country.toLowerCase().includes(searchQuery.toLowerCase());

      const filterMatch =
        (!filters.country || ven.vendor.country === filters.country) &&
        (!filters.state || ven.vendor.state === filters.state) &&
        (!filters.city || ven.vendor.city === filters.city) &&
        (!filters.vendor || ven.vendor.name === filters.vendor);

      return searchMatch && filterMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aValue =
        sortOrder.key === "city"
          ? a.vendor.city
          : sortOrder.key === "state"
            ? a.vendor.state
            : sortOrder.key === "country"
              ? a.vendor.country
              : `${a.f_name} ${a.m_name} ${a.l_name}`; // Vendor Name
      const bValue =
        sortOrder.key === "city"
          ? b.vendor.city
          : sortOrder.key === "state"
            ? b.vendor.state
            : sortOrder.key === "country"
              ? b.vendor.country
              : `${b.f_name} ${b.m_name} ${b.l_name}`; // Vendor Name

      // Compare values
      if (aValue < bValue) return sortOrder.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder.order === "asc" ? 1 : -1;
      return 0; // Equal
    });

    setFilteredVendors(filtered);
  };

  const handleViewClick = async (vendorUserId) => {
    setSelectedVendorUser(vendorUserId);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setSelectedVendorUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="mt-5 bg-white h-auto p-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, city, state or country"
          className="border p-2 rounded w-full mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="vendor"
            className="p-2 border rounded"
            value={filters.vendor}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Vendor</option>
            {Array.from(new Set(vendors.map((ven) => ven.vendor.name))).sort().map(
              (vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              )
            )}
          </select>
          <select
            name="country"
            className="p-2 border rounded"
            value={filters.country}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Country</option>
            {Array.from(new Set(vendors.map((ven) => ven.vendor.country))).sort().map(
              (country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              )
            )}
          </select>
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Filter by State</option>
            {Array.from(new Set(vendors.map((ven) => ven.vendor.state))).sort().map(
              (state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              )
            )}
          </select>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">Filter by City</option>
            {Array.from(new Set(vendors.map((ven) => ven.vendor.city))).sort().map(
              (city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className="mt-2 bg-white h-[50vh] overflow-y-auto">
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("f_name")}
              >
                Vendor
                {sortOrder.key === "vendor" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("f_name")}
              >
                Vendor P.O.Contact
                {sortOrder.key === "f_name" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("city")}
              >
                City
                {sortOrder.key === "city" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("state")}
              >
                State
                {sortOrder.key === "state" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("country")}
              >
                Country
                {sortOrder.key === "country" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors?.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="6" className="text-center">
                  No Vendor Found
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-blue-gray-100 border">
                  <td className="border px-2 py-1">{vendor.vendor.name}</td>
                  <td className="border px-2 py-1 text-left">
                    {vendor.f_name} {vendor.m_name} {vendor.l_name}
                  </td>
                  <td className="border px-2 py-1">{vendor.vendor.city}</td>
                  <td className="border px-2 py-1">{vendor.vendor.state}</td>
                  <td className="border px-2 py-1">{vendor.vendor.country}</td>
                  <td className="border px-2 py-1">
                    <Button onClick={() => handleViewClick(vendor.id)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {
        selectedVendorUser && (
          <GetVendorUser
            vendorUserId={selectedVendorUser}
            onClose={handleModalClose}
          />
        )
      }
    </div>
  );
};

export default AllVendorUser;
