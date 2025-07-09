import { useCallback, useState } from "react";
import { Header, Sidebar } from "../../components";
import { Outlet } from "react-router-dom";
import NotificationReceiver from "../../util/NotificationReceiver";
import { Toaster } from "react-hot-toast"; // <--- Add this

const DashboardView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden md:flex-row bg-gradient-to-br from-gray-700 to-teal-200">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "1.25rem",
            padding: "20px 24px",
            minWidth: "350px",
          },
        }}
      />
      <div className="flex flex-col w-full">
        <NotificationReceiver />
        <div className="md:hidden mx-2 my-2 shadow-2xl drop-shadow-lg">
          <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex flex-row">
          {/* Sidebar */}
          <div
            className={`fixed md:static flex flex-col md:bg-opacity-0 bg-white w-64 z-20 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0 md:w-64`}
          >
            <div className="flex items-center justify-between pl-2">
              <Sidebar />
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`flex w-full mx-2 border-4 rounded-lg border-white bg-gradient-to-t from-gray-50/70 to-gray-100/50 overflow-hidden flex-grow transition-all duration-300 ${sidebarOpen ? "md:ml-64 bg-black/80" : ""
              }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
