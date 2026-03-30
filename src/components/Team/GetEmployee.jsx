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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

const GetEmployee = ({ employee, onClose }) => {
  const employeeID = employee;
  console.log("Employee ID:", employeeID);
  const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeStatus, setEmployeeStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(null);
  const [dateFilter, setDateFilter] = useState({U
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

    // 🧠 Filter tasks based on dateFilter
    filteredStatus.tasks = employeeStatus.tasks.filter((task) => {
      if (!task.start_date) return false;

      const taskDate = new Date(task.start_date);

      switch (dateFilter.type) {
        case "month":
          return (
            taskDate.getMonth() === dateFilter.month &&
            taskDate.getFullYear() === dateFilter.year
          );

        case "year":
          return taskDate.getFullYear() === dateFilter.year;

        case "week":
          return (
            dateFilter.weekStart &&
            dateFilter.weekEnd &&
            taskDate.getTime() >= dateFilter.weekStart &&
            taskDate.getTime() <= dateFilter.weekEnd
          );

        case "range": {
          const startDate = new Date(dateFilter.year, dateFilter.startMonth, 1);
          const endDate = new Date(dateFilter.year, dateFilter.endMonth + 1, 0);
          return (
            taskDate.getTime() >= startDate.getTime() &&
            taskDate.getTime() <= endDate.getTime()
          );
        }

        case "dateRange": {
          const start = new Date(dateFilter.startDate);
          const end = new Date(dateFilter.endDate);
          return (
            taskDate.getTime() >= start.getTime() &&
            taskDate.getTime() <= end.getTime()
          );
        }

        // ✅ NEW: Filter for specific date
        case "specificDate": {
          if (!dateFilter.date) return false;
          const filterDate = new Date(dateFilter.date);
          return (
            taskDate.getFullYear() === filterDate.getFullYear() &&
            taskDate.getMonth() === filterDate.getMonth() &&
            taskDate.getDate() === filterDate.getDate()
          );
        }

        default:
          return true;
      }
    });

    // 🧠 Filter workingHourTask similarly
    filteredStatus.workingHourTask = employeeStatus.tasks
      .flatMap((task) => task.workingHourTask || [])
      .filter((entry) => {
        if (!entry.date) return false;

        const entryDate = new Date(entry.date);

        switch (dateFilter.type) {
          case "month":
            return (
              entryDate.getMonth() === dateFilter.month &&
              entryDate.getFullYear() === dateFilter.year
            );

          case "year":
            return entryDate.getFullYear() === dateFilter.year;

          case "week":
            return (
              dateFilter.weekStart &&
              dateFilter.weekEnd &&
              entryDate.getTime() >= dateFilter.weekStart &&
              entryDate.getTime() <= dateFilter.weekEnd
            );

          case "range": {
            const startDate = new Date(
              dateFilter.year,
              dateFilter.startMonth,
              1
            );
            const endDate = new Date(
              dateFilter.year,
              dateFilter.endMonth + 1,
              0
            );
            return (
              entryDate.getTime() >= startDate.getTime() &&
              entryDate.getTime() <= endDate.getTime()
            );
          }

          case "dateRange": {
            const start = new Date(dateFilter.startDate);
            const end = new Date(dateFilter.endDate);
            return (
              entryDate.getTime() >= start.getTime() &&
              entryDate.getTime() <= end.getTime()
            );
          }

          // ✅ NEW: Filter workingHourTask for specific date
          case "specificDate": {
            if (!dateFilter.date) return false;
            const filterDate = new Date(dateFilter.date);
            return (
              entryDate.getFullYear() === filterDate.getFullYear() &&
              entryDate.getMonth() === filterDate.getMonth() &&
              entryDate.getDate() === filterDate.getDate()
            );
          }

          default:
            return true;
        }
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

  const generateReport = () => {
    try {
      if (!filteredData || !filteredData.tasks) {
        toast.error("No data available to generate report");
        return;
      }

      console.log("Generating report for:", filteredData.f_name);

      const doc = new jsPDF();
      const employeeName = `${filteredData.f_name || ""} ${
        filteredData.l_name || ""
      }`.trim();
      const reportTitle = "Employee Task Report";
      const generatedDate = new Date().toLocaleDateString();

      // Header Section
      doc.setFontSize(20);
      doc.setTextColor(20, 184, 166); // Teal-500
      doc.text(reportTitle, 14, 20);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Employee: ${employeeName}`, 14, 30);
      doc.text(`Generated on: ${generatedDate}`, 14, 35);

      let filterText = "Period: All Time";
      if (dateFilter.type !== "all") {
        filterText = `Period: ${
          dateFilter.type.charAt(0).toUpperCase() + dateFilter.type.slice(1)
        }`;

        if (dateFilter.type === "month") {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          filterText += ` (${monthNames[dateFilter.month]} ${dateFilter.year})`;
        } else if (dateFilter.type === "year") {
          filterText += ` (${dateFilter.year})`;
        } else if (dateFilter.startDate && dateFilter.endDate) {
          filterText += ` (${new Date(
            dateFilter.startDate
          ).toLocaleDateString()} - ${new Date(
            dateFilter.endDate
          ).toLocaleDateString()})`;
        }
      }
      doc.text(filterText, 14, 40);

      // Table preparation
      const tableColumn = [
        "Project Name",
        "Task Name",
        "Status",
        "Start Date",
        "End Date",
      ];
      const tableRows = filteredData.tasks.map((task) => [
        task.project?.name || "N/A",
        task.name || "N/A",
        task.status || "N/A",
        task.start_date
          ? new Date(task.start_date).toLocaleDateString()
          : "N/A",
        task.end_date ? new Date(task.end_date).toLocaleDateString() : "N/A",
      ]);

      // Using explicit autoTable call
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: "grid",
        headStyles: {
          fillColor: [20, 184, 166], // Teal-500
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [240, 253, 250], // Teal-50
        },
      });

      // Save PDF
      const fileName = `Report_${employeeName.replace(
        /\s+/g,
        "_"
      )}_${generatedDate.replace(/\//g, "-")}.pdf`;
      doc.save(fileName);
      
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white h-[100vh] overflow-y-auto p-4 md:p-6 rounded-lg shadow-lg w-full">
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
            <div className="flex justify-end w-full items-center mb-4 gap-4">
              <button
                onClick={generateReport}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors duration-200"
              >
                <FileText size={16} />
                Generate Report
              </button>
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
