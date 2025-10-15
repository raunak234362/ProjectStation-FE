/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Service from "../../config/Service";
import { Button } from "../index";
import { logout as logoutAction } from "../../store/userSlice";
import { Building2, ChartCandlestick, Database, FileChartColumnIncreasing, FileInput, LayoutDashboard, MessageSquare, MessageSquareQuote, ReplaceAll, SquareKanban } from "lucide-react";
import { CgProfile } from "react-icons/cg";
const Sidebar = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const userType = sessionStorage.getItem("userType");
  const [currentUser, setCurrentUser] = useState();

  const fetchUserData = async () => {
    const userData = await Service.getCurrentUser(token);
    setCurrentUser(userData[0]);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logoutAction());
    window.location.href = "/";
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard />, roles: ["admin", "deputy-manager","department-manager","project-manager", "client", "user", "estimator", "sales", "estimator-head"] },
    { label: "Fabricator", to: "fabricator", icon: <Building2 />, roles: ["admin","deputy-manager", "sales", "department-manager"] },
    { label: "Project", to: "project", icon: <SquareKanban />, roles: ["admin","deputy-manager", "PMO","department-manager","project-manager","user", "estimator", "estimator-head"] },
    { label: "RFQ", to: "rfq", icon: <MessageSquareQuote />, roles: ["admin","deputy-manager", "sales", "client", "department-manager"] },
    // { label: "Sales", to: "sales", icon: <ChartCandlestick />, roles: ["admin"] },
    { label: "Estimations", to: "estimation", icon: <ChartCandlestick />, roles: ["admin","deputy-manager", "department-manager","user","sales", "estimator-head"] },
    { label: "Manage Team", to: "team", icon: <Database />, roles: ["admin","deputy-manager", "department-manager", "project-manager", "human-resource"] },
    { label: "Invoices", to: "invoices", icon: <Database />, roles: ["admin", "PMO"] },
    { label: "Chats", to: "chats", icon: <MessageSquare />, roles: ["admin","deputy-manager", "department-manager", "project-manager", "user", "human-resource", "estimator-head"] },
    { label: "Profile", to: "profile", icon: <CgProfile />, roles: ["admin","deputy-manager", "user", "client", "estimator", "sales", "project-manager", "department-manager", "human-resource", "estimator-head"] },
  ];

  const canView = (roles) => roles.includes(userType);

  return (
    <div className="md:h-screen h-[95vh] w-64 bg-white/70 md:border-4 text-black md:rounded-xl rounded-lg flex flex-col justify-between">
      <nav className="p-0 md:p-5 space-y-3">
        <img src="logo.png" alt="" className="md:block hidden" />
        <ul className="flex flex-col gap-5">
          {navItems.map(
            ({ label, to, roles, icon }) =>
              canView(roles) && (
                <li key={label}>
                  <NavLink
                    to={to}
                    end={to === "/dashboard"} // 👈 Add this line
                    className={({ isActive }) =>
                      isActive
                        ? "flex gap-3 justify-center items-center text-white bg-teal-400/50 py-1 rounded-md w-full delay-150"
                        : "text-black gap-3 hover:text-white hover:bg-teal-200 hover:px-4 py-1 flex justify-start items-center rounded-md"
                    }
                  >
                    <div className="text-teal-500">{icon}</div>
                    <div>{label}</div>
                  </NavLink>

                </li>
              )
          )}
        </ul>
      </nav>
      <div className="mb-5 p-4">
        <Button className="w-full bg-teal-400" onClick={handleLogout}>
          Logout
        </Button>
        <div className="block text-center text-black md:hidden mt-2">
          {currentUser?.username}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
