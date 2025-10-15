/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Service from "../../../config/Service";
import AddTeam from "./AddTeam";
import GetTeamByID from "./GetTeamByID";
import GetEmployee from "../GetEmployee";
import Button from "../../fields/Button";
import DashboardHeader from "./DashboardHeader";
import TeamsList from "./TeamsList";
import TeamStatsCards from "./TeamStatsCards";
import MonthlyEfficiencyChart from "./MonthlyEfficiencyChart";
import TeamMembersTable from "./TeamMembersTable";
import TaskDistribution from "./TaskDistribution";

const TeamDashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamStats, setTeamStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [monthlyEfficiency, setMonthlyEfficiency] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    type: "all",
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    weekStart: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay())
    ).getTime(),
    weekEnd: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 6)
    ).getTime(),
    startMonth: 0,
    endMonth: new Date().getMonth(),
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).toISOString(),
    endDate: new Date().toISOString(),
  });

  const token = useSelector((state) => state?.auth?.token);
  const staffData = useSelector((state) => state?.userData?.staffData);
  const teamData = useSelector((state) => state?.userData?.teamData?.data);

  const handleAddTeam = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseAddTeam = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await Service.allteams(token);
        setTeams(response?.data);
        setFilteredTeams(response?.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [dispatch, token]);

  // Handle team selection
  useEffect(() => {
    if (!selectedTeam) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await Service.getTeamById(selectedTeam);

        if (response?.data) {
          setTeamMembers(response.data.members);
          calculateTeamStats(response.data.members);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [selectedTeam]);

  // Calculate team statistics
  const calculateTeamStats = async (members) => {
    try {
      const memberStats = await Promise.all(
        members.map(async (member) => {
          try {
            const response = await Service.getUsersStats(member.id);
            return response.data;
          } catch (error) {
            console.error(
              `Error fetching stats for member ${member.id}:`,
              error
            );
            return null;
          }
        })
      );

      const validStats = memberStats.filter((stat) => stat !== null);

      const filteredStats = validStats.map((memberStat) => {
        const filteredTasks = filterTasksByDateRange(
          memberStat.tasks,
          dateFilter
        );
        return {
          ...memberStat,
          tasks: filteredTasks,
        };
      });

      const totalAssignedHours = filteredStats.reduce((total, member) => {
        const memberAssignedHours = member.tasks.reduce((sum, task) => {
          return sum + parseDurationToMinutes(task.duration || "00:00:00") / 60;
        }, 0);
        return total + memberAssignedHours;
      }, 0);

      const totalWorkedHours = filteredStats.reduce((total, member) => {
        const memberWorkedHours = member.tasks
          .flatMap((task) => task.workingHourTask || [])
          .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0);
        return total + memberWorkedHours;
      }, 0);

      const totalTasks = filteredStats.reduce(
        (total, member) => total + member.tasks.length,
        0
      );

      const completedTasks = filteredStats.reduce((total, member) => {
        return (
          total +
          member.tasks.filter((task) => task.status === "COMPLETE").length
        );
      }, 0);

      const inProgressTasks = filteredStats.reduce((total, member) => {
        return (
          total +
          member.tasks.filter((task) => task.status === "IN_PROGRESS").length
        );
      }, 0);

      const efficiency =
        totalAssignedHours > 0
          ? Math.round((totalAssignedHours / totalWorkedHours) * 100)
          : 0;

      const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setTeamStats({
        totalAssignedHours: totalAssignedHours.toFixed(2),
        totalWorkedHours: totalWorkedHours.toFixed(2),
        totalTasks,
        completedTasks,
        inProgressTasks,
        efficiency,
        completionRate,
        memberStats: filteredStats,
      });

      calculateMonthlyEfficiency(filteredStats);
    } catch (error) {
      console.error("Error calculating team stats:", error);
    }
  };

  // Calculate monthly efficiency data
  const calculateMonthlyEfficiency = (memberStats) => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i, 1).toLocaleString("default", {
        month: "short",
      });
      monthlyData[i] = {
        month: monthName,
        assignedHours: 0,
        workedHours: 0,
        efficiency: 0,
      };
    }

    memberStats.forEach((member) => {
      member.tasks.forEach((task) => {
        const startDate = new Date(task.start_date || task.startDate);
        const month = startDate.getMonth();

        if (startDate.getFullYear() === currentYear) {
          const assignedHours =
            parseDurationToMinutes(task.duration || "00:00:00") / 60;
          monthlyData[month].assignedHours += assignedHours;

          const workedHours = (task.workingHourTask || []).reduce(
            (sum, entry) => sum + (entry.duration || 0) / 60,
            0
          );
          monthlyData[month].workedHours += workedHours;
        }
      });
    });

    Object.keys(monthlyData).forEach((month) => {
      const { assignedHours, workedHours } = monthlyData[month];
      monthlyData[month].efficiency =
        assignedHours > 0 ? Math.round((assignedHours / workedHours) * 100) : 0;
    });

    const monthlyEfficiencyData = Object.values(monthlyData);
    setMonthlyEfficiency(monthlyEfficiencyData);
  };

  // Filter tasks based on date range
  const filterTasksByDateRange = (tasks, filter) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    if (filter.type === "all") return tasks;

    return tasks.filter((task) => {
      const taskStartDate = new Date(task.start_date || task.startDate);
      const taskEndDate = new Date(task.due_date || task.endDate);

      switch (filter.type) {
        case "week":
          const weekStart = new Date(filter.weekStart);
          const weekEnd = new Date(filter.weekEnd);
          return taskStartDate <= weekEnd && taskEndDate >= weekStart;

        case "month":
          const monthStart = new Date(filter.year, filter.month, 1);
          const monthEnd = new Date(filter.year, filter.month + 1, 0);
          return taskStartDate <= monthEnd && taskEndDate >= monthStart;

        case "year":
          const yearStart = new Date(filter.year, 0, 1);
          const yearEnd = new Date(filter.year, 11, 31);
          return taskStartDate <= yearEnd && taskEndDate >= yearStart;

        case "range":
          const rangeStart = new Date(filter.year, filter.startMonth, 1);
          const rangeEnd = new Date(filter.year, filter.endMonth + 1, 0);
          return taskStartDate <= rangeEnd && taskEndDate >= rangeStart;

        case "dateRange":
          const startDate = new Date(filter.startDate);
          const endDate = new Date(filter.endDate);
          return taskStartDate <= endDate && taskEndDate >= startDate;

        case "specificDate":
          const specificDate = new Date(filter.date);
          return taskStartDate.toDateString() === specificDate.toDateString();

        default:
          return true;
      }
    });
  };

  // Helper function to parse duration string to minutes
  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0;
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 60 + minutes + Math.floor(seconds / 60);
  };

  // Handle search and filtering
  useEffect(() => {
    if (!teams) return;

    let filtered = [...teams];

    if (searchTerm) {
      filtered = filtered.filter((team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((team) =>
        filterStatus === "active" ? team.is_active : !team.is_active
      );
    }

    setFilteredTeams(filtered);
  }, [searchTerm, filterStatus, teams]);

  // Update team stats when date filter changes
  useEffect(() => {
    if (selectedTeam && teamMembers.length > 0) {
      calculateTeamStats(teamMembers);
    }
  }, [dateFilter, selectedTeam, teamMembers]);

  // Handle team selection
  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId);
  };

  // Handle member click to show detailed view
  const handleMemberClick = (memberId) => {
    setSelectedEmployee(memberId);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  // Get efficiency color class based on value
  const getEfficiencyColorClass = (efficiency) => {
    if (efficiency >= 90) return "bg-green-100 text-green-800";
    if (efficiency >= 70) return "bg-blue-100 text-blue-800";
    if (efficiency >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Prepare data for react-table
  const tableData = useMemo(() => {
    if (!teamMembers || !teamStats.memberStats) return [];

    return teamMembers.map((member, index) => {
      const memberStat = teamStats.memberStats?.find(
        (stat) => stat.id === member.id
      );

      const assignedHours =
        memberStat?.tasks
          .reduce(
            (sum, task) =>
              sum + parseDurationToMinutes(task.duration || "00:00:00") / 60,
            0
          )
          .toFixed(2) || "0.00";

      const workedHours =
        memberStat?.tasks
          .flatMap((task) => task.workingHourTask || [])
          .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0)
          .toFixed(2) || "0.00";

      const totalTasks = memberStat?.tasks.length || 0;
      const completedTasks =
        memberStat?.tasks.filter((task) => task.status === "COMPLETE").length ||
        0;

      const efficiency =
        assignedHours > 0 ? Math.round((assignedHours / workedHours) * 100) : 0;

      return {
        sno: index + 1,
        id: member.id,
        name: `${member.f_name} ${member.m_name || ""} ${member.l_name}`,
        role: member.role || "Member",
        assignedHours,
        workedHours,
        totalTasks,
        completedTasks,
        efficiency,
      };
    });
  }, [teamMembers, teamStats.memberStats]);

  const formatToHoursMinutes = (val) => {
    if (!val && val !== 0) return "00 hrs 00 mins";
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    return `${hrs.toString().padStart(2, "0")} hrs ${mins
      .toString()
      .padStart(2, "0")} mins`;
  };

  // Define columns for react-table
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (
          <div className="font-medium text-gray-900">{value}</div>
        ),
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {value}
          </span>
        ),
      },
      {
        Header: "Assigned Hours",
        accessor: "assignedHours",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {formatToHoursMinutes(value)}
          </span>
        ),
      },
      {
        Header: "Worked Hours",
        accessor: "workedHours",
        Cell: ({ value }) => (
          <span className="text-sm text-gray-500">
            {formatToHoursMinutes(value)}
          </span>
        ),
      },
      {
        Header: "Tasks",
        accessor: (row) => `${row.completedTasks}/${row.totalTasks}`,
        id: "tasks",
        Cell: ({ row }) => (
          <div>
            <div className="text-sm text-gray-900">
              {row.original.completedTasks}/{row.original.totalTasks}
            </div>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${
                    row.original.totalTasks > 0
                      ? (row.original.completedTasks /
                          row.original.totalTasks) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        ),
      },
      {
        Header: "Efficiency",
        accessor: "efficiency",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEfficiencyColorClass(
              value
            )}`}
          >
            {value}%
          </span>
        ),
      },
    ],
    []
  );

  const handleViewClick = async (teamId) => {
    try {
      setSelectedTeam(teamId);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const handleViewCloseModal = () => {
    setIsViewModalOpen(false);
  };

  return (
    <div className="bg-gray-50 overflow-y-auto p-4 md:p-6">
      <DashboardHeader
        onAddTeam={handleAddTeam}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {loading && !selectedTeam ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading teams data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <TeamsList
            filteredTeams={filteredTeams}
            selectedTeam={selectedTeam}
            onTeamSelect={handleTeamSelect}
          />

          {selectedTeam && (
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Loading team details...</p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Team:-{" "}
                      <span className="font-normal">
                        {teams?.find((t) => t.id === selectedTeam)?.name ||
                          "Team Details"}
                      </span>
                    </h2>
                    <Button
                      onClick={() => handleViewClick(selectedTeam)}
                      className="bg-teal-500"
                    >
                      View Details
                    </Button>
                  </div>

                  <TeamStatsCards teamStats={teamStats} />
                  <MonthlyEfficiencyChart
                    monthlyEfficiency={monthlyEfficiency}
                  />
                  <TeamMembersTable
                    tableData={tableData}
                    columns={columns}
                    onMemberClick={handleMemberClick}
                    formatToHoursMinutes={formatToHoursMinutes}
                    getEfficiencyColorClass={getEfficiencyColorClass}
                  />
                  <TaskDistribution teamStats={teamStats} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isViewModalOpen && (
        <GetTeamByID
          isOpen={isViewModalOpen}
          team={selectedTeam}
          onClose={handleViewCloseModal}
        />
      )}

      {selectedEmployee && (
        <GetEmployee employee={selectedEmployee} onClose={handleCloseModal} />
      )}

      {isModalOpen && <AddTeam onClose={handleCloseAddTeam} />}
    </div>
  );
};

export default TeamDashboard;
