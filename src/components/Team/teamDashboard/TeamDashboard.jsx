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
import ProjectsSection from "../utils/ProjectSection";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import DailyWorkReportModal from "./DailyWorkReportModal";

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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [allMemberStats, setAllMemberStats] = useState([]); // Store raw unfiltered stats
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

  // Fetch team stats (Reusable)
  const fetchTeamStats = useCallback(
    async (teamId) => {
      try {
        const response = await Service.getTeamById(teamId);
        if (!response?.data) return null;

        // ✅ Filter out disabled users
        const activeMembers = response.data.members.filter(
          (member) => !member.is_disabled
        );

        const memberStats = await Promise.all(
          activeMembers.map(async (member) => {
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

        // Return raw data, filtering will be handled separately
        return { members: activeMembers, memberStats: validStats };
      } catch (error) {
        console.error("Error fetching team stats:", error);
        return null;
      }
    },
    []
  );

  // Handle team selection
  useEffect(() => {
    if (!selectedTeam) return;

    const loadTeamData = async () => {
      setLoading(true);
      const data = await fetchTeamStats(selectedTeam);
      console.log(data);
      if (data) {
        setTeamMembers(data.members);
        setAllMemberStats(data.memberStats);
        // Initial calculation will happen in the new useEffect below
      }
      setLoading(false);
    };

    loadTeamData();
  }, [selectedTeam, fetchTeamStats]);
  // Apply filters and calculate stats whenever allMemberStats or dateFilter changes
  useEffect(() => {
    if (!allMemberStats || allMemberStats.length === 0) return;

    const filteredStats = allMemberStats.map((memberStat) => {
      const filteredTasks = filterTasksByDateRange(
        memberStat.tasks || [],
        dateFilter
      );
      return {
        ...memberStat,
        tasks: filteredTasks,
      };
    });

    calculateTeamSummary(filteredStats);

  }, [allMemberStats, dateFilter]);

  // Apply filters and calculate stats whenever allMemberStats or dateFilter changes
  useEffect(() => {
    if (!allMemberStats || allMemberStats.length === 0) return;

    const filteredStats = allMemberStats.map((memberStat) => {
      const filteredTasks = filterTasksByDateRange(
        memberStat.tasks || [],
        dateFilter
      );
      return {
        ...memberStat,
        tasks: filteredTasks,
      };
    });

    calculateTeamSummary(filteredStats);

  }, [allMemberStats, dateFilter]);

  // Calculate team statistics summary
  const calculateTeamSummary = (filteredStats) => {
    try {
      const allFilteredTasks = filteredStats.flatMap((m) => m.tasks || []);

      const uniqueProjects = [];
      const projectIds = new Set();
      for (const t of allFilteredTasks) {
        const p = t?.project;
        if (p && p.id != null && !projectIds.has(p.id)) {
          projectIds.add(p.id);
          uniqueProjects.push(p);
        }
      }

      const totalAssignedHours = filteredStats.reduce((total, member) => {
        const memberAssignedHours = member.tasks.reduce(
          (sum, task) =>
            sum + parseDurationToMinutes(task.duration || "00:00:00") / 60,
          0
        );
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

      const projectCount = uniqueProjects.length;

      const completedTasks = filteredStats.reduce(
        (total, member) =>
          total +
          member.tasks.filter((task) => task.status === "COMPLETE").length,
        0
      );

      const inProgressTasks = filteredStats.reduce(
        (total, member) =>
          total +
          member.tasks.filter((task) => task.status === "IN_PROGRESS").length,
        0
      );

      // Efficiency Calculation: Only for COMPLETED tasks
      const completedTasksList = filteredStats.flatMap((m) =>
        m.tasks.filter((task) => task.status === "COMPLETE")
      );

      const efficiencyAssignedHours = completedTasksList.reduce(
        (sum, task) =>
          sum + parseDurationToMinutes(task.duration || "00:00:00") / 60,
        0
      );

      const efficiencyWorkedHours = completedTasksList
        .flatMap((task) => task.workingHourTask || [])
        .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0);

      const hoursEfficiency =
        efficiencyWorkedHours > 0
          ? efficiencyAssignedHours / efficiencyWorkedHours
          : 0;

      // For completed tasks, task efficiency is effectively 100% relative to themselves,
      // but the original logic combined "Hours Efficiency" and "Task Efficiency".
      // "Task Efficiency" was (Completed / Total).
      // If we strictly follow "calculate the efficiency of only completed task",
      // it likely means we only check how well they did on the tasks they finished (Time based).
      // So we should rely primarily on Hours Efficiency for the "Efficiency" metric.

      let efficiency = 0;
      if (efficiencyWorkedHours > 0) {
        efficiency = Math.round(hoursEfficiency * 100);
      }

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
        projects: uniqueProjects,
        projectCount,
      });

      calculateMonthlyEfficiency(filteredStats);
    } catch (error) {
      console.error("Error calculating team stats:", error);
    }
  };

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



  const handleTeamSelect = (teamId) => setSelectedTeam(teamId);
  const handleMemberClick = (memberId) => setSelectedEmployee(memberId);
  const handleCloseModal = () => setSelectedEmployee(null);

  const getEfficiencyColorClass = (efficiency) => {
    if (efficiency >= 90) return "bg-green-100 text-green-800";
    if (efficiency >= 70) return "bg-blue-100 text-blue-800";
    if (efficiency >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const tableData = useMemo(() => {
    if (!teamMembers || !teamStats.memberStats) return [];

    return teamMembers
      .filter((member) => !member.is_disabled)
      .map((member, index) => {
        const memberStat = teamStats.memberStats?.find(
          (stat) => stat.id === member.id
        );

        const assignedHours =
          memberStat?.tasks
            .reduce(
              (sum, task) =>
                sum + parseDurationToMinutes(task.duration || "00:00:00") / 60,
              0
            ) || 0;

        const workedHours =
          memberStat?.tasks
            .flatMap((task) => task.workingHourTask || [])
            .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0) || 0;

        const totalTasks = memberStat?.tasks.length || 0;
        const completedTasks =
          memberStat?.tasks.filter((task) => task.status === "COMPLETE" || task.status === "USER_FAULT" || task.status === "VALIDATE_COMPLETED").length ||
          0;

        // Efficiency: Only for COMPLETED tasks
        const memberCompletedTasks = memberStat?.tasks.filter(
          (task) => task.status === "COMPLETE"
        );

        const efficiencyAssigned =
          memberCompletedTasks?.reduce(
            (sum, task) =>
              sum + parseDurationToMinutes(task.duration || "00:00:00") / 60,
            0
          ) || 0;

        const efficiencyWorked =
          memberCompletedTasks
            ?.flatMap((task) => task.workingHourTask || [])
            .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0) || 0;

        const hoursEfficiency =
          efficiencyWorked > 0 ? efficiencyAssigned / efficiencyWorked : 0;

        let efficiency = 0;
        if (efficiencyWorked > 0) {
          efficiency = Math.round(hoursEfficiency * 100);
        }

        return {
          sno: index + 1,
          id: member.id,
          name: `${member.f_name} ${member.m_name || ""} ${member.l_name}`,
          role: member.role || "Member",
          assignedHours: assignedHours.toFixed(2),
          workedHours: workedHours.toFixed(2),
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
                  width: `${row.original.totalTasks > 0
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

  const handleViewCloseModal = () => setIsViewModalOpen(false);

  const generateGlobalPDF = () => {
    try {
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();

      // Title
      doc.setFontSize(20);
      doc.text("Team Performance Report", 14, 22);
      doc.setFontSize(11);
      doc.text(`Date: ${today}`, 14, 30);
      doc.text(`Team: ${teams?.find((t) => t.id === selectedTeam)?.name || "All Teams"}`, 14, 36);

      // Summary Section
      doc.setFontSize(14);
      doc.text("Executive Summary", 14, 50);

      const summaryData = [
        ["Total Assigned Hours", teamStats?.totalAssignedHours || "0"],
        ["Total Worked Hours", teamStats?.totalWorkedHours || "0"],
        ["Overall Efficiency", `${teamStats?.efficiency || 0}%`],
        ["Completion Rate", `${teamStats?.completionRate || 0}%`],
        ["Total Tasks", teamStats?.totalTasks || "0"],
        ["Completed Tasks", teamStats?.completedTasks || "0"],
        ["In Progress Tasks", teamStats?.inProgressTasks || "0"],
      ];

      autoTable(doc, {
        startY: 55,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
        headStyles: { fillColor: [66, 133, 244] },
      });

      // Projects Section
      let finalY = doc.lastAutoTable.finalY + 15;
      doc.text("Active Projects", 14, finalY);

      const projectsData = (teamStats?.projects || []).map((p, index) => [
        index + 1,
        p.name,
        p.status || "N/A",
        // Add more project details if available in p object
      ]);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["#", "Project Name", "Status"]],
        body: projectsData.length ? projectsData : [["-", "No active projects", "-"]],
        theme: "striped",
        headStyles: { fillColor: [66, 133, 244] },
      });

      // Employees Section
      finalY = doc.lastAutoTable.finalY + 15;
      doc.text("Team Member Performance", 14, finalY);

      const employeeData = (teamStats?.memberStats || []).map((m, index) => {
        // Re-calculate or use pre-calculated if available. 
        // Using logic similar to tableData useMemo for consistency
        const assignedHrs = m.tasks.reduce((sum, task) => {
          const [h, min] = (task.duration || "0:0").split(":").map(Number);
          return sum + h + (min / 60);
        }, 0).toFixed(2);

        const workedHrs = m.tasks.flatMap(t => t.workingHourTask || []).reduce((sum, w) => sum + (w.duration || 0) / 60, 0).toFixed(2);

        const eff = assignedHrs > 0 ? Math.round((assignedHrs / workedHrs) * 100) : 0;
        const completed = m.tasks.filter(t => t.status === "COMPLETE").length;
        const total = m.tasks.length;

        return [
          index + 1,
          `${m.f_name} ${m.l_name}`,
          m.role || "Member",
          `${assignedHrs} hrs`,
          `${workedHrs} hrs`,
          `${eff}%`,
          `${completed}/${total}`
        ];
      });

      autoTable(doc, {
        startY: finalY + 5,
        head: [["#", "Name", "Role", "Assigned", "Worked", "Efficiency", "Tasks (C/T)"]],
        body: employeeData.length ? employeeData : [["-", "No members found", "-", "-", "-", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: [66, 133, 244] },
      });

      doc.save(`Team_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 overflow-y-auto p-4 md:p-6">
      <DashboardHeader
        onAddTeam={handleAddTeam}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onGenerateReport={generateGlobalPDF}
        onDailyReport={() => setIsReportModalOpen(true)}
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
                      Team:{" "}
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
                    teamStats={teamStats}
                    teams={teams}
                    fetchTeamStats={fetchTeamStats}
                    selectedTeam={selectedTeam}
                  />
                  <TeamMembersTable
                    tableData={tableData}
                    columns={columns}
                    onMemberClick={handleMemberClick}
                    formatToHoursMinutes={formatToHoursMinutes}
                    getEfficiencyColorClass={getEfficiencyColorClass}
                  />
                  <ProjectsSection projects={teamStats?.projects || []} />
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

      <DailyWorkReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        members={allMemberStats}
        dateFilter={dateFilter}
      />
    </div>
  );
};

export default TeamDashboard;

const parseDurationToMinutes = (duration) => {
  if (!duration) return 0;
  if (typeof duration === "number") return duration; // Assume minutes if number
  if (typeof duration === "string" && !duration.includes(":")) {
    return parseFloat(duration); // Assume stringified number is minutes
  }
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 60 + minutes + Math.floor((seconds || 0) / 60);
};

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
