/* eslint-disable react/prop-types */
import Button from "../../fields/Button";
import DateFilter from "../../../util/DateFilter";
import { FaFilePdf } from "react-icons/fa";

const DashboardHeader = ({ onAddTeam, searchTerm, onSearchChange, dateFilter, onDateFilterChange, onGenerateReport, onDailyReport }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Team Performance Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div>
          <Button onClick={onAddTeam}>Add Team</Button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <DateFilter dateFilter={dateFilter} setDateFilter={onDateFilterChange} />
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors shadow-sm"
            title="Download Full Report"
          >
            <FaFilePdf />
            Report
          </button>
          <button
            onClick={onDailyReport}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors shadow-sm"
            title="Daily Work Report"
          >
            <FaFilePdf />
            Daily Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;