/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, GetVendor } from "../../../../index";

const AllVendors = () => {
  const vendors = useSelector((state) => state.vendorData?.vendorData);

  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ key: "name", order: "asc" });
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    setVendor(vendors);
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

  // Sort fabricators based on the column header clicked
  const handleSort = (key) => {
    const order =
      sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    setSortOrder({ key, order });
    filterAndSortData(searchQuery, filters, { key, order });
  };

  // Function to handle filtering and sorting
  const filterAndSortData = (searchQuery, filters, sortOrder) => {
    let filtered = vendors.filter((fab) => {
      const searchMatch =
        fab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab.country.toLowerCase().includes(searchQuery.toLowerCase());

      const filterMatch =
        (!filters.country || fab.country === filters.country) &&
        (!filters.state || fab.state === filters.state) &&
        (!filters.city || fab.city === filters.city);

      return searchMatch && filterMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aKey = a[sortOrder.key].toLowerCase();
      const bKey = b[sortOrder.key].toLowerCase();
      if (sortOrder.order === "asc") return aKey > bKey ? 1 : -1;
      return aKey < bKey ? 1 : -1;
    });

    setVendor(filtered);
  };

  const handleViewClick = async (vendorId) => {
    setSelectedVendor(vendorId);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setSelectedVendor(null);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="country"
            className="p-2 border rounded"
            value={filters.country}
            onChange={handleFilterChange}
          >
            <option value="">Filter by Country</option>
            {Array.from(new Set(vendors.map((ven) => ven.country))).map(
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
            {Array.from(new Set(vendors.map((ven) => ven.state))).map(
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
            {Array.from(new Set(vendors.map((ven) => ven.city))).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-2 bg-white h-[50vh] overflow-y-auto">
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl">
          <thead>
            <tr className="bg-teal-200/70">
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("name")}
              >
                S.no{" "}
                {sortOrder.key === "s.no" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Vendor Name{" "}
                {sortOrder.key === "name" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSort("city")}
              >
                City{" "}
                {sortOrder.key === "city" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSort("state")}
              >
                State{" "}
                {sortOrder.key === "state" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => handleSort("country")}
              >
                Country{" "}
                {sortOrder.key === "country" &&
                  (sortOrder.order === "asc" ? " " : " ")}
              </th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendor?.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="5" className="text-center">
                  No Vendor Found
                </td>
              </tr>
            ) : (
              vendor.map((vendor, index) => (
                <tr key={vendor.id} className="hover:bg-blue-gray-100 border">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{vendor.name}</td>
                  <td className="border px-2 py-1">{vendor.city}</td>
                  <td className="border px-2 py-1">{vendor.state}</td>
                  <td className="border px-2 py-1">{vendor.country}</td>
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
      {selectedVendor && (
        <GetVendor
          vendorId={selectedVendor}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllVendors;
