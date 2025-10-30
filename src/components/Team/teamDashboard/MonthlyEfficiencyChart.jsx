/* eslint-disable react/prop-types */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";
  
  const MonthlyEfficiencyChart = ({ monthlyEfficiency }) => {
    return (
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
                <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} labelFormatter={(label) => `Month: ${label}`} />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#8884d8" activeDot={{ r: 8 }} name="Efficiency" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default MonthlyEfficiencyChart;