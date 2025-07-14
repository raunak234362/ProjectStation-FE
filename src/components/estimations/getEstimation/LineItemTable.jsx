/* eslint-disable react/prop-types */
const LineItemTable = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="text-gray-600">No Line Items Available</div>;
  }

  return (
    <div className="mt-6 h-[50vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-teal-700 mb-3">Line Items</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Scope of Work</th>
              <th className="border px-3 py-2">Quantity</th>
              <th className="border px-3 py-2">Hours/Qty</th>
              <th className="border px-3 py-2">Total Hours</th>
              <th className="border px-3 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="even:bg-gray-50">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{item.scopeOfWork}</td>
                <td className="border px-3 py-2">{item.quantity ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.hoursPerQty ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.totalHours ?? "N/A"}</td>
                <td className="border px-3 py-2">{item.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LineItemTable;
