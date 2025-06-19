/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useMemo } from "react"
import { Users, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const Team = ({ userContributions, dateFilter, projectTasks, userData, filterStage }) => {
    // COLORS for user cards
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

    // Stage priority for sorting (lower number = higher priority)
    const stagePriority = {
        "RFI": 1,
        "IFA": 2,
        "BFA": 3,
        "BFA_M": 4,
        "RIFA": 5,
        "RBFA": 6,
        "IFC": 7,
        "BFC": 8,
        "RIFC": 9,
        "REV": 10,
        "CO#": 11
    }

    // Helper function to parse duration strings
    const parseDuration = (duration) => {
        if (!duration || typeof duration !== "string") return 0
        const [h, m, s] = duration.split(":").map(Number)
        return h + m / 60 + s / 3600
    }

    // Apply date filtering to tasks
    const filteredTasks = useMemo(() => {
        let tasks = projectTasks.map(task => ({
            ...task,
            stage: task.Stage  // normalize key casing
        }));

       // Apply stage filter if provided
    if (filterStage && Array.isArray(filterStage) && filterStage.length > 0) {
        tasks = tasks.filter((task) => filterStage.includes(task.stage));
    } else if (filterStage && filterStage !== "all") {
        tasks = tasks.filter((task) => task.stage === filterStage);
    }

        // Apply date filter
        if (!dateFilter || dateFilter.type === "all") {
            return tasks;
        }

        return tasks.filter((task) => {
            const taskStartDate = new Date(task.start_date).getTime();
            const taskEndDate = new Date(task.due_date).getTime();

            if (dateFilter.type === "week" && dateFilter.weekStart && dateFilter.weekEnd) {
                const weekStart = dateFilter.weekStart;
                const weekEnd = dateFilter.weekEnd;
                return (
                    (taskStartDate >= weekStart && taskStartDate <= weekEnd) ||
                    (taskEndDate >= weekStart && taskEndDate <= weekEnd) ||
                    (taskStartDate <= weekStart && taskEndDate >= weekEnd)
                );
            }

            if (dateFilter.type === "month" && dateFilter.year !== undefined && dateFilter.month !== undefined) {
                const monthStart = new Date(dateFilter.year, dateFilter.month, 1).getTime();
                const monthEnd = new Date(dateFilter.year, dateFilter.month + 1, 0, 23, 59, 59, 999).getTime();
                return (
                    (taskStartDate >= monthStart && taskStartDate <= monthEnd) ||
                    (taskEndDate >= monthStart && taskEndDate <= monthEnd) ||
                    (taskStartDate <= monthStart && taskEndDate >= monthEnd)
                );
            }

            if (dateFilter.type === "year" && dateFilter.year !== undefined) {
                const yearStart = new Date(dateFilter.year, 0, 1).getTime();
                const yearEnd = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999).getTime();
                return (
                    (taskStartDate >= yearStart && taskStartDate <= yearEnd) ||
                    (taskEndDate >= yearStart && taskEndDate <= yearEnd) ||
                    (taskStartDate <= yearStart && taskEndDate >= yearEnd)
                );
            }

            if (
                dateFilter.type === "range" &&
                dateFilter.year !== undefined &&
                dateFilter.startMonth !== undefined &&
                dateFilter.endMonth !== undefined
            ) {
                const rangeStart = new Date(dateFilter.year, dateFilter.startMonth, 1).getTime();
                const rangeEnd = new Date(dateFilter.year, dateFilter.endMonth + 1, 0, 23, 59, 59, 999).getTime();
                return (
                    (taskStartDate >= rangeStart && taskStartDate <= rangeEnd) ||
                    (taskEndDate >= rangeStart && taskEndDate <= rangeEnd) ||
                    (taskStartDate <= rangeStart && taskEndDate >= rangeEnd)
                );
            }

            if (
                dateFilter.type === "dateRange" &&
                dateFilter.startDate &&
                dateFilter.endDate
            ) {
                const rangeStart = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
                const rangeEnd = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
                return (
                    (taskStartDate >= rangeStart && taskStartDate <= rangeEnd) ||
                    (taskEndDate >= rangeStart && taskEndDate <= rangeEnd) ||
                    (taskStartDate <= rangeStart && taskEndDate >= rangeEnd)
                );
            }

            return true;
        });
    }, [projectTasks, dateFilter, filterStage]);

    // Calculate filtered user contributions based on the date filter and sort by stage and date
    const filteredUserContributions = useMemo(() => {
        return userData
            .map((user) => {
                const userTasks = filteredTasks.filter((task) => task.user?.id === user.id)
                const totalWorkingHourTasks = userTasks.reduce((sum, task) => {
                    const taskDuration =
                        task.workingHourTask?.reduce((innerSum, innerTask) => innerSum + (innerTask.duration || 0), 0) || 0
                    return sum + taskDuration
                }, 0)

                // Get the earliest task date and most common stage for sorting
                const earliestTaskDate = userTasks.length > 0
                    ? Math.min(...userTasks.map(task => new Date(task.start_date).getTime()))
                    : Date.now()

                // Find the most common stage for this user's tasks
                const stageCount = userTasks.reduce((acc, task) => {
                    { console.log(task.Stage) }
                    const stage = task.Stage || 'unknown'
                    acc[stage] = (acc[stage] || 0) + 1
                    return acc
                }, {})

                const mostCommonStage = Object.keys(stageCount).reduce((a, b) =>
                    stageCount[a] > stageCount[b] ? a : b, 'unknown'
                )

                return {
                    id: user.id,
                    name: user.f_name,
                    fullName: `${user.f_name} ${user.l_name}`.trim(),
                    taskCount: userTasks.length,
                    totalAssignedHours: userTasks.reduce((sum, task) => sum + parseDuration(task.duration), 0),
                    totalWorkedHours: (totalWorkingHourTasks / 60).toFixed(2),
                    earliestTaskDate,
                    mostCommonStage,
                    stagePriority: stagePriority[mostCommonStage] || 999,
                    userTasks // Include tasks for detailed view
                }
            })
            .filter((user) => user.taskCount > 0)
            .sort((a, b) => {
                // First sort by stage priority
                if (a.stagePriority !== b.stagePriority) {
                    return a.stagePriority - b.stagePriority
                }
                // Then sort by earliest task date
                if (a.earliestTaskDate !== b.earliestTaskDate) {
                    return a.earliestTaskDate - b.earliestTaskDate
                }
                // Finally sort by task count (descending)
                return b.taskCount - a.taskCount
            })
    }, [userData, filteredTasks])

    // Format hours to display in a more readable way
    const formatHours = (hours) => {
        if (isNaN(hours)) return "0h 0m"
        const h = Math.floor(parseFloat(hours))
        const m = Math.round((parseFloat(hours) - h) * 60)
        return `${h}h ${m}m`
    }

    // Format stage name for display
    const formatStageName = (stage) => {
        const stageNames = {
            "RFI": "Request for Information",
            "IFA": "Issue for Approval",
            "BFA": "Back from Approval",
            "BFA_M": "Back from Approval - Markup",
            "RIFA": "Re-issue for Approval",
            "RBFA": "Return Back from Approval",
            "IFC": "Issue for Construction",
            "BFC": "Back from Construction",
            "RIFC": "Re-issue for Construction",
            "REV": "Revision",
            "CO#": "Change Order"
        }
        return stageNames[stage] || stage
    }

    // Group users by stage for better visualization
    const usersByStage = useMemo(() => {
        return filteredUserContributions.reduce((acc, user) => {
            const stage = user.mostCommonStage
            if (!acc[stage]) {
                acc[stage] = []
            }
            acc[stage].push(user)
            return acc
        }, {})
    }, [filteredUserContributions])

    return (
        <>
            {/* DateFilter indicator */}
            {dateFilter.type !== "all" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Showing team data filtered by selected date range.
                    Total tasks: {filteredTasks.length} | Team members: {filteredUserContributions.length}
                </div>
            )}

            {/* Sorting Information */}
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                <span className="font-medium">Sorting:</span> Users are sorted by Stage Priority → Task Start Date → Task Count
            </div>

            {/* Team contribution chart */}
            <div className="p-5 mb-6 bg-white border shadow-sm rounded-xl">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Users className="w-5 h-5" /> Team Contributions (Sorted by Stage & Date)
                </h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredUserContributions}
                            layout="vertical"
                            margin={{ left: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 14 }} />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === "taskCount") return [`${value} tasks`, "Tasks Assigned"]
                                    if (name === "totalWorkedHours") return [formatHours(value), "Hours Worked"]
                                    return [value, name]
                                }}
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    padding: "10px",
                                }}
                            />
                            <Bar dataKey="taskCount" name="Tasks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Team Members Grid - Grouped by Stage */}
            <div className="p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Team Members by Stage</h2>

                {Object.keys(usersByStage).length > 0 ? (
                    Object.entries(usersByStage).map(([stage, users]) => (
                        <div key={stage} className="mb-6">
                            <h3 className="mb-3 text-md font-semibold text-gray-700 border-b pb-2">
                                {formatStageName(stage)} ({users.length} members)
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {users.map((user, index) => (
                                    <div key={user.id || index} className="flex items-center gap-3 p-4 border rounded-lg shadow-sm">
                                        <div
                                            className="flex items-center justify-center w-12 h-12 font-bold text-white rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        >
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{user.fullName || user.name}</div>
                                            <div className="text-xs text-gray-500 mb-1">
                                                Stage: {formatStageName(user.mostCommonStage)}
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-gray-500">Tasks:</span>
                                                <span className="font-semibold text-sm">{user.taskCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-gray-500">Assigned:</span>
                                                <span className="font-semibold text-sm">{formatHours(user.totalAssignedHours)}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-gray-500">Worked:</span>
                                                <span className="font-semibold text-sm">{formatHours(user.totalWorkedHours)}</span>
                                            </div>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-600 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${Math.min((parseFloat(user.totalWorkedHours) / user.totalAssignedHours) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No team members found</h3>
                        <p className="text-gray-500 mt-1">
                            No team members have tasks assigned during the selected date range.
                        </p>
                    </div>
                )}
            </div>

            {/* Summary Statistics */}
            <div className="mt-6 p-5 bg-white border shadow-sm rounded-xl">
                <h2 className="mb-4 text-lg font-bold">Stage Distribution Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(usersByStage).map(([stage, users]) => (
                        <div key={stage} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-sm">{formatStageName(stage)}</div>
                            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                            <div className="text-xs text-gray-500">
                                {users.reduce((sum, user) => sum + user.taskCount, 0)} total tasks
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Team
