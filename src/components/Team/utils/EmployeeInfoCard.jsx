/* eslint-disable react/prop-types */

import Button from "../../fields/Button";

const EmployeeInfoCard = ({ employee, onEditClick }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {employee.f_name} {employee.m_name} {employee.l_name}
          </h3>
          <p className="text-gray-600">{employee.emp_code}</p>
          <p className="text-gray-600">{employee.email}</p>
          <p className="text-gray-600">{employee.phone}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p className="text-gray-700">{employee.role || "N/A"}</p>
          <p className="text-sm font-medium text-gray-500 mt-2">Designation</p>
          <p className="text-gray-700">{employee.designation || "N/A"}</p>
        </div>
        <div>
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${
                employee.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {employee.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          {employee.is_manager && (
            <div className="mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full inline-block">
              Manager
            </div>
          )}
          {employee.is_deptmanager && (
            <div className="mt-1 ml-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full inline-block">
              Dept Manager
            </div>
          )}
          {employee.is_hr && (
            <div className="mt-1 ml-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full inline-block">
              HR
            </div>
          )}
        </div>
        <div>
          <Button onClick={onEditClick}>Edit</Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;