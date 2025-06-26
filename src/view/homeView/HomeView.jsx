/* eslint-disable no-unused-vars */

import {
  ClientDashboard,
  SalesDashboard,
  WBTDashboard,
} from "../../components";

const HomeView = () => {
  const userType = sessionStorage.getItem("userType");
  return (
    <div className="w-full">
      {userType === "client" && <ClientDashboard />}
      {userType === "sales" && <SalesDashboard />}
      {userType !== "client" && userType !== "sales" && <WBTDashboard />}
    </div>
  );
};

export default HomeView;
