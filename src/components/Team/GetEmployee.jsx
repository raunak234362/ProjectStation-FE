"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Service from "../../config/Service";
import EmployeeHeader from "./utils/EmployeeHeader";
import EmployeeInfoCard from "./utils/EmployeeInfoCard";
import StatsOverview from "./utils/StatsOverview";
import ProjectsSection from "./utils/ProjectSection";
import TasksBreakdown from "./utils/TaskBreakdown";
import TaskStatusDistribution from "./utils/TaskStatusDistribution";
import EditEmployee from "../dashboard/staff/admin/Team/EditEmployee";
import {
  Skeleton,
  SkeletonCard,
  SkeletonProjects,
  SkeletonStats,
  SkeletonTaskDistribution,
  SkeletonTasks,
} from "./utils/EmployeeSkeleton";
import DateFilter from "../../util/DateFilter";

const GetEmployee = ({ employee, onClose }) => {
  const employeeID = employee?.actions;
  const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeStatus, setEmployeeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    type: "all",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    startMonth: new Date().getMonth(),
    endMonth: new Date().getMonth(),
    weekStart: null,
    weekEnd: null,
    startDate: null,
    endDate: null,
  });

  const fetchEmployeeStatus = async () => {
    try {
      setLoading(true);
      const response = await Service.getUsersStats(employeeID);
      setEmployeeStatus(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!employeeStatus) return;

    const filteredStatus = JSON.parse(JSON.stringify(employeeStatus));

    if (dateFilter.type === "all") {
      setFilteredData(filteredStatus);
      return;
    }

    filteredStatus.tasks = employeeStatus.tasks.filter((task) => {
      if (!task.start_date) return false;

      const taskDate = new Date(task.start_date);

      if (dateFilter.type === "month") {
        return (
          taskDate.getMonth() === dateFilter.month &&
          taskDate.getFullYear() === dateFilter.year
        );
      }

      if (dateFilter.type === "year") {
        return taskDate.getFullYear() === dateFilter.year;
      }

      if (
        dateFilter.type === "week" &&
        dateFilter.weekStart &&
        dateFilter.weekEnd
      ) {
        return (
          taskDate.getTime() >= dateFilter.weekStart &&
          taskDate.getTime() <= dateFilter.weekEnd
        );
      }

      if (dateFilter.type === "range") {
        const startDate = new Date(dateFilter.year, dateFilter.startMonth, 1);
        const endDate = new Date(dateFilter.year, dateFilter.endMonth + 1, 0);
        return (
          taskDate.getTime() >= startDate.getTime() &&
          taskDate.getTime() <= endDate.getTime()
        );
      }

      if (
        dateFilter.type === "dateRange" &&
        dateFilter.startDate &&
        dateFilter.endDate
      ) {
        const start = new Date(dateFilter.startDate);
        const end = new Date(dateFilter.endDate);
        return (
          taskDate.getTime() >= start.getTime() &&
          taskDate.getTime() <= end.getTime()
        );
      }

      return true;
    });

    filteredStatus.workingHourTask = employeeStatus.tasks
      .flatMap((task) => task.workingHourTask || [])
      .filter((entry) => {
        if (!entry.date) return false;

        const entryDate = new Date(entry.date);

        if (dateFilter.type === "month") {
          return (
            entryDate.getMonth() === dateFilter.month &&
            entryDate.getFullYear() === dateFilter.year
          );
        }

        if (dateFilter.type === "year") {
          return entryDate.getFullYear() === dateFilter.year;
        }

        if (
          dateFilter.type === "week" &&
          dateFilter.weekStart &&
          dateFilter.weekEnd
        ) {
          return (
            entryDate.getTime() >= dateFilter.weekStart &&
            entryDate.getTime() <= dateFilter.weekEnd
          );
        }

        if (dateFilter.type === "range") {
          const startDate = new Date(dateFilter.year, dateFilter.startMonth, 1);
          const endDate = new Date(dateFilter.year, dateFilter.endMonth + 1, 0);
          return (
            entryDate.getTime() >= startDate.getTime() &&
            entryDate.getTime() <= endDate.getTime()
          );
        }

        if (
          dateFilter.type === "dateRange" &&
          dateFilter.startDate &&
          dateFilter.endDate
        ) {
          const start = new Date(dateFilter.startDate);
          const end = new Date(dateFilter.endDate);
          return (
            entryDate.getTime() >= start.getTime() &&
            entryDate.getTime() <= end.getTime()
          );
        }

        return true;
      });

    setFilteredData(filteredStatus);
  };

  useEffect(() => {
    applyFilters();
  }, [dateFilter, employeeStatus]);

  const employeeProjects =
    filteredData?.tasks
      ?.filter((task) => task.project)
      ?.map((task) => task.project)
      ?.filter(
        (project, index, self) =>
          index === self.findIndex((p) => p.id === project.id)
      ) || [];

  useEffect(() => {
    fetchEmployeeStatus();
  }, []);

  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0;
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 60 + minutes + Math.floor(seconds / 60);
  };

  const calculateStats = () => {
    if (!filteredData) return null;

    const totalAssignedHours = (
      filteredData.tasks.reduce(
        (total, task) => total + parseDurationToMinutes(task.duration),
        0
      ) / 60
    ).toFixed(2);

    const totalWorkedHours = (
      filteredData.tasks
        .flatMap((task) => task.workingHourTask || [])
        .reduce((total, entry) => total + (entry.duration || 0), 0) / 60
    ).toFixed(2);

    const projectCount = employeeProjects.length;

    const tasksByStatus = filteredData.tasks.reduce((acc, task) => {
      const status = task.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAssignedHours,
      totalWorkedHours,
      projectCount,
      taskCount: filteredData.tasks.length,
      tasksByStatus,
    };
  };

  const stats = calculateStats();

  const handleEditClick = () => {
    setIsModalOpen(true);
    setSelectedEditEmployee(filteredData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEditEmployee(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[90vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-10/12">
        <EmployeeHeader onClose={onClose} />
        {loading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </div>
            <SkeletonStats />
            <SkeletonTasks />
            <SkeletonProjects />
            <SkeletonTaskDistribution />
          </div>
        ) : filteredData ? (
          <div className="space-y-6">
            <EmployeeInfoCard
              employee={filteredData}
              onEditClick={handleEditClick}
            />
            <div className="flex justify-end w-full items-center mb-4">
              <DateFilter
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
            </div>
            <StatsOverview stats={stats} />
            <TasksBreakdown
              tasks={filteredData.tasks}
              parseDurationToMinutes={parseDurationToMinutes}
            />
            <ProjectsSection projects={employeeProjects} />
            <TaskStatusDistribution stats={stats} />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No employee data found</p>
          </div>
        )}
        {selectedEditEmployee && (
          <EditEmployee
            employee={selectedEditEmployee}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default GetEmployee;
