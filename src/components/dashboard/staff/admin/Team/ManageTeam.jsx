/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Routes, Outlet } from "react-router-dom";
import Service from "../../../../../config/Service";
import { showDepartment, showStaff } from "../../../../../store/userSlice";
import { DiPerl } from "react-icons/di";
const ManageTeam = () => {
const token = sessionStorage.getItem("token")
const dispatch =useDispatch();

const staffs = useSelector((state)=>state?.userData?.staffData)
const teams = useSelector((state)=>state?.userData?.teamData)
// console.log(departments) 
// console.log(staffs)

  const fetchAllStaff = async()=>{
    const staffData = await Service.allEmployee(token)
    const departmentData = await Service.allDepartment(token)
    console.log(departmentData)
    dispatch(showDepartment(departmentData))
    dispatch(showStaff(staffData))
  } 

  useEffect(()=>{
    fetchAllStaff()
  },[])

  const departmentData = useSelector((state)=>state?.userData?.departmentData)
  const employeeData = useSelector((state)=>state?.userData)

  return (
    <div className="w-full">
      {/* Title */}
      {/* <div className="flex items-center justify-center w-full">
        <div className="px-3 py-1 mt-2 text-2xl font-bold text-white rounded-lg shadow-xl md:text-3xl bg-teal-500/50 md:px-5">
          Team
        </div>
      </div> */}

      {/* Statistics */}
      {/* <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-lg font-bold text-gray-800 md:text-xl">Total Team</div>
          <div className="text-2xl font-bold md:text-3xl">{teams?.length}</div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-lg font-bold text-gray-800 md:text-xl">Total No. of Users</div>
          <div className="text-2xl font-bold md:text-3xl">{staffs?.length}</div>
        </div>
      
      </div> */}

     

       {/* Conditional rendering of menu */}
       <div className={` rounded-lg bg-white md:text-lg text-sm`}>
        <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-full">
          <nav className="px-5 text-center drop-shadow-md">
            <ul className="flex gap-10 py-1 text-center  justify-evenly">
            <li className="px-2">
              <NavLink
                to="add-employee"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                Add Employee
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="all-employees"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                All Employee
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="add-department"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                Add Department
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="all-department"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                All Department
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="add-team"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                Add Team
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="all-team"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                All Team
              </NavLink>
            </li>
            <li className="px-2">
              <NavLink
                to="team-dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                    : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                }
              >
                Team Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageTeam;
