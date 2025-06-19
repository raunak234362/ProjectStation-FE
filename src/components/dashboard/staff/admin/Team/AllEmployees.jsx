/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import Button from "../../../../fields/Button";
import GetEmployee from "./GetEmployee";

// Custom search input for react-table
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <input
    value={globalFilter || ""}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search by name, email, or designation"
    className="border px-2 py-2 rounded mb-4 w-full md:w-1/3"
  />
);

const AllEmployees = () => {
  const departments = useSelector((state) => state?.userData?.departmentData) || [];
  const staffData = useSelector((state) => state?.userData?.staffData) || [];

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useMemo(() => {
    return staffData.map((staff, index) => ({
      sno: index + 1,
      username: staff.username,
      emp_code: staff.emp_code,
      emp_name: `${staff.f_name} ${staff.m_name || ""} ${staff.l_name}`,
      department:
        departments.find((dep) => dep.id === staff.department)?.name || "-",
      actions: staff.id,
    }));
  }, [staffData, departments]);

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "sno",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Employee Code",
        accessor: "emp_code",
      },
      {
        Header: "Employee Name",
        accessor: "emp_name",
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ value }) => (
          <Button onClick={() => handleViewClick(value)}>View</Button>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy
  );

  const handleViewClick = (employeeID) => {
    setSelectedEmployee(employeeID);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/70 rounded-lg md:w-full w-[90vw]">
      <div className="mt-5 p-4">
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto rounded-md border max-h-[70vh]">
        <table
          {...getTableProps()}
          className="min-w-[800px] w-full border-collapse text-sm text-center"
        >
          <thead className="sticky top-0 bg-teal-200/80 z-10">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps()
                    )}
                    className="px-5 py-2 text-left cursor-pointer"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? "" : ""
                    ) : (
                      ""
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No Employees Found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-blue-gray-100 border">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="border px-5 py-2 text-left">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
