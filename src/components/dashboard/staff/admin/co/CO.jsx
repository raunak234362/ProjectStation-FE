/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const CO = () => {
  return (
    <div className="w-full mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/50">
          Change-Order
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
        
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-xl font-bold text-gray-800">All Sent CO#</div>
          {/* <div className="text-3xl font-bold">{clients.length}</div> */}
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
          <div className="text-xl font-bold text-gray-800">
            All Received CO#
          </div>
          {/* <div className="text-3xl font-bold">{clients.length}</div> */}
        </div>
      </div>

      {/* Conditional rendering of menu */}
      <div className={` rounded-lg bg-white md:text-lg text-sm`}>
        <div className="overflow-auto rounded-lg bg-teal-100 md:w-full w-[90vw]">
          <nav className="px-5 text-center drop-shadow-md">
            <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
              {/* <li className="px-2">
                <NavLink
                  to="all-received-co"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                      : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                  }
                >
                  All Received CO#
                </NavLink>
              </li> */}
              <li className="px-2">
                <NavLink
                  to="send-co"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                      : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                  }
                >
                  Send CO
                </NavLink>
              </li>
              <li className="px-2">
                <NavLink
                  to="all-sent-co"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                      : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                  }
                >
                  All Sent CO
                </NavLink>
              </li>

              {/* <li className="px-2">
                <NavLink
                  to="all-clients"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                      : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                  }
                >
                  All Clients
                </NavLink>
              </li> */}
            </ul>
          </nav>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default CO;
