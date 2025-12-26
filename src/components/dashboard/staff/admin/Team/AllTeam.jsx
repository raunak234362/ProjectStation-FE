import { useEffect, useMemo, useState } from "react";
import Service from "../../../../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { showTeam } from "../../../../../store/userSlice";
import { Button } from "../../../../index";
import GetTeamByID from "./GetTeamByID";
import DataTable from "../../../../DataTable";

const AllTeam = () => {
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teams = useSelector((state) => state?.userData?.teamData?.data || []);
  const dispatch = useDispatch();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await Service?.allteams(token);
      dispatch(showTeam(response?.data));
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleViewClick = (teamId) => {
    setSelectedTeam(teamId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl.no",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Team Name",
        accessorKey: "name",
      },
      {
        header: "Manager",
        accessorFn: (row) => row?.manager?.f_name || "No Manager Assigned",
        id: "manager",
        filterType: "select",
        filterOptions: [...new Set(teams.map(t => t.manager?.f_name).filter(Boolean))].sort().map(val => ({ label: val, value: val })),
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original.id)}>
            View/Add
          </Button>
        ),
      },
    ],
    [teams]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Teams</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={teams}
          searchPlaceholder="Search by team name or code"
        />
      )}

      {selectedTeam && (
        <GetTeamByID
          team={selectedTeam}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllTeam;
