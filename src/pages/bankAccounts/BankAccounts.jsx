import { useState } from "react";
import { AddBankAccount, AllBankAccounts } from "../../components";
import ClientAllProjects from "../../components/project/ClientAllProjects";
import ProjectDashboard from "../../components/project/ProjectDashboard";

const BankAccounts = () => {
  const [activeTab, setActiveTab] = useState("allAccounts");
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="px-3 flex flex-col justify-between items-start bg-gradient-to-t from-teal-100 to-teal-400 border-b rounded-md ">
          <h1 className="text-2xl py-2 font-bold text-white">
            Accounts Detail
          </h1>
          <div className="flex space-x-2 overflow-x-auto">
          
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("addAccount")}
                  className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${
                    activeTab === "addAccount"
                      ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                      : "md:text-base text-sm bg-white"
                  }`}
                >
                  Add Accounts
                </button>
              </div>
            
            <button
              onClick={() => setActiveTab("allAccounts")}
              className={`px-1.5 md:px-4 py-2 rounded-lg rounded-b ${
                activeTab === "allAccounts"
                  ? "text-base md:text-base bg-teal-500 text-white font-semibold"
                  : "md:text-base text-sm bg-white"
              }`}
            >
              All Accounts
            </button>
          </div>
        </div>
        <div className="flex-grow p-2 h-[85vh] overflow-y-auto">
          {activeTab === "addAccount" && (
            <div>
              <AddBankAccount />
            </div>
          )}
          {activeTab === "allAccounts" && (
            <div>
              <AllBankAccounts />
            </div>
          )}9
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;
