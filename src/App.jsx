/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";

import { useCallback, useEffect, useState } from "react";
import { Header, Sidebar } from "./components/index";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Service from "./config/Service";
import socket, { connectSocket } from "./socket";
import useSocketConnection from "./middleware/useSocket";
import {
  setUserData,
  showDepartment,
  showStaff,
  showTeam,
} from "./store/userSlice";
import { loadFabricator, showClient } from "./store/fabricatorSlice";
import { showProjects } from "./store/projectSlice";
import { ToastContainer } from "react-toastify";
import { showTask } from "./store/taskSlice";
import NotificationReceiver from "./util/NotificationReceiver";
import DashboardView from "./pages/dashboard/DashboardView";
import getUserType from "./util/getUserType";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [userId, setUserId] = useState(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const fetchAllProjects = async () => {
    const projectData = await Service.allprojects(token);
    dispatch(showProjects(projectData?.data));
  };

  const fetchAllTasks = async () => {
    const taskData = await Service.getAllTask(token);
    dispatch(showTask(taskData));
  };

  const fetchAllDepartments = async () => {
    const departmentData = await Service.allDepartment();
    dispatch(showDepartment(departmentData));
  };

  const fetchAllTeams = async () => {
    const teamData = await Service.allteams(token);
    dispatch(showTeam(teamData?.data));
  };

  const fetchAllStaff = async () => {
    const staffData = await Service.allEmployee(token);
    dispatch(showStaff(staffData));
  };

  const fetchUser = async () => {
    try {
      const response = await Service.getCurrentUser(token);
      const userData = response.data;
      const userType = getUserType(userData);

      dispatch(setUserData(userData));
      sessionStorage.setItem("userId", userData.id);
      sessionStorage.setItem("username", userData.username);
      sessionStorage.setItem("userType", userType);

      const userId = userData.id;
      setUserId(userId);

      connectSocket(userId);
      if (socket) {
        sessionStorage.setItem("socketId", socket.id);
        socket.on("connect", () => {
          // Optional log or action
        });
      }

      if (["admin", "department-manager"].includes(userType)) {
        const fabricator = await Service.allFabricator(token);
        dispatch(loadFabricator(fabricator));
        const client = await Service.allClient(token);
        dispatch(showClient(client));
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchAllTeams();
    fetchAllStaff();
    fetchAllDepartments();
    fetchAllTasks();
    fetchAllProjects();
    fetchUser();
  }, [dispatch]);

  useSocketConnection(userId);

  return (
    <Provider store={store}>
     
      <DashboardView />
    </Provider>
  );
};

export default App;
