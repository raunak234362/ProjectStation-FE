/* eslint-disable react/prop-types */

import { useState } from "react";
import AddDepartment from "../../components/Team/AddDepartment";
import AddEmployee from "../../components/Team/AddEmployee";
import AllDepartment from "../../components/Team/AllDepartment";
import TeamDashboard from "../../components/Team/teamDashboard/TeamDashboard";
import { AllEmployees } from "../../components";

const ManageTeam = () => {
  //   console.log("RFQ Component Rendered with projectData:", projectData);
  const [activeTab, setActiveTab] = useState("allEmployee");
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">Team Detail</h1>
          <div className="flex w-full overflow-x-auto space-x-2">
            {(userType === "admin" || userType === "human-resource") && (
              <button
                onClick={() => setActiveTab("addEmployee")}
                className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "addEmployee"
                    ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                    : "md:text-base text-sm bg-white"
                  }`}
              >
                Add Employee
              </button>
            )}
            <button
              onClick={() => setActiveTab("allEmployee")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allEmployee"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
                }`}
            >
              All Employee
            </button>
            {(userType === "admin" || userType === "human-resource") && (
              <>
                <button
                  onClick={() => setActiveTab("addDepartment")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "addDepartment"
                      ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                      : "md:text-base text-sm bg-white"
                    }`}
                >
                  Add Department
                </button>
                <button
                  onClick={() => setActiveTab("allDepartment")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "allDepartment"
                      ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                      : "md:text-base text-sm bg-white"
                    }`}
                >
                  All Department
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab("teamDashboard")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${activeTab === "teamDashboard"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
                }`}
            >
              Team Dashboard
            </button>
          </div>
        </div>
        <div className="flex-grow p-2">
          {activeTab === "allEmployee" && (
            <div>
              <AllEmployees />
            </div>
          )}
          {activeTab === "addDepartment" && (
            <div>
              {" "}
              <AddDepartment />{" "}
            </div>
          )}
          {activeTab === "addEmployee" && (
            <div>
              {" "}
              <AddEmployee />{" "}
            </div>
          )}
          {activeTab === "allDepartment" && (
            <div>
              {" "}
              <AllDepartment />{" "}
            </div>
          )}
          {activeTab === "teamDashboard" && (
            <div>
              {" "}
              <TeamDashboard />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
