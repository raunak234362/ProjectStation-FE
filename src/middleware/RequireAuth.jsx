// src/util/RequireAuth.jsx
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
