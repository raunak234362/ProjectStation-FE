const Estimations = () => {
  // Sample data for demonstration
  const dashboardData = {
    pendingRFQs: 12,
    estimatedRFQs: 45,
    assignments: [
      { id: 1, rfq: "RFQ-001", estimator: "John Doe", status: "In Progress" },
      { id: 2, rfq: "RFQ-002", estimator: "Jane Smith", status: "Completed" },
      {
        id: 3,
        rfq: "RFQ-003",
        estimator: "Mike Johnson",
        status: "In Progress",
      },
    ],
    totalEstimatedTime: "120 hours",
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 ">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
        Estimation Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Total Pending RFQs
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            {dashboardData.pendingRFQs}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Total Estimated RFQs
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {dashboardData.estimatedRFQs}
          </p>
        </div>
      </div>

      {/* Estimator Assignments Table */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          Estimator Assignments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 font-medium text-gray-600">RFQ ID</th>
                <th className="p-3 font-medium text-gray-600">Estimator</th>
                <th className="p-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-700">{assignment.rfq}</td>
                  <td className="p-3 text-gray-700">{assignment.estimator}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        assignment.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Estimated Time */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">
          Total Estimated Time
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-purple-600">
          {dashboardData.totalEstimatedTime}
        </p>
      </div>
    </div>
  );
};

export default Estimations;
