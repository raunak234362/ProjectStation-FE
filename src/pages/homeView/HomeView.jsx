import { useEffect, useState } from "react";
import {
  ClientDashboard,
  SalesDashboard,
  WBTDashboard,
} from "../../components";

const HomeView = () => {
  const [userType, setUserType] = useState(() =>
    sessionStorage.getItem("userType")
  );

  useEffect(() => {
    // Immediately update userType when component mounts
    setUserType(sessionStorage.getItem("userType"));

    // Optional: Keep the focus event listener for real-time updates
    const handleFocus = () => {
      setUserType(sessionStorage.getItem("userType"));
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="w-full">
      {userType === "client" && <ClientDashboard />}
      {userType === "sales" && <SalesDashboard />}
      {userType !== "client" && userType !== "sales" && <WBTDashboard />}
    </div>
  );
};

export default HomeView;
