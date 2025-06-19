/* eslint-disable no-unused-vars */
import { NavLink, Route, Routes, Outlet } from "react-router-dom";
import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const RFI = () => {
  
  const userType = sessionStorage.getItem("userType");
  const isAdmin = userType === "admin";
  
  return (
    <div className="w-full mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-green-500/70">
          RFI
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3 ">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-xl font-bold text-gray-800">Total Send RFI</div>
          <div className="text-3xl font-bold">50</div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-xl font-bold text-gray-800">
            Total Received RFI
          </div>
          <div className="text-3xl font-bold">50</div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-xl font-bold text-gray-800">No. of Open RFI</div>
          <div className="text-3xl font-bold">30</div>
        </div>
      </div>
        {/* Conditional rendering of menu */}
        <div className={` rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
              {isAdmin && (
                <li className="px-2">
                  <NavLink
                    to="create-rfi"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    Create RFI
                  </NavLink>
                </li>
              )}
              {isAdmin && (
                <li className="px-2">
                  <NavLink
                    to="all-sent-rfi"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Sent RFI
                  </NavLink>
                </li>
              )}  
                <li className="px-2">
                  <NavLink
                    to="all-received-rfi"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Received RFI
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

export default RFI;
