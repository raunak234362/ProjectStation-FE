/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useCallback, useMemo, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import GetMilestone from "./GetMilestone";
import DataTable from "../DataTable";

const TaskProgressBar = ({ progress, status }) => {
  const getProgressColor = (status, progress) => {
    if (progress >= 100 || status === "COMPLETED") return "bg-green-500";
    if (status === "IN_REVIEW") return "bg-yellow-500";
    if (status === "ACTIVE") return "bg-teal-500";
    return "bg-gray-500";
  };

  const color = getProgressColor(status, progress);
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  return (
    <div className="flex items-center gap-2 w-full min-w-[150px]">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${displayProgress}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {displayProgress}%
      </span>
    </div>
  );
};

const AllMilestone = ({ milestoneData, projectData }) => {
  useSignals();

  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    if (!Array.isArray(milestoneData?.value)) return [];

    const tasks = projectData?.tasks || [];
    const completedStatuses = ["COMPLETE", "VALIDATE_COMPLETE", "COMPLETE_OTHER", "USER_FAULT"];

    return milestoneData.value
      .filter((milestone) => ["COMPLETED", "IN_REVIEW", "ACTIVE"].includes(milestone.status))
      .map((milestone) => {
        // 1. Manual Override Priority
        if (milestone.percentage !== undefined && milestone.percentage !== null && milestone.percentage !== "") {
          return { ...milestone, calculatedProgress: Math.min(100, Math.max(0, Math.round(Number(milestone.percentage)))) };
        }

        // 2. Daily Percentage Distribution Logic
        const start = new Date(milestone.startDate || milestone.date || projectData?.startDate);
        const approval = new Date(milestone.approvalDate || milestone.endDate || milestone.EndDate);

        if (!milestone.approvalDate && !milestone.endDate && !milestone.EndDate) {
          return { ...milestone, calculatedProgress: 0 };
        }

        if (isNaN(start.getTime()) || isNaN(approval.getTime())) {
          return { ...milestone, calculatedProgress: 0 };
        }

        const totalDays = Math.ceil((approval - start) / (1000 * 60 * 60 * 24)) + 1;
        if (totalDays <= 0) return { ...milestone, calculatedProgress: 0 };

        const dailyPercentage = 100 / totalDays;
        let currentProgress = 0;
        let carriedOver = 0;

        // Filter tasks for this specific milestone
        const milestoneTasks = tasks.filter(t => {
          const ms = t.milestone || t.mileStone || {};
          const msId = t.milestone_id || t.mileStone_id || ms.id;
          return msId === milestone.id;
        });

        for (let i = 0; i < totalDays; i++) {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dateString = currentDate.toISOString().split('T')[0];

          const tasksForDay = milestoneTasks.filter(t => {
            const dueDate = t.due_date || t.endDate;
            if (!dueDate) return false;
            try {
              const taskDate = new Date(dueDate).toISOString().split('T')[0];
              return taskDate === dateString;
            } catch (e) {
              return false;
            }
          });

          if (tasksForDay.length > 0) {
            const allCompleted = tasksForDay.every(t => completedStatuses.includes(t.status));
            if (allCompleted) {
              currentProgress += dailyPercentage + carriedOver;
              carriedOver = 0;
            } else {
              carriedOver += dailyPercentage;
            }
          } else {
            carriedOver += dailyPercentage;
          }
        }

        return {
          ...milestone,
          calculatedProgress: Math.min(100, Math.round(currentProgress || 0))
        };
      });
  }, [milestoneData.value, projectData?.tasks, projectData?.startDate]);

  const columns = useMemo(
    () => [
      {
        header: "Subject",
        accessorKey: "subject",
        enableColumnFilter: true,
      },
      {
        header: "Approval Date",
        accessorKey: "approvalDate",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString() : "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <TaskProgressBar
            status={row.original.status}
            progress={row.original.calculatedProgress}
          />
        ),
      },
    ],
    []
  );

  const handleRowClick = useCallback((milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMilestone(null);
    setIsModalOpen(false);
  }, []);

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans p-4">
      <DataTable
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
        searchPlaceholder="Search milestones..."
      />
      {isModalOpen && (
        <GetMilestone milestone={selectedMilestone} onClose={closeModal} />
      )}
    </section>
  );
};

export default AllMilestone;
