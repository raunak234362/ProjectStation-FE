/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { X, FileDown, ChevronLeft, ChevronRight } from "lucide-react";

const MonthlyWorkReportModal = ({ isOpen, onClose, members }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const formatMinutesToHHMM = (totalMinutes) => {
        if (!totalMinutes || totalMinutes <= 0) return "00:00";
        const hrs = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    };

    const parseDurationToMinutes = (duration) => {
        if (!duration) return 0;
        if (typeof duration === "number") return duration;
        if (typeof duration === "string" && !duration.includes(":")) {
            return parseFloat(duration);
        }
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 60 + (minutes || 0) + Math.floor((seconds || 0) / 60);
    };

    const reportData = useMemo(() => {
        if (!members || members.length === 0) return [];

        return members.map((member) => {
            const tasks = member.tasks || [];
            const dailyData = {}; // { [day]: { worked: mins, assigned: mins } }

            tasks.forEach((task) => {
                const taskDateStr = task.start_date || task.startDate;
                if (!taskDateStr) return;

                const taskDate = new Date(taskDateStr);
                if (taskDate.getMonth() === month && taskDate.getFullYear() === year) {
                    const day = taskDate.getDate();
                    if (!dailyData[day]) dailyData[day] = { worked: 0, assigned: 0 };

                    const workedMinutes = task.workingHourTask?.[0]?.duration || 0;
                    dailyData[day].worked += Number(workedMinutes);

                    const assignedMinutes = parseDurationToMinutes(task.duration || "00:00:00");
                    dailyData[day].assigned += assignedMinutes;
                }
            });

            const row = {
                userName: `${member.f_name} ${member.l_name}`.trim(),
                daily: {},
                totalWorkedMinutes: 0,
                totalAssignedMinutes: 0
            };

            daysArray.forEach(day => {
                const data = dailyData[day] || { worked: 0, assigned: 0 };
                row.daily[day] = {
                    worked: formatMinutesToHHMM(data.worked),
                    assigned: formatMinutesToHHMM(data.assigned),
                    hasData: data.worked > 0 || data.assigned > 0
                };
                row.totalWorkedMinutes += data.worked;
                row.totalAssignedMinutes += data.assigned;
            });

            row.totalWorkedHours = formatMinutesToHHMM(row.totalWorkedMinutes);
            row.totalAssignedHours = formatMinutesToHHMM(row.totalAssignedMinutes);
            return row;
        });
    }, [members, month, year, daysArray]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const exportCSV = () => {
        const headers = ["User Name", ...daysArray.map(d => `${d}/${month + 1}`), "Total (W/A)"];
        const csvContent = [
            headers.join(","),
            ...reportData.map(row => {
                const cells = [
                    row.userName,
                    ...daysArray.map(d => `${row.daily[d].worked}\n${row.daily[d].assigned}`),
                    `${row.totalWorkedHours}\n${row.totalAssignedHours}`
                ];
                return cells.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `monthly_work_report_${year}_${month + 1}.csv`;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-[95vw] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Monthly Work Report (Worked / Assigned)</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-md transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="px-4 font-medium min-w-[120px] text-center">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-auto p-4 flex-1">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="sticky left-0 bg-gray-50 px-4 py-2 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    User Name
                                </th>
                                {daysArray.map(day => (
                                    <th key={day} className="px-1 py-2 border border-gray-200 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                                        {day}
                                    </th>
                                ))}
                                <th className="px-4 py-2 border border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Total (W/A)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.length > 0 ? (
                                reportData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="sticky left-0 bg-white px-4 py-2 border border-gray-200 text-sm font-medium text-gray-900 truncate" title={row.userName}>
                                            {row.userName}
                                        </td>
                                        {daysArray.map(day => (
                                            <td key={day} className={`px-1 py-2 border border-gray-200 text-center text-[10px] ${row.daily[day].hasData ? 'bg-blue-50' : ''}`}>
                                                <div className="flex flex-col">
                                                    <span className={row.daily[day].worked !== "00:00" ? "text-blue-700 font-bold" : "text-gray-400"}>
                                                        {row.daily[day].worked}
                                                    </span>
                                                    <div className="h-[1px] bg-gray-200 my-0.5"></div>
                                                    <span className={row.daily[day].assigned !== "00:00" ? "text-gray-600 font-medium" : "text-gray-300"}>
                                                        {row.daily[day].assigned}
                                                    </span>
                                                </div>
                                            </td>
                                        ))}
                                        <td className="px-4 py-2 border border-gray-200 text-center text-xs bg-gray-50">
                                            <div className="flex flex-col font-bold">
                                                <span className="text-blue-800">{row.totalWorkedHours}</span>
                                                <div className="h-[1px] bg-gray-300 my-0.5"></div>
                                                <span className="text-gray-700">{row.totalAssignedHours}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={daysInMonth + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No data available for the selected month
                                    </td>
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

export default MonthlyWorkReportModal;
