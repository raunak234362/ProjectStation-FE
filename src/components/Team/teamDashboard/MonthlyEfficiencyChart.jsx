/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DateTime } from "luxon";
import { ChevronDown } from "lucide-react";

const MonthlyEfficiencyChart = ({ monthlyEfficiency, teamStats, teams, fetchTeamStats, selectedTeam }) => {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [comparedTeams, setComparedTeams] = useState([]); // Array of team IDs
  const [comparedTeamsData, setComparedTeamsData] = useState({}); // Map: teamId -> data array
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCompareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F"];

  // Helper to process member stats into daily efficiency
  const processMemberStats = useCallback((memberStats) => {
    if (!memberStats) return [];
    const dailyMap = {};

    memberStats.forEach((member) => {
      if (member.is_disabled) return;

      member.tasks.forEach((task) => {
        const dateStr = task.start_date || task.startDate;
        if (!dateStr) return;

        const date = DateTime.fromISO(dateStr).toISODate(); // YYYY-MM-DD

        if (!dailyMap[date]) {
          dailyMap[date] = { assigned: 0, worked: 0 };
        }

        // Parse assigned duration
        const [h, m] = (task.duration || "00:00:00").split(":").map(Number);
        const assignedMinutes = (h || 0) * 60 + (m || 0);
        dailyMap[date].assigned += assignedMinutes;

        // Parse worked duration
        const workedMinutes = (task.workingHourTask || []).reduce(
          (sum, entry) => sum + (entry.duration || 0),
          0
        );
        dailyMap[date].worked += workedMinutes;
      });
    });

    return Object.keys(dailyMap)
      .map((date) => {
        const { assigned, worked } = dailyMap[date];
        const safeEfficiency = worked > 0 ? Math.round((assigned / worked) * 100) : 0;
        return { date, efficiency: safeEfficiency };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  // Process real data for current team
  const realDailyData = useMemo(() => {
    return processMemberStats(teamStats?.memberStats);
  }, [teamStats, processMemberStats]);

  // Handle adding/removing teams to comparison
  const handleTeamToggle = async (teamId) => {
    if (comparedTeams.includes(teamId)) {
      setComparedTeams(prev => prev.filter(id => id !== teamId));
      setComparedTeamsData(prev => {
        const newData = { ...prev };
        delete newData[teamId];
        return newData;
      });
    } else {
      setComparedTeams(prev => [...prev, teamId]);
      // Fetch data if not already present
      if (!comparedTeamsData[teamId]) {
        const data = await fetchTeamStats(teamId);
        if (data && data.memberStats) {
          const processed = processMemberStats(data.memberStats);
          setComparedTeamsData(prev => ({ ...prev, [teamId]: processed }));
        }
      }
    }
  };

  const filteredData = useMemo(() => {
    const today = DateTime.now();
    const todayStr = today.toISODate();
    let startDate;

    // 1. Merge all data sources
    const mergedMap = {};
    const currentTeamName = teams?.find(t => t.id === selectedTeam)?.name || "Current Team";

    // Add current team data
    realDailyData.forEach(item => {
      if (item.date === todayStr) return; // Exclude today
      if (!mergedMap[item.date]) mergedMap[item.date] = { date: item.date };
      mergedMap[item.date][currentTeamName] = item.efficiency;
    });

    // Add compared teams data
    comparedTeams.forEach(teamId => {
      const teamName = teams?.find(t => t.id === teamId)?.name || `Team ${teamId}`;
      const teamData = comparedTeamsData[teamId] || [];

      teamData.forEach(item => {
        if (item.date === todayStr) return; // Exclude today
        if (!mergedMap[item.date]) mergedMap[item.date] = { date: item.date };
        mergedMap[item.date][teamName] = item.efficiency;
      });
    });

    let sourceData = Object.values(mergedMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. Filter by date range
    if (selectedRange === "CUSTOM") {
      if (customDateRange.start && customDateRange.end) {
        const start = DateTime.fromISO(customDateRange.start);
        const end = DateTime.fromISO(customDateRange.end);

        return sourceData.filter((item) => {
          const itemDate = DateTime.fromISO(item.date);
          return itemDate >= start && itemDate <= end;
        });
      }
      return sourceData;
    }

    switch (selectedRange) {
      case "1D": startDate = today.minus({ days: 1 }); break;
      case "1W": startDate = today.minus({ days: 7 }); break;
      case "1M": startDate = today.minus({ months: 1 }); break;
      case "1Y": startDate = today.minus({ years: 1 }); break;
      case "ALL": default: startDate = null;
    }

    if (!startDate) return sourceData;

    return sourceData.filter((item) => DateTime.fromISO(item.date) >= startDate);
  }, [selectedRange, customDateRange, realDailyData, comparedTeams, comparedTeamsData, teams, selectedTeam]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range !== "CUSTOM") {
      setCustomDateRange({ start: "", end: "" });
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({ ...prev, [name]: value }));
    setSelectedRange("CUSTOM");
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="text-sm font-semibold text-gray-700">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentTeamName = teams?.find(t => t.id === selectedTeam)?.name || "Current Team";

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Efficiency Analytics</h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Team Comparison Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCompareOpen(!isCompareOpen)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${isCompareOpen || comparedTeams.length > 0
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
            >
              Compare Teams {comparedTeams.length > 0 ? `(${comparedTeams.length})` : "+"}
              <ChevronDown className={`w-3 h-3 transition-transform ${isCompareOpen ? "rotate-180" : ""}`} />
            </button>

            {isCompareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-2 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-100 pb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Teams</span>
                  {comparedTeams.length > 0 && (
                    <button
                      onClick={() => {
                        setComparedTeams([]);
                        setComparedTeamsData({});
                      }}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  {teams?.filter(t => t.id !== selectedTeam).length > 0 ? (
                    teams?.filter(t => t.id !== selectedTeam).map(team => (
                      <label key={team.id} className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-md cursor-pointer transition-colors group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={comparedTeams.includes(team.id)}
                            onChange={() => handleTeamToggle(team.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm transition-colors ${comparedTeams.includes(team.id) ? "text-blue-700 font-medium" : "text-gray-700 group-hover:text-blue-600"}`}>
                          {team.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4 italic">No other teams available</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Time Range Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedRange === range
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="start"
              value={customDateRange.start}
              onChange={handleDateChange}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              name="end"
              value={customDateRange.end}
              onChange={handleDateChange}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
                {comparedTeams.map((teamId, index) => (
                  <linearGradient key={teamId} id={`color-${teamId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                width={60}
                label={{
                  value: "Efficiency %",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  style: { fill: '#9ca3af', textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Current Team Area */}
              <Area
                type="monotone"
                dataKey={currentTeamName}
                stroke={COLORS[0]}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEfficiency)"
                name={currentTeamName}
                animationDuration={1000}
                connectNulls
              />

              {/* Compared Teams Areas */}
              {comparedTeams.map((teamId, index) => {
                const teamName = teams?.find(t => t.id === teamId)?.name || `Team ${teamId}`;
                return (
                  <Area
                    key={teamId}
                    type="monotone"
                    dataKey={teamName}
                    stroke={COLORS[(index + 1) % COLORS.length]}
                    strokeWidth={2}
                    fillOpacity={0.3}
                    fill={`url(#color-${teamId})`}
                    name={teamName}
                    animationDuration={1000}
                    connectNulls
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEfficiencyChart;