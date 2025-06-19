import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import { Button } from "../../index";
import { logout as logoutAction } from "../../../store/userSlice";

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
    { label: "Dashboard", to: "/dashboard", roles: ["admin", "manager", "client", "user", "estimator", "sales"] },
    { label: "Fabricator", to: "fabricator", roles: ["admin", "sales", "department-manager"] },
    { label: "Project", to: "project/projects", roles: ["admin", "manager", "client", "user", "estimator", "sales"] },
    { label: "RFQ", to: "rfq", roles: ["admin", "sales", "client", "department-manager"] },
    { label: "RFI", to: "rfi", roles: ["admin", "department-manager"] },
    { label: "Submittals", to: "submittals", roles: ["admin", "department-manager"] },
    { label: "Change Order", to: "change-order", roles: ["admin", "department-manager"] },
    { label: "Sales", to: "change-order", roles: ["admin", "department-manager"] },
    { label: "Manage Team", to: "team/all-employees", roles: ["admin", "department-manager", "human-resource"] },
    { label: "Chats", to: "chats", roles: ["admin", "manager", "client", "department-manager"] },
    { label: "Profile", to: "profile", roles: ["admin", "user", "client", "estimator", "sales", "department-manager", "human-resource"] },
  ];

  const canView = (roles) => roles.includes(userType);

  return (
    <div className="md:h-screen h-[95vh] w-64 bg-white/70 md:border-4 text-black md:rounded-xl rounded-lg flex flex-col justify-between">
      <nav className="p-0 md:p-5 space-y-3">
        <img src="logo.png" alt="" className="md:block hidden" />
        <ul className="flex flex-col gap-5">
          {navItems.map(
            ({ label, to, roles }) =>
              canView(roles) && (
                <li key={label}>
                  <NavLink
                    to={to}
                    end={to === "/dashboard"} // 👈 Add this line
                    className={({ isActive }) =>
                      isActive
                        ? "flex justify-center items-center text-white bg-teal-400 rounded-md w-full delay-150"
                        : "text-black hover:text-white hover:bg-teal-200 flex justify-start items-center rounded-md"
                    }
                  >
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
