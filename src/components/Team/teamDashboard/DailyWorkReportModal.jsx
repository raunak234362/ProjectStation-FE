/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import { X, FileDown } from "lucide-react";
import DateFilter from "../../../util/DateFilter";

// Shows daily worked hours per user, filtered by DateFilter
// Status color rules:
// - < 8 hrs: red
// - = 8 hrs: green
// - > 8 hrs: blue
const DailyWorkReportModal = ({ isOpen, onClose, members, dateFilter: parentDateFilter }) => {
    const [dateFilter, setDateFilter] = useState({
        type: "week", // Default to current week
        weekStart: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).getTime(),
        weekEnd: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).getTime(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        startMonth: new Date().getMonth(),
        endMonth: new Date().getMonth(),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
    });

    // Sync with parent DateFilter when provided (and when modal opens)
    useEffect(() => {
        if (parentDateFilter && isOpen) {
            setDateFilter(parentDateFilter);
        }
    }, [parentDateFilter, isOpen]);

    const reportData = useMemo(() => {
        if (!members || members.length === 0) return [];

        const data = [];

        const includeByFilter = (dateInput) => {
            const entryDate = new Date(dateInput);
            switch (dateFilter.type) {
                case "all":
                    return true;
                case "specificDate":
                    if (dateFilter.date) {
                        const dd = new Date(dateFilter.date);
                        return entryDate.toDateString() === dd.toDateString();
                    }
                    return false;
                case "week":
                    return (
                        dateFilter.weekStart && dateFilter.weekEnd &&
                        entryDate.getTime() >= dateFilter.weekStart && entryDate.getTime() <= dateFilter.weekEnd
                    );
                case "month":
                    return entryDate.getMonth() === dateFilter.month && entryDate.getFullYear() === dateFilter.year;
                case "year":
                    return entryDate.getFullYear() === dateFilter.year;
                case "range": {
                    const startDate = new Date(dateFilter.year, dateFilter.startMonth, 1);
                    const endDate = new Date(dateFilter.year, dateFilter.endMonth + 1, 0);
                    return entryDate.getTime() >= startDate.getTime() && entryDate.getTime() <= endDate.getTime();
                }
                case "dateRange":
                    if (dateFilter.startDate && dateFilter.endDate) {
                        const start = new Date(dateFilter.startDate);
                        const end = new Date(dateFilter.endDate);
                        return entryDate.getTime() >= start.getTime() && entryDate.getTime() <= end.getTime();
                    }
                    return false;
                default:
                    return true;
            }
        };

        members.forEach((member) => {
            const tasks = member.tasks || [];
            const daily = {}; // { [dateKey]: { worked: minutes, assigned: minutes } }

            // Worked minutes by day from workingHourTask entries
            tasks.forEach((task) => {
                (task.workingHourTask || []).forEach((entry) => {
                    if (!entry?.date) return;
                    if (!includeByFilter(entry.date)) return;
                    const entryDate = new Date(entry.date);
                    const dateKey = entryDate.toLocaleDateString();
                    if (!daily[dateKey]) daily[dateKey] = { worked: 0, assigned: 0 };
                    daily[dateKey].worked += Number(entry.duration || 0);
                });
            });

            // Assigned minutes by day based on task start date
            tasks.forEach((task) => {
                const taskDateStr = task.start_date || task.startDate;
                if (!taskDateStr) return;
                if (!includeByFilter(taskDateStr)) return;
                const taskDate = new Date(taskDateStr);
                const dateKey = taskDate.toLocaleDateString();
                if (!daily[dateKey]) daily[dateKey] = { worked: 0, assigned: 0 };
                const [h = 0, m = 0, s = 0] = String(task.duration || "00:00:00").split(":").map(Number);
                const minutes = h * 60 + m + Math.floor(s / 60);
                daily[dateKey].assigned += minutes;
            });

            // Flatten
            Object.keys(daily).forEach((date) => {
                const workedMinutes = daily[date].worked;
                const assignedMinutes = daily[date].assigned;
                const workedHrsFloat = workedMinutes / 60;
                const workedHours = workedHrsFloat.toFixed(2);
                const assignedHours = (assignedMinutes / 60).toFixed(2);

                let status = "Perfect";
                let colorClass = "bg-green-100 text-green-800";

                // Compare worked vs assigned with a small threshold for floating point
                const diff = workedHrsFloat - parseFloat(assignedHours);

                if (diff < -0.1) {
                    status = "Less";
                    colorClass = "bg-red-100 text-red-800";
                } else if (diff > 0.1) {
                    status = "More";
                    colorClass = "bg-blue-100 text-blue-800";
                }
                // Else diff is within +/- 0.1, considered Perfect (Green)

                data.push({
                    date,
                    userName: `${member.f_name} ${member.l_name}`.trim(),
                    workedHours,
                    assignedHours,
                    status,
                    colorClass,
                });
            });
        });

        // Sort by Date then Name
        return data.sort((a, b) => new Date(a.date) - new Date(b.date) || a.userName.localeCompare(b.userName));

    }, [members, dateFilter]);

    const exportCSV = () => {
        const headers = ["Date", "User Name", "Worked Hours", "Assigned Hours", "Status"];
        const csvContent = [
            headers.join(","),
            ...reportData.map(row => [row.date, row.userName, row.workedHours, row.assignedHours, row.status].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `daily_work_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Daily Work Report</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
                    <div className="text-sm text-gray-500">
                        Showing {reportData.length} records
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-auto p-4 flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worked Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.length > 0 ? (
                                reportData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.workedHours} hrs</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.assignedHours} hrs</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.colorClass}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No data available for the selected range</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={reportData.length === 0}
                    >
                        <FileDown size={16} />
                        Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyWorkReportModal;
