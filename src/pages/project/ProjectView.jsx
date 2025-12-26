import { useState } from "react";
import { AddProject, AllProjects } from "../../components";
import ClientAllProjects from "../../components/project/ClientAllProjects";
import ProjectDashboard from "../../components/project/ProjectDashboard";

const ProjectView = () => {
  const [activeTab, setActiveTab] = useState("allProject");
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">
            Projects Detail
          </h1>
          <div className="flex space-x-2 overflow-x-auto">
            {userType === "client" || userType === "staff" ? null : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("ProjectDashboard")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "ProjectDashboard"
                    ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                    : "md:text-base text-sm bg-white"
                    }`}
                >
                  Project Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("addProject")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "addProject"
                    ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                    : "md:text-base text-sm bg-white"
                    }`}
                >
                  Add Project
                </button>
              </div>
            )}
            <button
              onClick={() => setActiveTab("allProject")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allProject"
                ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                : "md:text-base text-sm bg-white"
                }`}
            >
              All Project
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[89vh] flex flex-col">
          {activeTab === "ProjectDashboard" && (
            <div className="flex-1 overflow-auto">
              <ProjectDashboard />
            </div>
          )}
          {activeTab === "addProject" && (
            <div className="flex-1 overflow-auto">
              <AddProject setActiveTab={setActiveTab} />
            </div>
          )}
          {activeTab === "allProject" && (
            <div className="flex-1 h-full">
              {(() => {
                if (userType === "client") {
                  return <ClientAllProjects />;
                }
                return <AllProjects />;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
