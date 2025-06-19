/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useMemo } from "react"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip } from "react-tooltip"

const TimeLine = ({
  tasks,
  minDate,
  maxDate,
  totalDays,
  timelineWidth = 1000,
  rowHeight = 50,
  expandedTypes,
  toggleTypeExpansion,
  visibleTaskCount,
  loadMoreTasks,
  typeColors,
  statusColors,
}) => {
  // Ensure dates are properly parsed
  const startDate = new Date(minDate)
  const endDate = new Date(maxDate)
  const today = new Date()

  // Check if today falls within the timeline range
  const showTodayLine = today >= startDate && today <= endDate

  // Calculate days since start to today
  const daysSinceStart = showTodayLine ? Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) : 0

  // Calculate today line position more accurately
  const todayLeft = showTodayLine ? (daysSinceStart / totalDays) * timelineWidth : 0

  const getPositionAndWidth = useCallback(
    (start, end) => {
      const startTime = new Date(start).getTime()
      const endTime = new Date(end).getTime()

      // Calculate positions relative to timeline dimensions
      const daysSinceMin = (startTime - startDate.getTime()) / (1000 * 60 * 60 * 24)
      const durationDays = (endTime - startTime) / (1000 * 60 * 60 * 24)

      const left = (daysSinceMin / totalDays) * timelineWidth
      const width = Math.max((durationDays / totalDays) * timelineWidth, 30)

      return { left, width }
    },
    [startDate, totalDays, timelineWidth],
  )

  const monthDivisions = useMemo(() => {
    const months = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const monthStart = new Date(currentDate)
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1)
      // Ensure month end is within timeline
      const monthEnd = new Date(Math.min(currentDate.getTime(), endDate.getTime()))

      const { left } = getPositionAndWidth(monthStart, monthStart)
      const { width } = getPositionAndWidth(monthStart, monthEnd)

      months.push({
        label: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        left,
        width,
      })
    }
    return months
  }, [startDate, endDate, getPositionAndWidth])

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.type]) acc[task.type] = []
      acc[task.type].push(task)
      return acc
    }, {})
  }, [tasks])

  const renderedTasks = useMemo(() => {
    const list = []
    Object.entries(groupedTasks).forEach(([type, taskList]) => {
      list.push({ isHeader: true, type })
      if (expandedTypes[type]) {
        list.push(...taskList)
      }
    })
    return list.slice(0, visibleTaskCount)
  }, [groupedTasks, expandedTypes, visibleTaskCount])

  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium inline-block"
    const color = statusColors[status] || "#666"

    return (
      <span
        className={baseClasses}
        style={{
          backgroundColor: `${color}20`,
          color: color,
          border: `1px solid ${color}`,
        }}
      >
        {status}
      </span>
    )
  }

  const TaskRow = ({ index, style, data }) => {
    const item = data[index]

    if (item.isHeader) {
      const taskCount = groupedTasks[item.type]?.length || 0
      const typeColor = typeColors[item.type] || "#ccc"

      return (
        <div
          style={{
            ...style,
            borderLeft: `4px solid ${typeColor}`,
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 font-semibold border-b text-sm text-gray-700"
        >
          <button
            onClick={() => toggleTypeExpansion(item.type)}
            className="hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-200"
            aria-label={expandedTypes[item.type] ? "Collapse section" : "Expand section"}
          >
            {expandedTypes[item.type] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base">
              {item.type} <span className="text-sm text-gray-500 font-normal">({taskCount} tasks)</span>
            </span>
          </div>
        </div>
      )
    }

    const { left, width } = getPositionAndWidth(item.startDate, item.endDate)
    const typeColor = typeColors[item.type] || "#ccc"
    const statusColor = statusColors[item.status] || "#666"

    // Format dates for display
    const startDateFormatted = new Date(item.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const endDateFormatted = new Date(item.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    return (
      <div
        style={style}
        className="flex items-center border-b px-4 text-sm bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="w-1/4 truncate font-medium text-gray-800 pr-2">{item.name}</div>
        <div className="w-3/4 relative h-8 bg-gray-50 rounded-md overflow-visible">
          <div
            data-tooltip-id="task-tooltip"
            data-tooltip-html={`
              <div class="p-1">
                <div class="font-bold text-base mb-2">${item.name}</div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div class="text-gray-500">Status:</div>
                  <div>${item.status}</div>
                  <div class="text-gray-500">Progress:</div>
                  <div class="flex items-center gap-1">
                    <div class="w-20 h-2 bg-gray-200 rounded-full">
                      <div class="h-full bg-blue-500 rounded-full" style="width: ${item.progress}%"></div>
                    </div>
                    <span>${item.progress}%</span>
                  </div>
                  <div class="text-gray-500">Start:</div>
                  <div>${startDateFormatted}</div>
                  <div class="text-gray-500">End:</div>
                  <div>${endDateFormatted}</div>
                  <div class="text-gray-500">Assigned to:</div>
                  <div>${item.username}</div>
                </div>
              </div>
            `}
            className="absolute h-full cursor-pointer transition-all duration-200 flex items-center rounded-md border hover:shadow-md"
            style={{
              left,
              width,
              backgroundColor: `${typeColor}15`,
              borderColor: typeColor,
            }}
          >
            <div
              className="h-full rounded-l-md transition-all duration-300"
              style={{
                width: `${item.progress}%`,
                backgroundColor: statusColor,
                opacity: 0.85,
              }}
            />
            <div className="absolute inset-0 flex items-center px-2 justify-between">
              <span className="text-xs font-medium text-gray-800 truncate max-w-[70%]">
                {item.progress > 0 && `${item.progress}%`}
              </span>
              {width > 100 && (
                <span className="text-xs bg-white/80 px-1.5 py-0.5 rounded text-gray-700">{item.status}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 border rounded-lg shadow-lg bg-white overflow-hidden">
      {/* Header with legends */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Type Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm font-medium text-gray-700">{type}</span>
              </div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center">
                {getStatusBadge(status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Timeline Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Month Header */}
        <div className="relative h-10 border-b bg-gray-50 text-xs font-semibold">
          {monthDivisions.map((month, idx) => (
            <div
              key={idx}
              style={{
                width: month.width,
                left: month.left,
                position: "absolute",
                height: "100%",
                borderLeft: idx > 0 ? "1px solid #e5e7eb" : "none",
              }}
              className="flex items-center justify-center text-gray-600"
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Day Axis */}
        <div className="relative h-8 border-b bg-white">
          {Array.from({ length: Math.min(totalDays + 1, 60) }).map((_, i) => {
            const date = new Date(startDate)
            date.setDate(date.getDate() + i)
            const isToday = date.toDateString() === today.toDateString()

            // Position each day marker at exact intervals
            const position = (i / totalDays) * timelineWidth

            return (
              <div
                key={i}
                className={`absolute ${isToday ? "border-l-2 border-red-500" : i % 7 === 0 ? "border-l border-gray-300" : "border-l border-gray-200"}`}
                style={{
                  left: `${position}px`,
                  height: "100%",
                }}
              >
                {(i % 2 === 0 || isToday) && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`${isToday ? "text-red-600 font-semibold" : "text-gray-600"} text-xs`}>
                      {date.getDate()}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Today Indicator */}
      <div className="relative">
        {showTodayLine && (
          <div
            className="absolute z-20 border-l-2 border-red-500 top-0 bottom-0 h-full"
            style={{
              left: `${todayLeft}px`,
              height: "calc(100% - 16px)", // Adjust for bottom padding
            }}
          >
            <div className="absolute -top-6 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-md whitespace-nowrap">
              Today
            </div>
          </div>
        )}

        {/* Virtualized Task List */}
        <div style={{ width: `${timelineWidth + 300}px`, height: 500 }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                itemCount={renderedTasks.length}
                itemSize={rowHeight}
                itemData={renderedTasks}
              >
                {TaskRow}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>

      {/* Load More */}
      {visibleTaskCount < tasks.length && (
        <div className="text-center p-4 bg-gradient-to-b from-white to-gray-50 border-t">
          <button
            onClick={loadMoreTasks}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm shadow-md transition-colors duration-200"
          >
            Load More Tasks
          </button>
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        id="task-tooltip"
        place="top"
        className="z-[1000] !bg-white !text-gray-800 shadow-lg rounded-lg border border-gray-200 p-0"
        opacity={1}
      />
    </div>
  )
}

export default TimeLine
