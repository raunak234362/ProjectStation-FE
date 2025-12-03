/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
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

const MonthlyEfficiencyChart = ({ monthlyEfficiency, teamStats }) => {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });

  // Process real data from teamStats
  const realDailyData = useMemo(() => {
    if (!teamStats || !teamStats.memberStats) return [];

    const dailyMap = {};

    teamStats.memberStats.forEach((member) => {
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

    // Convert map to array and calculate efficiency
    const data = Object.keys(dailyMap)
      .map((date) => {
        const { assigned, worked } = dailyMap[date];
        const efficiency =
          assigned > 0 ? Math.round(((assigned / 60) / (worked / 60)) * 100) : 0;
          
        // Handle potential Infinity if worked is 0 but assigned > 0 (though logic above handles assigned > 0 check)
        // If worked is 0 and assigned > 0, efficiency is technically infinite/undefined. 
        // Based on TeamDashboard logic: totalAssignedHours > 0 ? (assigned/worked)*100 : 0.
        // If totalWorkedHours is 0, this is Infinity.
        // Let's cap or handle it. TeamDashboard logic:
        // efficiency = totalAssignedHours > 0 ? Math.round((totalAssignedHours / totalWorkedHours) * 100) : 0;
        // If totalWorkedHours is 0, this is Infinity.
        // Let's assume if worked is 0, efficiency is 0 or 100? Usually 0 if nothing done.
        // But if assigned is 5h and worked is 0, efficiency is undefined.
        // Let's stick to safe math.
        
        const safeEfficiency = worked > 0 ? Math.round((assigned / worked) * 100) : 0;

        return {
          date,
          efficiency: safeEfficiency,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return data;
  }, [teamStats]);

  const filteredData = useMemo(() => {
    const today = DateTime.now();
    let startDate;

    // Use realDailyData instead of mockDailyData
    const sourceData = realDailyData;

    if (selectedRange === "CUSTOM") {
      if (customDateRange.start && customDateRange.end) {
        const start = DateTime.fromISO(customDateRange.start);
        const end = DateTime.fromISO(customDateRange.end);
        
        return sourceData.filter((item) => {
          const itemDate = DateTime.fromISO(item.date);
          return itemDate >= start && itemDate <= end;
        });
      }
      return sourceData; // Fallback if dates aren't selected yet
    }

    switch (selectedRange) {
      case "1D":
        startDate = today.minus({ days: 1 });
        break;
      case "1W":
        startDate = today.minus({ days: 7 });
        break;
      case "1M":
        startDate = today.minus({ months: 1 });
        break;
      case "1Y":
        startDate = today.minus({ years: 1 });
        break;
      case "ALL":
      default:
        startDate = null;
    }

    if (!startDate) return sourceData;

    return sourceData.filter((item) => DateTime.fromISO(item.date) >= startDate);
  }, [selectedRange, customDateRange, realDailyData]);

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
          <p className="text-sm text-blue-600">{`Efficiency: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Efficiency Analytics</h3>

        <div className="flex flex-wrap items-center gap-2">
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
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
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
                label={{ value: "Efficiency %", angle: -90, position: "insideLeft", style: { fill: '#9ca3af' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#8884d8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEfficiency)"
                name="Efficiency"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEfficiencyChart;