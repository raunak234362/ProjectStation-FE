/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable, useSortBy } from "react-table";
import { Button, GetFabricator } from "../index.js";
import Service from "../../config/Service.js";
import { loadFabricator } from "../../store/fabricatorSlice.js";

const AllFabricator = () => {
  const fabricators = useSelector((state) => state?.fabricatorData?.fabricatorData);
  const [filteredFabricators, setFilteredFabricators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ country: "", state: "", city: "" });
  const [selectedFabricator, setSelectedFabricator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const getAllFabricators = async () => {
    try {
      const response = await Service.allFabricator();
      dispatch(loadFabricator(response));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFabricators();
  }, []);

  useEffect(() => {
    setFilteredFabricators(fabricators);
  }, [fabricators]);

  // Filtering and searching logic
  useEffect(() => {
    let result = fabricators?.filter((fab) => {
      const searchMatch =
        fab?.fabName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab?.headquaters?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab?.headquaters?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fab?.headquaters?.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const filterMatch =
        (!filters.country || fab.headquaters?.country === filters.country) &&
        (!filters.state || fab.headquaters?.state === filters.state) &&
        (!filters.city || fab.headquaters?.city === filters.city);

      return searchMatch && filterMatch;
    });

    setFilteredFabricators(result);
  }, [searchQuery, filters, fabricators]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClick = (id) => {
    setSelectedFabricator(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedFabricator(null);
    setIsModalOpen(false);
  };

  // Columns for react-table
  const columns = useMemo(() => [
    {
      Header: "S.No",
      accessor: (row, i) => i + 1,
      id: "sno",
    },
    {
      Header: "Name",
      accessor: "fabName",
    },
    {
      Header: "City",
      accessor: (row) => row?.headquaters?.city,
      id: "city",
    },
    {
      Header: "State",
      accessor: (row) => row?.headquaters?.state,
      id: "state",
    },
    {
      Header: "Country",
      accessor: (row) => row?.headquaters?.country,
      id: "country",
    },
    {
      Header: "Actions",
      accessor: "id",
      Cell: ({ value }) => (
        <Button onClick={() => handleViewClick(value)}>View</Button>
      ),
      disableSortBy: true,
    },
  ], []);

  const tableInstance = useTable(
    { columns, data: filteredFabricators },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

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

        {/* Filter Section */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {["country", "state", "city"].map((filterKey) => (
            <select
              key={filterKey}
              name={filterKey}
              value={filters[filterKey]}
              onChange={handleFilterChange}
              className="border p-2 rounded"
            >
              <option value="">Filter by {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
              {Array.from(
                new Set(fabricators?.map((fab) => fab?.headquaters?.[filterKey]))
              )
                .filter(Boolean)
                .map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
            </select>
          ))}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-md border max-h-[75vh]">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-center"
        >
            <thead className="sticky top-0 bg-teal-200/80 z-10">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className="bg-teal-200/70">
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-2 py-1 cursor-pointer"
                    >
                      {column.render("Header")}
                      {column.isSorted && (column.isSortedDesc ? "" : "")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No Fabricators Found
                  </td>
                </tr>
              ) : (
                rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-blue-gray-100 border">
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="border px-2 py-1">
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

        {/* Modal */}
        {selectedFabricator && (
          <GetFabricator
            fabricatorId={selectedFabricator}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllFabricator;
