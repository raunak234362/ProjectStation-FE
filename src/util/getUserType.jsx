const getUserType = (user) => {
  if (user.role === "STAFF") {
    if (user.is_est && user.is_superuser) return "estimator";
    if (user.is_superuser) return "admin";
    if (user.is_sales) return "sales";
    if (user.is_estHead) return "estimator-head";
    if (user.is_staff && user.is_manager) return "department-manager";
    if (user.is_manager) return "project-manager";
    if (user.is_hr) return "human-resource";
    return "user";
  } else if (user.role === "CLIENT") return "client";
  else if (user.role === "VENDOR") return "vendor";
  return "user";
};

export default getUserType;
