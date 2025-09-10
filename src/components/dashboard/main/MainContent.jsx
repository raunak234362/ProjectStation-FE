/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../../signals/userData.js";

const MainContent = () => {
  // Select the userData from the Redux store
  const userInfo = useSelector((state) => state?.userData?.userData);
  const [showChangePassword, setShowChangePassword] = useState(false);
  console.log(userInfo);

  const userDetail = userData.value;
  console.log(userDetail, "================UserData from signal in Profile===============");

  const toggleChangePasswordModal = () => {
    setShowChangePassword(!showChangePassword);
  };

  return (
    <div className="md:m-4 m-2 w-full">
      <div className="flex bg-white md:mx-0 mx-2 justify-center rounded-xl">
        <div className="px-5 py-2 text-teal-400 text-lg md:text-2xl font-semibold">
          Profile
        </div>
      </div>
      <div className="bg-white md:mx-0 mx-2 px-2 rounded-lg mt-2">
        <div className="flex flex-row w-full">
          <div className="block mb-1 w-fit min-w-32 font-semibold">Name:</div>
          <div>
            {userInfo?.f_name} {userInfo?.m_name} {userInfo?.l_name}
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="block mb-1 w-fit min-w-32 font-semibold">
            Designation:
          </div>
          <div>{sessionStorage.getItem("userType")?.toUpperCase()}</div>
        </div>
        <div className="flex flex-row w-full">
          <div className="block mb-1 w-fit min-w-32 font-semibold">
            Username:
          </div>
          <div>{userInfo?.username}</div>
        </div>
        <div className="flex flex-row w-full">
          <div className="block mb-1 w-fit min-w-32 font-semibold">
            Mail ID:
          </div>
          <div>{userInfo?.email}</div>
        </div>
        <div className="flex flex-row w-full">
          <div className="block mb-1 w-fit min-w-32 font-semibold">
            Contact No.:
          </div>
          <div>{userInfo?.phone}</div>
        </div>
      </div>

      {/* Conditionally render the ChangePassword modal */}
      {/* {showChangePassword && (
        <ChangePassword onClose={toggleChangePasswordModal} />
      )} */}
    </div>
  );
};

export default MainContent;
