/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Service from "../../../../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { showTeam } from "../../../../../store/userSlice";
import { Button } from "../../../../index";
import GetTeamByID from "./GetTeamByID";
const AllTeam = () => {
  const token = sessionStorage.getItem("token");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");

  const teams = useSelector((state) => state?.userData?.teamData?.data);
  const dispatch = useDispatch();
  const fetchTeams = async () => {
    try {
      const response = await Service?.allteams(token);
      setFilteredTeams(response?.data);
      dispatch(showTeam(response?.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...setFilteredTeams].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTeams(sortedData);
  };

  const handleViewClick = async (teamId) => {
    try {
      setSelectedTeam(teamId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  // Search function
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = teams.filter(
      (team) =>
        team?.name?.toLowerCase().includes(value) ||
        team?.code?.toLowerCase().includes(value)
    );
    setFilteredTeams(filtered);
  };

  return (
    <div>
      <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
        <div className="p-4 mt-5">
          {/* Search Bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by department name or code"
            className="w-full px-2 py-2 mb-4 border rounded md:w-1/3"
          />
        </div>

        <div className="mx-3 mt-2 overflow-x-auto bg-white">
          {/* Making the table scrollable horizontally on small screens */}
          <table className="w-full text-xs text-center border-collapse h-fit md:text-xl rounded-xl">
            <thead>
              <tr className="bg-teal-200/70">
                <th
                  className="px-5 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  S.no
                </th>
                <th
                  className="px-5 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Team Name
                </th>
                <th
                  className="px-5 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("manager")}
                >
                  Manager
                </th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams?.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan="4" className="text-center">
                    No Team Found
                  </td>
                </tr>
              ) : (
                filteredTeams?.map((team, index) => (
                  
                  <tr key={team.id} className="border hover:bg-blue-gray-100">
                    <td className="px-5 py-2 text-left border">{index + 1}</td>
                    <td className="px-5 py-2 text-left border">{team?.name}</td>
                    <td className="px-5 py-2 text-left border">
                      {team?.manager?.f_name || "No Manager Assigned"}
                    </td>
                    <td className="flex items-center justify-center px-2 py-1 border">
                      <Button onClick={() => handleViewClick(team.id)}>
                        View/Add
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {selectedTeam && (
          <GetTeamByID
            team={selectedTeam}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default AllTeam;
