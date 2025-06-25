/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import LOGO from "../../assets/logo.png";
import Background from "../../assets/background-image.jpg";
import { Input, Button } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { MdLockReset } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updatetoken as authLogin, setUserData } from "../../store/userSlice";
import AuthService from "../../config/AuthService";
// import AuthService from "../../frappeConfig/AuthService";
import Service from "../../config/Service";
import { useEffect, useState } from "react";
import { logout as logoutAction } from "../../store/userSlice";
import socket from "../../socket";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo,setUserInfo] = useState();
  const token = sessionStorage.getItem("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    try {
      const user = await AuthService.login(data);
      setUserInfo(user);
      console.log(user);
      if ("token" in user) {
        const token = user.token;
        const userData = await Service.getCurrentUser(token);
        let userType = "user";
        if (userData.data.role === "STAFF") {
          if (userData.data.is_est && userData.data.is_superuser) {
            userType = "estimator";
          } else if (userData.data.is_superuser) {
            userType = "admin";
          } else if (userData.data.is_sales) {
            userType = "sales";
          } else if (userData.data.is_staff && userData.data.is_manager) {
            userType = "department-manager";
          } else if (userData.data.is_manager) {
            userType = "project-manager";
          } else if (userData.data.is_hr) {
            userType = "human-resource";
          }
        } else if (userData.data.role === "CLIENT") {
          userType = "client";
        } else if (userData.data.role === "VENDOR") {
          userType = "vendor";
        }
        sessionStorage.setItem("userType", userType);
        dispatch(authLogin(user));
        dispatch(setUserData(userData.data));
        if (userData.data?.is_firstLogin) navigate("/change-password/");
        else if (userType === "admin") navigate("dashboard");
        else if (userType === "estimator") navigate("dashboard");
        else if (userType === "human-resource") navigate("dashboard");
        else if (userType === "client") navigate("dashboard");
        else if (userType === "sales") navigate("sales");
        else if (userType === "user") navigate("dashboard");
        else if (userType === "department-manager")
          navigate("dashboard");
        else if (userType === "project-manager")
          navigate("dashboard");
        else if (userType === "vendor") navigate("vendor");
        else navigate("/");
      } else {
        alert("Invalid Credentials Check");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.message === "Invalid Credentials") {
        alert("Invalid Credentials");
      } else {
        alert("Could not connect to server");
      }
    }
  };

  return (
    <div className="">
      <div className="fixed z-10 grid w-screen grid-cols-1 md:grid-cols-2">
        <div
          className={`md:flex md:my-0 mt-10 md:h-screen justify-center items-center`}
        >
          <div className="fixed z-10 flex items-center justify-center px-2 mx-20 bg-white border-4 md:w-auto bg-opacity-70 rounded-2xl md:py-14 md:px-20">
            <img src={LOGO} alt="Logo" />
          </div>
        </div>
        <div className="flex items-center justify-center h-screen md:bg-green-400">
          <div className="bg-white md:bg-opacity-100 bg-opacity-60 h-fit w-[80%] md:w-2/3 rounded-2xl shadow-lg shadow-gray-600 border-4 border-white md:border-green-500 p-5">
            <h1 className="mb-10 text-4xl font-bold text-center text-gray-600">
              Login
            </h1>
            <form
              onSubmit={handleSubmit(login)}
              className="flex flex-col w-full gap-5"
            >
              <div>
                <Input
                  label="Username:"
                  placeholder="USERNAME"
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div>
                <Input
                  label="Password:"
                  placeholder="PASSWORD"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="flex justify-center w-full my-5">
                <Button type="submit" className="w-[80%] bg-teal-400">
                  Sign IN
                </Button>
              </div>
            </form>
            <div>
              {/* <div className="flex items-center justify-center">
                <Link
                  to="/forged"
                  className="flex items-center justify-center gap-2 text-blue-500 bg-white"
                >
                  <MdLockReset />
                  Forgot Password ?
                </Link>
              </div> */}
              {/* <Button className="w-full mx-4 bg-teal-400" onClick={fetchLogout}>
                Logout
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <img
          src={Background}
          alt="background"
          className="h-screen w-screen object-cover blur-[8px]"
        />
      </div>
    </div>
  );
};

export default Login;
