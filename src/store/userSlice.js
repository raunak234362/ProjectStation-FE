import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: false,
  userData: {},
  departmentData: [],
  teamData: [],
  staffData: [],
};

const userSlice = createSlice({
  name: "userdata",
  initialState,
  reducers: {
    login: (state, action) => {
      // state.token = action.payload.token;
      state.userData = action.payload;
      sessionStorage.setItem("token", action.payload.token);
    },
    setUserData: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload;
    },
    addStaff: (state, action) => {
      state.staffData.push(action.payload);
    },
    showStaff: (state, action) => {
      state.staffData = action.payload;
    },
    updateStaffData: (state, action) => {
      state.staffData = state.staffData.map((staff) =>
        staff.id === action.payload.id ? { ...staff, ...action.payload } : staff
      );
    },
    addTeam: (state, action) => {
      state.teamData.push(action.payload);
    },
    showTeam: (state, action) => {
      state.teamData = action.payload;
    },
    updateTeamData: (state, action) => {
      state.teamData = state.teamData.map((team) =>
        team.id === action.payload.id ? { ...team, ...action.payload } : team
      );
    },
    addDepartment: (state, action) => {
      if (!Array.isArray(state.departmentData)) {
        state.departmentData = [];
      }
      state.departmentData.push(action.payload);
    },
    updateDepartmentData: (state, action) => {
      state.departmentData = state.departmentData.map((department) =>
        department.id === action.payload.id
          ? { ...department, ...action.payload }
          : department
      );
    },
    showDepartment: (state, action) => {
      state.departmentData = action.payload;
    },
    logout: (state) => {
      state.token = false;
      state.userData = null;
      sessionStorage.removeItem("token");
    },
    updatetoken: (state, action) => {
      state.token = action.payload.token;
      sessionStorage.setItem("token", action.payload.token);
    },
  },
});

export const {
  login,
  showStaff,
  addStaff,
  setUserData,
  updateStaffData,
  updateTeamData,
  addDepartment,
  showDepartment,
  addTeam,
  showTeam,
  updatetoken,
  updateDepartmentData,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
