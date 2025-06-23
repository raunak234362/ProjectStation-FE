/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useTable, useSortBy, useGlobalFilter } from "react-table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import Service from "../../../../../../config/Service"
import EmployeeStatus from "../EmployeeStatus"
import DateFilter from "../../../../../../util/DateFilter"
import { Clock, CheckCircle, ArrowUp, ChevronUp, ChevronDown } from "lucide-react"

const TeamDashboard = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState([])
    const [filteredTeams, setFilteredTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState(null)
    const [teamMembers, setTeamMembers] = useState([])
    const [teamStats, setTeamStats] = useState({})
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [monthlyEfficiency, setMonthlyEfficiency] = useState([])
    const [dateFilter, setDateFilter] = useState({
        type: "all",
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        weekStart: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).getTime(),
        weekEnd: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).getTime(),
        startMonth: 0,
        endMonth: new Date().getMonth(),
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        endDate: new Date().toISOString(),
    })

    const token = useSelector((state) => state?.auth?.token)
    const staffData = useSelector((state) => state?.userData?.staffData)
    const teamData = useSelector((state) => state?.userData?.teamData?.data)

    // Fetch all teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true)
                // Assuming Service.allteams is available from your code
                const response = await Service.allteams(token)
                setTeams(response?.data)
                setFilteredTeams(response?.data)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
                setLoading(false)
            }
        }

        fetchTeams()
    }, [dispatch, token])

    // Handle team selection
    useEffect(() => {
        if (!selectedTeam) return

        const fetchTeamData = async () => {
            try {
                setLoading(true)
                const response = await Service.getTeamById(selectedTeam)

                if (response?.data) {
                    // Group members by role
                    const membersByRole = response.data.members.reduce((acc, member) => {
                        const role = member.role || "MEMBER"
                        if (!acc[role]) acc[role] = []
                        acc[role].push(member)
                        return acc
                    }, {})

                    setTeamMembers(response.data.members)

                    // Calculate team stats
                    calculateTeamStats(response.data.members)
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching team data:", error)
                setLoading(false)
            }
        }

        fetchTeamData()
    }, [selectedTeam])

    // Calculate team statistics
    const calculateTeamStats = async (members) => {
        try {
            const memberStats = await Promise.all(
                members.map(async (member) => {
                    try {
                        // Fetch individual member stats
                        const response = await Service.getUsersStats(member.id)
                        return response.data
                    } catch (error) {
                        console.error(`Error fetching stats for member ${member.id}:`, error)
                        return null
                    }
                }),
            )

            // Filter out null responses
            const validStats = memberStats.filter((stat) => stat !== null)

            // Filter tasks based on date range
            const filteredStats = validStats.map((memberStat) => {
                const filteredTasks = filterTasksByDateRange(memberStat.tasks, dateFilter)
                return {
                    ...memberStat,
                    tasks: filteredTasks,
                }
            })

            // Calculate aggregated team stats
            const totalAssignedHours = filteredStats.reduce((total, member) => {
                const memberAssignedHours = member.tasks.reduce((sum, task) => {
                    return sum + parseDurationToMinutes(task.duration || "00:00:00") / 60
                }, 0)
                return total + memberAssignedHours
            }, 0)

            const totalWorkedHours = filteredStats.reduce((total, member) => {
                const memberWorkedHours = member.tasks
                    .flatMap((task) => task.workingHourTask || [])
                    .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0)
                return total + memberWorkedHours
            }, 0)

            const totalTasks = filteredStats.reduce((total, member) => total + member.tasks.length, 0)

            const completedTasks = filteredStats.reduce((total, member) => {
                return total + member.tasks.filter((task) => task.status === "COMPLETE").length
            }, 0)

            const inProgressTasks = filteredStats.reduce((total, member) => {
                return total + member.tasks.filter((task) => task.status === "IN_PROGRESS").length
            }, 0)

            const efficiency = totalAssignedHours > 0 ? Math.round((totalAssignedHours / totalWorkedHours) * 100) : 0

            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            setTeamStats({
                totalAssignedHours: totalAssignedHours.toFixed(2),
                totalWorkedHours: totalWorkedHours.toFixed(2),
                totalTasks,
                completedTasks,
                inProgressTasks,
                efficiency,
                completionRate,
                memberStats: filteredStats,
            })

            // Calculate monthly efficiency data
            calculateMonthlyEfficiency(filteredStats)
        } catch (error) {
            console.error("Error calculating team stats:", error)
        }
    }

    // Calculate monthly efficiency data
    const calculateMonthlyEfficiency = (memberStats) => {
        const monthlyData = {}
        const currentYear = new Date().getFullYear()

        // Initialize monthly data
        for (let i = 0; i < 12; i++) {
            const monthName = new Date(currentYear, i, 1).toLocaleString("default", { month: "short" })
            monthlyData[i] = {
                month: monthName,
                assignedHours: 0,
                workedHours: 0,
                efficiency: 0,
            }
        }

        // Aggregate task data by month
        memberStats.forEach((member) => {
            member.tasks.forEach((task) => {
                const startDate = new Date(task.start_date || task.startDate)
                const month = startDate.getMonth()

                // Only include tasks from current year
                if (startDate.getFullYear() === currentYear) {
                    // Add assigned hours
                    const assignedHours = parseDurationToMinutes(task.duration || "00:00:00") / 60
                    monthlyData[month].assignedHours += assignedHours

                    // Add worked hours
                    const workedHours = (task.workingHourTask || []).reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0)
                    monthlyData[month].workedHours += workedHours
                }
            })
        })

        // Calculate efficiency for each month
        Object.keys(monthlyData).forEach((month) => {
            const { assignedHours, workedHours } = monthlyData[month]
            monthlyData[month].efficiency = assignedHours > 0 ? Math.round((assignedHours / workedHours) * 100) : 0
        })

        // Convert to array for recharts
        const monthlyEfficiencyData = Object.values(monthlyData)
        setMonthlyEfficiency(monthlyEfficiencyData)
    }

    // Filter tasks based on date range
    const filterTasksByDateRange = (tasks, filter) => {
        if (!tasks || !Array.isArray(tasks)) return []
        if (filter.type === "all") return tasks

        return tasks.filter((task) => {
            const taskStartDate = new Date(task.start_date || task.startDate)
            const taskEndDate = new Date(task.due_date || task.endDate)

            switch (filter.type) {
                case "week":
                    const weekStart = new Date(filter.weekStart)
                    const weekEnd = new Date(filter.weekEnd)
                    return taskStartDate <= weekEnd && taskEndDate >= weekStart

                case "month":
                    const monthStart = new Date(filter.year, filter.month, 1)
                    const monthEnd = new Date(filter.year, filter.month + 1, 0)
                    return taskStartDate <= monthEnd && taskEndDate >= monthStart

                case "year":
                    const yearStart = new Date(filter.year, 0, 1)
                    const yearEnd = new Date(filter.year, 11, 31)
                    return taskStartDate <= yearEnd && taskEndDate >= yearStart

                case "range":
                    const rangeStart = new Date(filter.year, filter.startMonth, 1)
                    const rangeEnd = new Date(filter.year, filter.endMonth + 1, 0)
                    return taskStartDate <= rangeEnd && taskEndDate >= rangeStart

                case "dateRange":
                    const startDate = new Date(filter.startDate)
                    const endDate = new Date(filter.endDate)
                    return taskStartDate <= endDate && taskEndDate >= startDate

                default:
                    return true
            }
        })
    }

    // Helper function to parse duration string to minutes
    const parseDurationToMinutes = (duration) => {
        if (!duration) return 0
        const [hours, minutes, seconds] = duration.split(":").map(Number)
        return hours * 60 + minutes + Math.floor(seconds / 60)
    }

    // Handle search and filtering
    useEffect(() => {
        if (!teams) return

        let filtered = [...teams]

        // Apply search term filter
        if (searchTerm) {
            filtered = filtered.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        // Apply status filter if needed
        if (filterStatus !== "all") {
            filtered = filtered.filter((team) => (filterStatus === "active" ? team.is_active : !team.is_active))
        }

        setFilteredTeams(filtered)
    }, [searchTerm, filterStatus, teams])

    // Update team stats when date filter changes
    useEffect(() => {
        if (selectedTeam && teamMembers.length > 0) {
            calculateTeamStats(teamMembers)
        }
    }, [dateFilter, selectedTeam, teamMembers])

    // Handle team selection
    const handleTeamSelect = (teamId) => {
        setSelectedTeam(teamId)
    }

    // Handle member click to show detailed view
    const handleMemberClick = (memberId) => {
        setSelectedEmployee(memberId)
    }

    const handleCloseModal = () => {
        setSelectedEmployee(null)
    }

    // Get efficiency color class based on value
    const getEfficiencyColorClass = (efficiency) => {
        if (efficiency >= 90) return "bg-green-100 text-green-800"
        if (efficiency >= 70) return "bg-blue-100 text-blue-800"
        if (efficiency >= 50) return "bg-yellow-100 text-yellow-800"
        return "bg-red-100 text-red-800"
    }

    // Prepare data for react-table
    const tableData = useMemo(() => {
        if (!teamMembers || !teamStats.memberStats) return []

        return teamMembers.map((member, index) => {
            const memberStat = teamStats.memberStats?.find((stat) => stat.id === member.id)

            const assignedHours =
                memberStat?.tasks
                    .reduce((sum, task) => sum + parseDurationToMinutes(task.duration || "00:00:00") / 60, 0)
                    .toFixed(2) || "0.00"

            const workedHours =
                memberStat?.tasks
                    .flatMap((task) => task.workingHourTask || [])
                    .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0)
                    .toFixed(2) || "0.00"

            const totalTasks = memberStat?.tasks.length || 0
            const completedTasks = memberStat?.tasks.filter((task) => task.status === "COMPLETE").length || 0

            const efficiency = assignedHours > 0 ? Math.round((assignedHours / workedHours) * 100) : 0

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
            }
        })
    }, [teamMembers, teamStats.memberStats])

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "S.No",
                accessor: "sno",
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => <div className="font-medium text-gray-900">{value}</div>,
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
                Cell: ({ value }) => <span className="text-sm text-gray-500">{value} hrs</span>,
            },
            {
                Header: "Worked Hours",
                accessor: "workedHours",
                Cell: ({ value }) => <span className="text-sm text-gray-500">{value} hrs</span>,
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
                                    width: `${row.original.totalTasks > 0 ? (row.original.completedTasks / row.original.totalTasks) * 100 : 0}%`,
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
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEfficiencyColorClass(value)}`}
                    >
                        {value}%
                    </span>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <button
                        onClick={() => handleMemberClick(row.original.id)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                    >
                        View Details
                    </button>
                ),
            },
        ],
        [],
    )

    // Set up react-table
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter } = useTable(
        {
            columns,
            data: tableData,
            initialState: { sortBy: [{ id: "efficiency", desc: true }] },
        },
        useGlobalFilter,
        useSortBy,
    )

    return (
        <div className="bg-gray-50 h-[80vh] overflow-y-auto p-4 md:p-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Team Performance Dashboard</h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />


                    </div>

                    <div className="flex items-center gap-2">
                        <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
                    </div>
                </div>
            </div>

            {loading && !selectedTeam ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Loading teams data...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Teams List */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Teams</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredTeams && filteredTeams.length > 0 ? (
                                filteredTeams.map((team) => (
                                    <div
                                        key={team.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedTeam === team.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                                            }`}
                                        onClick={() => handleTeamSelect(team.id)}
                                    >
                                        <h3 className="font-medium text-gray-800">{team.name}</h3>
                                        <div className="flex justify-between items-center mt-2 text-sm">
                                            <span className="text-gray-600">{team.members?.length || 0} members</span>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-500 italic">No teams found</div>
                            )}
                        </div>
                    </div>

                    {/* Selected Team Details */}
                    {selectedTeam && (
                        <div className="bg-white rounded-lg shadow">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                                    <p className="mt-4 text-gray-500">Loading team details...</p>
                                </div>
                            ) : (
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                                        {teamData?.find((t) => t.id === selectedTeam)?.name || "Team Details"}
                                    </h2>

                                    {/* Team Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        {/* Hours Card */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-800">Hours</h4>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Assigned:</span>
                                                    <span className="font-medium">{teamStats.totalAssignedHours || "0.00"} hrs</span>
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Worked:</span>
                                                    <span className="font-medium">{teamStats.totalWorkedHours || "0.00"} hrs</span>
                                                </div>

                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${Math.min(100, teamStats.efficiency || 0)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tasks Card */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-800">Tasks</h4>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="font-medium">{teamStats.totalTasks || 0}</span>
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Completed:</span>
                                                    <span className="font-medium">{teamStats.completedTasks || 0}</span>
                                                </div>

                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${teamStats.completionRate || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Efficiency Card */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                                                    <ArrowUp className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-800">Efficiency</h4>
                                            </div>

                                            <div className="mt-2 text-center">
                                                <div className="text-3xl font-bold text-gray-800">{teamStats.efficiency || 0}%</div>
                                                <div className="text-xs text-gray-500 mt-1">Hours worked vs assigned</div>
                                            </div>
                                        </div>

                                        {/* Completion Rate Card */}
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center mb-2">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <h4 className="font-medium text-gray-800">Completion Rate</h4>
                                            </div>

                                            <div className="mt-2 text-center">
                                                <div className="text-3xl font-bold text-gray-800">{teamStats.completionRate || 0}%</div>
                                                <div className="text-xs text-gray-500 mt-1">Tasks completed vs total</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monthly Efficiency Chart */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Efficiency</h3>
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={monthlyEfficiency} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="month" />
                                                        <YAxis
                                                            domain={[0, 100]}
                                                            label={{ value: "Efficiency %", angle: -90, position: "insideLeft" }}
                                                        />
                                                        <Tooltip
                                                            formatter={(value) => [`${value}%`, "Efficiency"]}
                                                            labelFormatter={(label) => `Month: ${label}`}
                                                        />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="efficiency"
                                                            stroke="#8884d8"
                                                            activeDot={{ r: 8 }}
                                                            name="Efficiency"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Members Table with React Table */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>

                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="overflow-x-auto overflow-y-auto rounded-md border max-h-[70vh]">
                                                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                                                    <thead className="sticky top-0 bg-teal-200/80 z-10">
                                                        {headerGroups.map((headerGroup) => (
                                                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                                                {headerGroup.headers.map((column) => (
                                                                    <th
                                                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                                                    >
                                                                        <div className="flex items-center">
                                                                            {column.render("Header")}
                                                                            <span className="ml-1">
                                                                                {column.isSorted ? (
                                                                                    column.isSortedDesc ? (
                                                                                        <ChevronDown className="h-4 w-4" />
                                                                                    ) : (
                                                                                        <ChevronUp className="h-4 w-4" />
                                                                                    )
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </thead>
                                                    <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                                                        {rows.map((row) => {
                                                            prepareRow(row)
                                                            return (
                                                                <tr {...row.getRowProps()} className="hover:bg-gray-50" key={row.id}>
                                                                    {row.cells.map((cell) => (
                                                                        <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                                                                            {cell.render("Cell")}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task Distribution */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h3>

                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            {teamStats.totalTasks > 0 ? (
                                                <div className="space-y-4">
                                                    {/* Completed Tasks */}
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">Completed</span>
                                                            <span className="text-sm text-gray-500">
                                                                {teamStats.completedTasks} (
                                                                {Math.round((teamStats.completedTasks / teamStats.totalTasks) * 100)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{ width: `${(teamStats.completedTasks / teamStats.totalTasks) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* In Progress Tasks */}
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">In Progress</span>
                                                            <span className="text-sm text-gray-500">
                                                                {teamStats.inProgressTasks} (
                                                                {Math.round((teamStats.inProgressTasks / teamStats.totalTasks) * 100)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ width: `${(teamStats.inProgressTasks / teamStats.totalTasks) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Other Tasks */}
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">Other</span>
                                                            <span className="text-sm text-gray-500">
                                                                {teamStats.totalTasks - teamStats.completedTasks - teamStats.inProgressTasks} (
                                                                {Math.round(
                                                                    ((teamStats.totalTasks - teamStats.completedTasks - teamStats.inProgressTasks) /
                                                                        teamStats.totalTasks) *
                                                                    100,
                                                                )}
                                                                %)
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-full bg-gray-500 rounded-full"
                                                                style={{
                                                                    width: `${((teamStats.totalTasks - teamStats.completedTasks - teamStats.inProgressTasks) / teamStats.totalTasks) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 italic">No task data available</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Employee Modal */}
            {selectedEmployee && <EmployeeStatus employee={selectedEmployee} onClose={handleCloseModal} />}
        </div>
    )
}

export default TeamDashboard
