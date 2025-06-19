/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Service from "../../../../../config/Service";
import { useEffect, useState } from "react";
import { showProjects } from "../../../../../store/projectSlice";
import { loadFabricator } from "../../../../../store/fabricatorSlice";
import { showDepartment } from "../../../../../store/userSlice";

const Projects = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("overview");
  const fetchAllFabricator = async () => {
    const fabricatorData = await Service.allFabricator(token);
    dispatch(loadFabricator(fabricatorData));
  };
  const fetchAllDepartment = async () => {
    const departmentData = await Service.allDepartment(token);
    dispatch(showDepartment(departmentData));
  };

  useEffect(() => {
    fetchAllDepartment();
    fetchAllFabricator();
  }, []);

  const projects = useSelector((state) => state?.projectData.projectData);

  const userTypes = sessionStorage.getItem("userType");
  console.log(userTypes);
  // Count the number of active projects
  const activeProjectsCount = projects?.filter(
    (project) => project?.status === "ACTIVE"
  ).length;

  // Count the number of completed projects
  const completedProjectsCount = projects?.filter(
    (project) => project?.status === "COMPLETED"
  ).length;

  return (
    <div className="w-full h-[88vh] overflow-y-auto ">
      

        {/* Conditional rendering of menu */}
        <div className={`rounded-lg  md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full">
            <nav className="px-5 drop-shadow-md text-center">
              <ul className="flex items-center justify-evenly gap-10 py-1 text-center">
                {userTypes !== "user" && (
                  <li className="px-2">
                    <NavLink
                      to="projects"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Projects
                    </NavLink>
                  </li>
                )}
                {userTypes !== "user" && userTypes !=="project-manager" ? (
                  <li className="px-2">
                    <NavLink
                      to="add-project"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                          : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                      }
                    >
                      Add Project
                    </NavLink>
                  </li>
                ):(null)}
                <li className="px-2">
                  <NavLink
                    to="all-projects"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Projects
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

export default Projects;
