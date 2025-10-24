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
import { userData } from "../../signals";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    try {
      const user = await AuthService.login(data);
      if (!user?.token) throw new Error("Invalid Credentials");

      const token = user.token;
      const userDetail = await Service.getCurrentUser(token);
      console.log(userDetail?.data?.is_firstLogin,"-=========-")
      // Store session data
      sessionStorage.setItem("token", token);
      userData.value = user;
      dispatch(authLogin(user));
      if (userDetail?.data?.is_firstLogin) navigate("/change-password/");
      else navigate("/dashboard");
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
        <div className="flex items-center bg-black/50 backdrop-blur-lg justify-center">
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
