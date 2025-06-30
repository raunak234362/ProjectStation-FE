/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import LOGO from "../../assets/logo.png";
import Background from "../../assets/background-image.jpg";
import { Input, Button } from "../index";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatetoken as authLogin, setUserData } from "../../store/userSlice";
import AuthService from "../../config/AuthService";
import Service from "../../config/Service";
import { useState } from "react";

const getUserType = (user) => {
  if (user.role === "STAFF") {
    if (user.is_est && user.is_superuser) return "estimator";
    if (user.is_superuser) return "admin";
    if (user.is_sales) return "sales";
    if (user.is_staff && user.is_manager) return "department-manager";
    if (user.is_manager) return "project-manager";
    if (user.is_hr) return "human-resource";
    return "user";
  } else if (user.role === "CLIENT") return "client";
  else if (user.role === "VENDOR") return "vendor";
  return "user";
};

const roleRedirectMap = {
  admin: "/dashboard",
  estimator: "/dashboard",
  "human-resource": "/dashboard",
  client: "/dashboard",
  sales: "/dashboard",
  user: "/dashboard",
  "department-manager": "/dashboard",
  "project-manager": "/dashboard",
  vendor: "/vendor",
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const userInfo = useSelector((state) => state?.userData?.userData);
  const login = async (data) => {
    try {
      const user = await AuthService.login(data);
      if (!user?.token) throw new Error("Invalid Credentials");

      const token = user.token;
      const userData = await Service.getCurrentUser(token);
      const userType = getUserType(userData.data);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userData.data.id);
      sessionStorage.setItem("username", userData.data.username);
      sessionStorage.setItem("userType", userType);

      dispatch(authLogin(user));
      dispatch(setUserData(userData.data));

      if (userData.data.is_firstLogin) {
        return navigate("/change-password/");
      }

      const redirectPath = roleRedirectMap[userType] || "/";
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.message === "Invalid Credentials"
          ? "Invalid username or password."
          : "Could not connect to server. Try again later."
      );
    }
  };

  return (
    <div className="relative">
      {/* Background blur */}
      <img
        src={Background}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover blur-[8px] z-0"
      />

      <div className="relative z-10 grid w-screen h-screen grid-cols-1 md:grid-cols-2">
        {/* Logo section */}
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center px-2 mx-20 bg-white border-4 bg-opacity-70 rounded-2xl md:py-14 md:px-20">
            <img src={LOGO} alt="Logo" />
          </div>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center">
          <div className="bg-white bg-opacity-90 h-fit w-[80%] md:w-2/3 rounded-2xl shadow-lg border-4 border-green-500 p-5">
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
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
