/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const Project = () => {
  const projects = useSelector((state) => state?.projectData.projectData);

  // Count the number of active projects
  const activeProjectsCount = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  // Count the number of completed projects
  const completedProjectsCount = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex items-center justify-center w-full">
        <div className="px-5 py-1 mt-2 text-3xl font-bold text-white rounded-lg shadow-xl bg-green-500/70">
          Projects
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-5 my-5 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              All Projects
            </div>
            <div className="text-3xl font-bold">{projects.length}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Active Projects
            </div>
            <div className="text-3xl font-bold">{activeProjectsCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-lg bg-white/50">
            <div className="text-xl font-bold text-gray-800">
              No. of Completed Projects
            </div>
            <div className="text-3xl font-bold">{completedProjectsCount}</div>
          </div>
        </div>

        {/* Conditional rendering of menu */}
        <div className={`rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 text-center drop-shadow-md">
              <ul className="flex items-center gap-10 py-1 text-center justify-evenly">
               
                <li className="px-2">
                  <NavLink
                    to="projects"
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
    </div>
  );
};

export default Project;
