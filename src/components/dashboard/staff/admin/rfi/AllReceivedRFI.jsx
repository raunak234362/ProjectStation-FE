/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Service from "../../../../../config/Service";
import { Button, Input } from "../../../../index";
import ViewRFI from "./ViewRFI";
import { set } from "react-hook-form";

// Utility function to get nested values safely
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};


const AllReceivedRFI = () => {
  const [RFI, setRFI] = useState([]);
  const [filteredRFI, setFilteredRFI] = useState(RFI);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fabricator: "",
    project: "",
    status: "",
  });
  const [selectedRFI, setSelectedRFI] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [click, setClick] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const fetchREceivedRfi = async () => {
    try {
      const rfi = await Service.inboxRFI();
      console.log(rfi.data);
      if (rfi) {
        setRFI(rfi.data);
      } else {
        console.log("RFI not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchREceivedRfi();
  }, []);

  useEffect(() => {
    filterAndSort(RFI, searchTerm, filters);
  }, [RFI, searchTerm, filters, sortConfig]);

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
          rfi.remarks.toLowerCase().includes(term.toLowerCase()) ||
          rfi.email.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Apply dropdown filters
    if (filters.fabricator) {
      filteredData = filteredData.filter(
        (rfi) =>
          rfi?.fabricator?.name.toLowerCase() ===
          filters.fabricator.toLowerCase()
      );
    }
    if (filters.project) {
      filteredData = filteredData.filter(
        (rfi) =>
          rfi?.fabricator?.project?.name?.toLowerCase() ===
          filters.project.toLowerCase() ||
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

  const handleViewClick = (rfiId) => {
    setClick(true);
    setSelectedRFI(rfiId);
  }
  console.log("-------------------------------->", selectedRFI);
  const handleModalClose = async () => {
    setSelectedRFI(null);
    setClick(false);
  };
  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="h-auto p-4 mt-5">
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search by remarks or recipient"
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
            {[...new Set(RFI.map((rfi) => rfi?.fabricator?.fabName))].sort().map(
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
                RFI.map(
                  (rfi) => rfi?.fabricator?.project?.name || rfi?.project?.name
                )
              ),
            ].sort().map((name) => (
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
            <option value="closed">Closed</option>
            <option value="open">Open</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse md:text-lg rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th className="px-2 py-1">Fabricator Name</th>
                <th className="px-2 py-1">Client Name</th>
                <th className="px-2 py-1">Project Name</th>
                <th className="px-2 py-1">Mail ID</th>
                <th className="px-2 py-1">Subject/Remarks</th>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">RFI Status</th>
                <th className="px-2 py-1">RFI Forward</th>
                <th className="px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {RFI?.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="9" className="text-center">
                    No received RFI Found
                  </td>
                </tr>
              ) : (
                RFI?.map((rfi) => (
                  <tr key={rfi?.id} className="border hover:bg-blue-gray-100">
                    <td className="px-2 py-1 text-left border">
                      {rfi?.fabricator.fabName || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-left border">
                      {rfi.recepients?.username || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi?.project.name || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi.recepients?.email || "N/A"}
                    </td>
                    <td className="px-2 py-1 border">
                      {rfi.subject || "No remarks"}
                    </td>
                    <td className="px-2 py-1 border">{rfi.date || "N/A"}</td>
                    <td className="px-2 py-1 border">
                      {rfi.status ? "No Reply" : "Replied"}
                    </td>
                    <td className="px-2 py-1 border">
                      <button className="px-2 py-1 bg-teal-300 rounded">
                        Forward
                      </button>
                    </td>
                    <td className="px-2 py-1 border">
                      <Button
                        className="px-2 py-1 bg-blue-300 rounded"
                        onClick={() => handleViewClick(rfi.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {click && (
        <ViewRFI
          rfiId={selectedRFI}
          // isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllReceivedRFI;
