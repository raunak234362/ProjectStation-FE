/* eslint-disable no-unused-vars */

import { ClientDashboard, WBTDashboard } from "../../components";

const HomeView = () => {
    const userType = sessionStorage.getItem("userType");
    return (
        <div className="w-full">
            {userType === "client" ? (<ClientDashboard />) : (<WBTDashboard />)}
        </div>
    )
}

export default HomeView
