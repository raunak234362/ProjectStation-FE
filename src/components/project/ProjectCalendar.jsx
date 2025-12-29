/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Briefcase, Users, Calendar as CalendarIcon, X } from "lucide-react";

const ProjectCalendar = ({ projects, allTasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("project"); // "project" or "user"
    const [selectedProjectId, setSelectedProjectId] = useState("");
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
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= days; i++) {
            calendarDays.push(new Date(year, month, i));
        }
        return calendarDays;
    }, [currentDate]);

    const calendarData = useMemo(() => {
        if (!allTasks) return {};

        const data = {}; // { "YYYY-MM-DD": { tasks: [], members: new Set() } }

        allTasks.forEach(task => {
            if (viewMode === "project" && selectedProjectId && task.project_id !== selectedProjectId) return;

            const taskDateStr = task.start_date || task.startDate;
            if (!taskDateStr) return;

            const dateKey = getLocalDateKey(taskDateStr);

            if (!data[dateKey]) {
                data[dateKey] = { tasks: [], members: new Set(), projectNames: new Set() };
            }

            data[dateKey].tasks.push(task);
            if (task.user?.f_name) {
                data[dateKey].members.add(`${task.user.f_name} ${task.user.l_name || ""}`);
            }
            if (task.project?.name) {
                data[dateKey].projectNames.add(task.project.name);
            }
        });

        return data;
    }, [allTasks, viewMode, selectedProjectId]);

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETE": return "bg-green-50 text-green-700 border-green-100";
            case "IN_PROGRESS": return "bg-blue-50 text-blue-700 border-blue-100";
            case "ASSIGNED": return "bg-purple-50 text-purple-700 border-purple-100";
            case "ONHOLD": return "bg-amber-50 text-amber-700 border-amber-100";
            default: return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const renderDayContent = (date) => {
        if (!date) return null;
        const dateKey = getLocalDateKey(date);
        const dayData = calendarData[dateKey];

        if (viewMode === "project") {
            if (!selectedProjectId) {
                return <div className="text-[10px] text-gray-400 italic mt-1">Select a project</div>;
            }

            if (!dayData || dayData.tasks.length === 0) return null;

            return (
                <div className="mt-1 space-y-1 overflow-hidden">
                    {dayData.tasks.slice(0, 2).map((task, idx) => (
                        <div key={idx} className={`px-1.5 py-0.5 text-[10px] truncate rounded border ${getStatusColor(task.status)}`} title={task.name}>
                            {task.name}
                        </div>
                    ))}
                    {dayData.tasks.length > 2 && (
                        <div className="text-[9px] text-gray-500 pl-1">+{dayData.tasks.length - 2} more</div>
                    )}
                </div>
            );
        } else {
            // User View
            if (!dayData || dayData.members.size === 0) return null;

            return (
                <div className="mt-1 space-y-1 overflow-hidden">
                    {Array.from(dayData.members).slice(0, 2).map((member, idx) => (
                        <div key={idx} className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] truncate rounded border border-teal-100" title={member}>
                            {member}
                        </div>
                    ))}
                    {dayData.members.size > 2 && (
                        <div className="text-[9px] text-gray-500 pl-1">+{dayData.members.size - 2} more</div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-600" />
                        Project Calendar
                    </h3>

                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                        <button
                            onClick={() => { setViewMode("project"); setSelectedDate(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "project" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Briefcase size={14} />
                            Project View
                        </button>
                        <button
                            onClick={() => { setViewMode("user"); setSelectedDate(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "user" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Users size={14} />
                            User View
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {viewMode === "project" && (
                        <select
                            value={selectedProjectId}
                            onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedDate(null); }}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
                        >
                            <option value="">Select Project</option>
                            {projects?.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
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
                                    } ${isToday ? "ring-1 ring-inset ring-blue-500 bg-blue-50/20" : ""} ${isSelected ? "bg-blue-50/40 ring-2 ring-inset ring-blue-500" : ""}`}
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
                                                        <span className="text-[9px] font-normal text-gray-500 uppercase tracking-wider">{viewMode === "user" ? "User" : "Project"} View</span>
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

                                                {viewMode === "project" ? (
                                                    <div className="space-y-2">
                                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">Tasks ({dayData.tasks.length})</div>
                                                        {dayData.tasks.length > 0 ? (
                                                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                                                {dayData.tasks.map((task, tIdx) => (
                                                                    <div key={tIdx} className={`text-[11px] p-1.5 rounded border ${getStatusColor(task.status)}`}>
                                                                        <div className="font-medium truncate" title={task.name}>{task.name}</div>
                                                                        <div className="text-[9px] mt-0.5 flex justify-between opacity-80">
                                                                            <span className="truncate max-w-[150px]" title={task.user?.f_name ? `${task.user.f_name} ${task.user.l_name || ""}` : "Unassigned"}>
                                                                                {task.user?.f_name ? `${task.user.f_name} ${task.user.l_name || ""}` : "Unassigned"}
                                                                            </span>
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
                                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">Users ({dayData.members.size})</div>
                                                        {dayData.members.size > 0 ? (
                                                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                                                {Array.from(dayData.members).map((member, mIdx) => (
                                                                    <div key={mIdx} className="text-[11px] text-gray-700 bg-teal-50/50 p-1.5 rounded border border-teal-100/50 font-medium truncate" title={member}>
                                                                        {member}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-[11px] text-gray-400 italic py-2 text-center">No user activity found</div>
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
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-6 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-50 border border-green-100 rounded"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-50 border border-blue-100 rounded"></div>
                    <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-purple-50 border border-purple-100 rounded"></div>
                    <span>Assigned</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-amber-50 border border-amber-100 rounded"></div>
                    <span>On Hold</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-teal-50 border border-teal-100 rounded"></div>
                    <span>User Activity</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCalendar;
