import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  SalesDashboard,
  WBTDashboard,
} from "../../components";
import getUserType from "../../util/getUserType.jsx";
import { useSignals } from "@preact/signals-react/runtime";
import { userData as userSignal } from "../../signals";
import ClientDashboardLYT from "../../components/dashboardComponent/ClientDashboardLYT.jsx";

const HomeView = () => {
  useSignals();
  const user = useSelector((state) => state?.userData?.userData);
  const [fallbackUserType, setFallbackUserType] = useState(() => sessionStorage.getItem("userType"));

  // Keep a fallback from sessionStorage (for refresh), but prefer Redux/signal
  useEffect(() => {
    setFallbackUserType(sessionStorage.getItem("userType"));
  }, []);

  const resolvedUserType = useMemo(() => {
    if (user && Object.keys(user || {}).length) return getUserType(user);
    if (userSignal?.value && Object.keys(userSignal.value || {}).length) return getUserType(userSignal.value);
    return fallbackUserType;
  }, [user, userSignal.value, fallbackUserType]);

  if (!resolvedUserType) {
    // Render nothing or a lightweight placeholder until we know the userType
    return <div className="w-full" />;
  }

  return (
    <div className="w-full">
      {resolvedUserType === "client" && <ClientDashboardLYT />}
      {resolvedUserType === "sales" && <SalesDashboard />}
      {resolvedUserType !== "client" && resolvedUserType !== "sales" && <WBTDashboard />}
    </div>
  );
};

export default HomeView;
