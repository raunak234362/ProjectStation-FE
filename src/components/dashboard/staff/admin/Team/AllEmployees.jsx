import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../../../fields/Button";
import GetEmployee from "./GetEmployee";
import DataTable from "../../../../DataTable";

const AllEmployees = () => {
  const departments = useSelector((state) => state?.userData?.departmentData) || [];
  const staffData = useSelector((state) => state?.userData?.staffData) || [];

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (employeeID) => {
    setSelectedEmployee(employeeID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Username",
        accessorKey: "username",
      },
      {
        header: "Employee Code",
        accessorKey: "emp_code",
      },
      {
        header: "Employee Name",
        accessorFn: (row) => `${row.f_name} ${row.m_name || ""} ${row.l_name}`.trim(),
        id: "emp_name",
      },
      {
        header: "Department",
        accessorFn: (row) => departments.find((dep) => dep.id === row.department)?.name || "-",
        id: "department",
        filterType: "select",
        filterOptions: departments.map(dep => ({ label: dep.name, value: dep.name })),
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => (
          <Button onClick={() => handleViewClick(info.row.original.id)}>View</Button>
        ),
      },
    ],
    [departments]
  );

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw] p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Employees</h2>
      <DataTable
        columns={columns}
        data={staffData}
        searchPlaceholder="Search by name, email, or designation"
      />

      {selectedEmployee && (
        <GetEmployee
          employeeID={selectedEmployee}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AllEmployees;
