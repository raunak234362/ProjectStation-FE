/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, User, Briefcase, Calendar as CalendarIcon, X, Clock, Target } from "lucide-react";

const TeamCalendar = ({ members, selectedTeamName }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("user"); // "user" or "project"
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [hoveredDate, setHoveredDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getLocalDateKey = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();

        const calendarDays = [];
        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }
        // Days of current month
        for (let i = 1; i <= days; i++) {
            calendarDays.push(new Date(year, month, i));
        }
        return calendarDays;
    }, [currentDate]);

    const calendarData = useMemo(() => {
        if (!members) return {};

        const data = {}; // { "YYYY-MM-DD": { tasks: [], projects: new Set() } }

        members.forEach(member => {
            if (viewMode === "user" && selectedMemberId && member.id !== selectedMemberId) return;

            (member.tasks || []).forEach(task => {
                const taskDateStr = task.start_date || task.startDate;
                if (!taskDateStr) return;

                const dateKey = getLocalDateKey(taskDateStr);

                if (!data[dateKey]) {
                    data[dateKey] = { tasks: [], projects: new Set(), members: new Set() };
                }

                data[dateKey].tasks.push({
                    ...task,
                    memberName: `${member.f_name} ${member.l_name}`
                });

                if (task.project?.name) {
                    data[dateKey].projects.add(task.project.name);
                }
                data[dateKey].members.add(`${member.f_name} ${member.l_name}`);
            });
        });

        return data;
    }, [members, viewMode, selectedMemberId]);

    const stats = useMemo(() => {
        let assigned = 0;
        let worked = 0;
        let leaves = 0;

        daysInMonth.forEach(date => {
            if (!date) return;
            const dateKey = getLocalDateKey(date);
            const dayData = calendarData[dateKey];
            const weekend = isWeekend(date);

            if (dayData && dayData.tasks.length > 0) {
                dayData.tasks.forEach(task => {
                    // Assigned hours
                    const [h = 0, m = 0, s = 0] = String(task.duration || "00:00:00").split(":").map(Number);
                    assigned += h + m / 60 + s / 3600;

                    // Worked hours (from the first entry of workingHourTask as per other components)
                    const workedMinutes = task.workingHourTask?.[0]?.duration || 0;
                    worked += workedMinutes / 60;
                });
            } else if (!weekend && viewMode === "user" && selectedMemberId) {
                leaves++;
            }
        });

        return {
            assigned: assigned.toFixed(1),
            worked: worked.toFixed(1),
            leaves
        };
    }, [daysInMonth, calendarData, viewMode, selectedMemberId]);


    const renderDayContent = (date) => {
        if (!date) return null;
        const dateKey = getLocalDateKey(date);
        const dayData = calendarData[dateKey];
        const weekend = isWeekend(date);

        if (viewMode === "user") {
            if (!selectedMemberId) {
                return <div className="text-[10px] text-gray-400 italic mt-1">Select a member</div>;
            }

            if (!dayData || dayData.tasks.length === 0) {
                return !weekend ? (
                    <div className="mt-1 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded border border-red-100">
                        On Leave
                    </div>
                ) : null;
            }

            return (
                <div className="mt-1 space-y-1 overflow-hidden">
                    {dayData.tasks.slice(0, 2).map((task, idx) => (
                        <div key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] truncate rounded border border-blue-100" title={task.name}>
                            {task.name}
                        </div>
                    ))}
                    {dayData.tasks.length > 2 && (
                        <div className="text-[9px] text-gray-500 pl-1">+{dayData.tasks.length - 2} more</div>
                    )}
                </div>
            );
        } else {
            // Project View
            if (!dayData || dayData.projects.size === 0) return null;

            return (
                <div className="mt-1 space-y-1 overflow-hidden">
                    {Array.from(dayData.projects).slice(0, 2).map((project, idx) => (
                        <div key={idx} className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] truncate rounded border border-teal-100" title={project}>
                            {project}
                        </div>
                    ))}
                    {dayData.projects.size > 2 && (
                        <div className="text-[9px] text-gray-500 pl-1">+{dayData.projects.size - 2} more</div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-teal-600" />
                        Team Calendar {selectedTeamName ? `- ${selectedTeamName}` : ""}
                    </h3>

                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                        <button
                            onClick={() => { setViewMode("user"); setSelectedDate(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "user" ? "bg-teal-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <User size={14} />
                            User View
                        </button>
                        <button
                            onClick={() => { setViewMode("project"); setSelectedDate(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "project" ? "bg-teal-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Briefcase size={14} />
                            Project View
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {viewMode === "user" && (
                        <select
                            value={selectedMemberId}
                            onChange={(e) => { setSelectedMemberId(e.target.value); setSelectedDate(null); }}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 outline-none min-w-[180px]"
                        >
                            <option value="">Select Team Member</option>
                            {members?.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.f_name} {member.l_name}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="px-4 pb-4 grid grid-cols-3 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                        <Clock size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Assigned Hours</div>
                        <div className="text-lg font-bold text-gray-800">{stats.assigned} <span className="text-xs font-normal text-gray-500">hrs</span></div>
                    </div>
                </div>
                <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-teal-500 rounded-lg text-white">
                        <Target size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Worked Hours</div>
                        <div className="text-lg font-bold text-gray-800">{stats.worked} <span className="text-xs font-normal text-gray-500">hrs</span></div>
                    </div>
                </div>
                <div className="bg-red-50/50 border border-red-100 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg text-white">
                        <CalendarIcon size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Leaves Taken</div>
                        <div className="text-lg font-bold text-gray-800">{stats.leaves} <span className="text-xs font-normal text-gray-500">days</span></div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    {daysOfWeek.map(day => (
                        <div key={day} className="bg-gray-50 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                    {daysInMonth.map((date, idx) => {
                        const dateKey = date ? getLocalDateKey(date) : null;
                        const dayData = dateKey ? calendarData[dateKey] : null;
                        const isToday = date && date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate === dateKey;
                        const isHovered = hoveredDate === dateKey;
                        const showTooltip = isSelected || (isHovered && !selectedDate);

                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => dateKey && setHoveredDate(dateKey)}
                                onMouseLeave={() => setHoveredDate(null)}
                                onClick={() => dateKey && setSelectedDate(isSelected ? null : dateKey)}
                                className={`bg-white min-h-[100px] p-2 transition-colors hover:bg-gray-50/80 relative cursor-pointer ${!date ? "bg-gray-50/30 pointer-events-none" : ""
                                    } ${isToday ? "ring-1 ring-inset ring-teal-500 bg-teal-50/20" : ""} ${isSelected ? "bg-teal-50/40 ring-2 ring-inset ring-teal-500" : ""}`}
                            >
                                {date && (
                                    <>
                                        <div className={`text-xs font-semibold ${isWeekend(date) ? "text-gray-400" : "text-gray-700"
                                            }`}>
                                            {date.getDate()}
                                        </div>
                                        {renderDayContent(date)}

                                        {/* Tooltip */}
                                        {showTooltip && dayData && (
                                            <div
                                                className={`absolute top-0 z-[100] w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 animate-in fade-in zoom-in duration-200 ${(idx % 7) >= 5 ? "right-full mr-2" : "left-full ml-2"
                                                    } ${isSelected ? "pointer-events-auto" : "pointer-events-none"}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2 flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="text-[9px] font-normal text-gray-500 uppercase tracking-wider">{viewMode} View</span>
                                                    </div>
                                                    {isSelected && (
                                                        <button
                                                            onClick={() => setSelectedDate(null)}
                                                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {viewMode === "user" ? (
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">Tasks ({dayData.tasks.length})</div>
                                                        {dayData.tasks.length > 0 ? (
                                                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                                                {dayData.tasks.map((task, tIdx) => (
                                                                    <div key={tIdx} className="text-sm text-gray-700 bg-blue-50/50 p-1.5 rounded border border-blue-100/50">
                                                                        <div className="font-medium truncate" title={task.name}>{task.name}</div>
                                                                        <div className="text-sm text-gray-500 mt-0.5 flex justify-between">
                                                                            <span className="truncate max-w-[150px]" title={task.project?.name || "No Project"}>{task.project?.name || "No Project"}</span>
                                                                            <span className="font-mono">{task.duration || "00:00:00"}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-[11px] text-gray-400 italic py-2 text-center">No tasks found</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">Projects ({dayData.projects.size})</div>
                                                        {dayData.projects.size > 0 ? (
                                                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                                                {Array.from(dayData.projects).map((project, pIdx) => (
                                                                    <div key={pIdx} className="text-[11px] text-gray-700 bg-teal-50/50 p-1.5 rounded border border-teal-100/50 font-medium truncate" title={project}>
                                                                        {project}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-[11px] text-gray-400 italic py-2 text-center">No projects found</div>
                                                        )}
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <div className="mt-3 pt-2 border-t border-gray-100 text-[9px] text-gray-400 text-center italic">
                                                        Click close or another day to dismiss
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex gap-6 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-50 border border-blue-100 rounded"></div>
                    <span>Tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-teal-50 border border-teal-100 rounded"></div>
                    <span>Projects</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-50 border border-red-100 rounded"></div>
                    <span>On Leave (Weekdays)</span>
                </div>
            </div>
        </div>
    );
};

export default TeamCalendar;
