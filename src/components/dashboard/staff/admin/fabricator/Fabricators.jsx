/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
// import { GiHamburgerMenu } from 'react-icons/gi';
// import { IoIosCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import {
  loadFabricator,
  showClient,
} from "../../../../../store/fabricatorSlice.js";
import Service from "../../../../../config/Service.js";

const Fabricators = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  // Function to toggle menu visibility

  const fabricators = useSelector(
    (state) => state?.fabricatorData?.fabricatorData);
  const clients = useSelector((state) => state?.fabricatorData?.clientData);
  console.log(fabricators);

  const token = sessionStorage.getItem("token");

  const fetchAll = async () => {
    const fabricatorData = await Service.allFabricator(token);
    const clientData = await Service.allClient(token);
    dispatch(loadFabricator(fabricatorData));
    dispatch(showClient(clientData));
  };

  useEffect(() => {
    fetchAll();
  }, []);
  const userType = sessionStorage.getItem("userType");
  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-teal-500/50">
          Fabricators
        </div>
      </div>

      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              Total Fabricators
            </div>
            <div className="text-3xl font-bold">{fabricators?.length}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">Total Client</div>
            <div className="text-3xl font-bold">{clients?.length}</div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div className={` rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto rounded-lg bg-teal-100 md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center  justify-evenly">
                {userType !== "estimator" && (

                  <li className="px-2">
                    <NavLink
                      to="add-fabricator"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add Fabricator
                    </NavLink>
                  </li>
                )}
                <li className="px-2">
                  <NavLink
                    to="all-fabricator"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Fabricator
                  </NavLink>
                </li>
                {userType !== "estimator" && (
                  <li className="px-2">
                    <NavLink
                      to="add-client"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-500/50 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add Client
                    </NavLink>
                  </li>
                )}

                <li className="px-2">
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
                </li>
              </ul>
            </nav>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Fabricators;
