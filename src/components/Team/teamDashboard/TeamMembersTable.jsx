/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { ChevronUp, ChevronDown, FileDown, FileText } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TeamMembersTable = ({ tableData, columns, onMemberClick, formatToHoursMinutes }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { sortBy: [{ id: "name", desc: false }] },
    },
    useGlobalFilter,
    useSortBy
  );

  const exportToCSV = () => {
    const headers = ["S.No", ...columns.map((col) => col.Header)].join(",");
    const csvRows = rows.map((row, index) => {
      prepareRow(row); // Ensure row is prepared
      return [
        index + 1,
        row.original.name,
        row.original.role,
        formatToHoursMinutes(row.original.assignedHours),
        formatToHoursMinutes(row.original.workedHours),
        `${row.original.completedTasks}/${row.original.totalTasks}`,
        `${row.original.efficiency}%`,
      ].join(",");
    });
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "team_members_report.csv";
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Team Members Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["S.No", ...columns.map((col) => col.Header)]],
      body: rows.map((row, index) => {
        prepareRow(row);
        return [
          index + 1,
          row.original.name,
          row.original.role,
          formatToHoursMinutes(row.original.assignedHours),
          formatToHoursMinutes(row.original.workedHours),
          `${row.original.completedTasks}/${row.original.totalTasks}`,
          `${row.original.efficiency}%`,
        ];
      }),
      styles: { fontSize: 10 },
      theme: "grid",
    });
    doc.save("team_members_report.pdf");
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto rounded-md border max-h-[70vh]">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-teal-200/80 z-10">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
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
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-gray-50 cursor-pointer"
                    key={row.id}
                    onClick={() => onMemberClick(row.original.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Export Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          <FileDown size={16} />
          Export CSV
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          <FileText size={16} />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default TeamMembersTable;