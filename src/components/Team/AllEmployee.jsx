/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import GetEmployee from "./GetEmployee";
import DataTable from "../DataTable";

const AllEmployees = () => {
  const departments = useSelector((state) => state?.userData?.departmentData || []);
  const staffData = useSelector((state) => state?.userData?.staffData || []);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    return staffData.map((staff) => ({
      username: staff.username,
      emp_code: staff.emp_code,
      emp_name: `${staff.f_name} ${staff.m_name || ""} ${staff.l_name}`,
      department:
        departments.find((dep) => dep.id === staff.department)?.name || "-",
      id: staff.id,
    }));
  }, [staffData, departments]);

  const columns = useMemo(
    () => [
      {
        header: "Employee Code",
        accessorKey: "emp_code",
        enableColumnFilter: true,
      },
      {
        header: "Employee Name",
        accessorKey: "emp_name",
        enableColumnFilter: true,
      },
      {
        header: "Department",
        accessorKey: "department",
        filterType: "select",
        filterOptions: [...new Set(data.map(d => d.department).filter(d => d !== "-"))].sort().map(val => ({ label: val, value: val })),
      },
    ],
    [data]
  );

  const handleViewClick = (row) => {
    setSelectedEmployee(row.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg md:w-full w-[90vw] p-4 h-full">
      <DataTable
        columns={columns}
        data={data}
        onRowClick={handleViewClick}
        searchPlaceholder="Search employees..."
      />

      {selectedEmployee && (
        <GetEmployee
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllEmployees;
