/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Provider, useDispatch } from "react-redux";
import store from "./store/store";

import { useCallback, useEffect, useState } from "react";
import { Header, Sidebar } from "./components/index";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Service from "./config/Service";
import socket, { connectSocket } from "./socket";
import useSocketConnection from "./middleware/useSocket";
// import FrappeService from "./frappeConfig/FrappeService";
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
import DashboardView from "./view/dashboard/DashboardView";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [userId, setUserId] = useState(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  const [isConnected, setIsConnected] = useState(false);
  const [result, setResult] = useState(true);
  const userType = sessionStorage.getItem("userType");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await Service.ping();
  //     if (result) setIsConnected(result);
  //     else setResult(result);
  //   };
  //   fetchData();
  // }, []);
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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await Service.getCurrentUser(token);
      dispatch(setUserData(user.data));
      sessionStorage.setItem("userId", user?.data?.id);
      sessionStorage.setItem("username", user?.data?.username);
      const userId = sessionStorage.getItem("userId");
      // socket.emit("joinRoom",userId);
      connectSocket(userId);
      if (socket) {
        // console.log("Socket is already connected:", socket);
        sessionStorage.setItem("socketId", socket.id);
        const socketId = sessionStorage.getItem("socketId");
        socket.on("connect", () => {
          // console.log("✅ Connected with socket:", socketId);
          // console.log("✅ Connected with userID:", userId);
          // socket.emit("joinRoom", userId);
        });
      }
      // console.log(`🔐 Joined room: ${user.data.id}`);
      setUserId(user.data?.id);
      // console.log(user.data);
      try {
        if (userType === "admin" || userType === "manager") {
          const fabricator = await Service?.allFabricator(token);
          dispatch(loadFabricator(fabricator));
          const client = await Service?.allClient(token);
          dispatch(showClient(client));
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
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
      <NotificationReceiver />
      <DashboardView />
    </Provider>
  );
};

export default App;
