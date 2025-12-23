import { useEffect, useState, useMemo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import Service from "../../../config/Service";
import { Button } from "../../index";
import EditJobStudy from "./EditJobStudy";
/* eslint-disable react/prop-types */
const AllJobStudy = ({ projectId }) => {
  const [jobStudy, setJobStudy] = useState([]);
  const [selectedJobStudy, setSelectedJobStudy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [qtyFilter, setQtyFilter] = useState({ min: "", max: "" });
  const [timeFilter, setTimeFilter] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");

  console.log(projectId);

  useEffect(() => {
    const fetchJobStudy = async () => {
      const response = await Service?.allJobStudy(projectId);
      setJobStudy(response);
      console.log(response);
    };
    fetchJobStudy();
  }, [projectId]);


  const handleOpenJobStudy = (jobStudyId) => {
    const job = jobStudy.find((j) => j.id === jobStudyId);
    setSelectedJobStudy(job);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedJobStudy(null);
  };

  // Filter and sort the job study data
  const filteredAndSortedJobStudy = useMemo(() => {
    let filtered = jobStudy.filter((job) => {
      // Search filter
      const matchesSearch = job.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Quantity filter
      const matchesQty =
        (!qtyFilter.min || job.QtyNo >= parseFloat(qtyFilter.min)) &&
        (!qtyFilter.max || job.QtyNo <= parseFloat(qtyFilter.max));

      // Time filter
      const matchesTime =
        (!timeFilter.min || job.execTime >= parseFloat(timeFilter.min)) &&
        (!timeFilter.max || job.execTime <= parseFloat(timeFilter.max));

      return matchesSearch && matchesQty && matchesTime;
    });

    // Sort the filtered data
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "description":
            aValue = a.description.toLowerCase();
            bValue = b.description.toLowerCase();
            break;
          case "quantity":
            aValue = parseFloat(a.QtyNo) || 0;
            bValue = parseFloat(b.QtyNo) || 0;
            break;
          case "time":
            aValue = parseFloat(a.execTime) || 0;
            bValue = parseFloat(b.execTime) || 0;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    }

    return filtered;
  }, [jobStudy, searchTerm, qtyFilter, timeFilter, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setQtyFilter({ min: "", max: "" });
    setTimeFilter({ min: "", max: "" });
    setSortBy("none");
    setSortOrder("asc");
  };

  return (
    <div>
      <div className="flex justify-center items-center font-bold mb-4">
        Job Study
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          {(searchTerm || qtyFilter.min || qtyFilter.max || timeFilter.min || timeFilter.max || sortBy !== "none") && (
            <Button
              onClick={clearFilters}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Quantity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={qtyFilter.min}
                  onChange={(e) => setQtyFilter({ ...qtyFilter, min: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={qtyFilter.max}
                  onChange={(e) => setQtyFilter({ ...qtyFilter, max: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Execution Time Range (Hr)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={timeFilter.min}
                  onChange={(e) => setTimeFilter({ ...timeFilter, min: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={timeFilter.max}
                  onChange={(e) => setTimeFilter({ ...timeFilter, max: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="description">Description</option>
                  <option value="time">Execution Time</option>
                  <option value="none">No Sorting</option>
                  <option value="quantity">Quantity</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedJobStudy.length} of {jobStudy.length} entries
        </div>
      </div>

      <div className="md:w-[80vw] overflow-x-auto w-full">
        <table className="w-full border-collapse border border-gray-600 text-center text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-600 px-2 py-1">Sl.No</th>
              <th className="border border-gray-600 px-2 py-1">
                Description of WBS
              </th>
              <th className="border border-gray-600 px-2 py-1">Qty. (No.)</th>
              <th className="border border-gray-600 px-2 py-1">
                Execution Time (Hr)
              </th>
              <th className="border border-gray-600 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedJobStudy.length > 0 ? (
              filteredAndSortedJobStudy.map((job, index) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border border-gray-600 px-2 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    {job.description}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    {job.QtyNo}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    {job.execTime}
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <Button onClick={() => handleOpenJobStudy(job.id)}>
                      Open
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-gray-600 px-4 py-8 text-center text-gray-500">
                  {jobStudy.length === 0 ? (
                    <div>
                      <div className="text-lg font-medium mb-2">No Job Study Data</div>
                      <div className="text-sm">No work breakdown structure data available for this project.</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-medium mb-2">No Results Found</div>
                      <div className="text-sm">Try adjusting your search or filter criteria.</div>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isEditing && selectedJobStudy && (
        <EditJobStudy jobStudy={selectedJobStudy} onClose={handleCloseEdit} />
      )}
    </div>
  );
};

export default AllJobStudy;
