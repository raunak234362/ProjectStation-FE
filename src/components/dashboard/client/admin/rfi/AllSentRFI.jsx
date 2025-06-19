/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../index";
import Service from "../../../../../config/Service";
import GetSentRFI from "./GetSentRFI";

// Utility function to get nested values safely
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const AllSentRFI = () => {
  const [sentRfi, setSentRfi] = useState([]);
  const [filteredRFI, setFilteredRFI] = useState([]);
  const [selectedRFI, setSelectedRFI] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fabricator: "",
    project: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const fetchSentRfi = async () => {
    try {
      const response = await Service.sentRFI();
      setSentRfi(response?.data);
      setFilteredRFI(response?.data); // Set filteredRFI initially to all RFIs
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSentRfi();
  }, []);

  useEffect(() => {
    filterAndSort(sentRfi, searchTerm, filters);
  }, [sentRfi, searchTerm, filters, sortConfig]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filterAndSort = (data, term, filters) => {
    let filteredData = data || [];

    // Apply search filter
    if (term) {
      filteredData = filteredData.filter(
        (rfi) =>
          rfi.subject.toLowerCase().includes(term.toLowerCase()) ||
          rfi.recepients?.email.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Apply dropdown filters
    if (filters.fabricator) {
      filteredData = filteredData.filter(
        (rfi) =>
          rfi?.fabricator?.fabName.toLowerCase() ===
          filters.fabricator.toLowerCase()
      );
    }
    if (filters.project) {
      filteredData = filteredData.filter(
        (rfi) =>
          rfi?.project?.name?.toLowerCase() === filters.project.toLowerCase()
      );
    }
    if (filters.status) {
      filteredData = filteredData.filter(
        (rfi) => rfi.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key) || "";
        const bValue = getNestedValue(b, sortConfig.key) || "";

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }

        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    setFilteredRFI(filteredData);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleViewClick = async (rfiId) => {
    setSelectedRFI(rfiId);
    setIsModalOpen(true);
  };

  console.log(selectedRFI);

  const handleModalClose = async () => {
    setSelectedRFI(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        {/* Search and Filter Options */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search by subject or recipient"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-2 py-1 border border-gray-300 rounded "
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
          <select
            name="fabricator"
            value={filters.fabricator}
            onChange={handleFilterChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Filter by Fabricator</option>
            {[...new Set(sentRfi.map((rfi) => rfi?.fabricator?.fabName))].map(
              (name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              )
            )}
          </select>
          <select
            name="project"
            value={filters.project}
            onChange={handleFilterChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Filter by Project</option>
            {[
              ...new Set(
                sentRfi.map((rfi) => rfi?.project?.name)
              ),
            ].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Filter by Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse md:text-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th
                  className="px-2 py-1 text-left cursor-pointer"
                  onClick={() => handleSort("fabricator.fabName")}
                >
                  Fabricator Name
                </th>
                <th
                  className="px-2 py-1 text-left cursor-pointer"
                  onClick={() => handleSort("project.name")}
                >
                  Project Name
                </th>
                <th className="px-2 py-1">Subject/Remarks</th>
                <th className="px-2 py-1">Recipients</th>
                <th
                  className="px-2 py-1 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                </th>
                <th className="px-2 py-1">RFI Status</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRFI.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="7" className="text-center">
                    No sent RFI Found
                  </td>
                </tr>
              ) : (
                filteredRFI.map((rfi) => (
                  <tr key={rfi?.id} className="border hover:bg-blue-gray-100">
                    <td className="px-2 py-1 text-left border">
                      {rfi?.fabricator?.fabName || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi?.project?.name || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">{rfi?.subject}</td>
                    <td className="px-2 py-1 border">
                      {rfi?.recepients?.email}
                    </td>
                    <td className="px-2 py-1 border">{new Date(rfi?.date).toLocaleDateString()}</td>
                    <td className="px-2 py-1 border">
                      {rfi?.status ? "No Reply" : "Replied"}
                    </td>
                    <td className="px-2 py-1 border">
                      <Button onClick={() => handleViewClick(rfi.id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {selectedRFI && (
          <GetSentRFI
            rfiId={selectedRFI}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default AllSentRFI;
