import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectData: [],
  rfiData: [],
  submittals: [],
  changeOrder: [],
  workBreakdown: [],
  milestones: [],
};

const projectSlice = createSlice({
  name: "projectData",
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projectData.push(action.payload);
      localStorage.setItem("projectData", JSON.stringify(state.projectData));
    },
    showProjects: (state, action) => {
      state.projectData = action.payload;
    },
    updateProjectData: (state, action) => {
      state.projectData = state.projectData.map((project) =>
        project.id === action.payload.id
          ? { ...project, ...action.payload }
          : project
      );
    },
    deleteProject: (state, action) => {
      state.projectData = state.projectData.filter(
        (project) => project.id !== action.payload
      );
    },
    addWorkBreakdown: (state, action) => {
      state.workBreakdown.push(action.payload);
    },
    updateWorkBreakdown: (state, action) => {
      state.workBreakdown = state.workBreakdown.map((work) =>
        work.id === action.payload.id ? { ...work, ...action.payload } : work
      );
    },
    addCO: (state, action) => {
      state.changeOrder.push(action.payload);
      localStorage.setItem("changeOrder", JSON.stringify(state.changeOrder));
    },
    showCO: (state, action) => {
      state.changeOrder = action.payload;
    },
    deleteCO: (state, action) => {
      state.changeOrder = state.changeOrder.filter(
        (changeOrder) => changeOrder.id !== action.payload
      );
    },
    updateCO: (state, action) => {
      state.changeOrder = state.changeOrder.map((co) =>
        co.id === action.payload.id ? { ...co, ...action.payload } : co
      );
    },
    updateCO: (state, action) => {
      state.changeOrder = state.changeOrder.map((co) =>
        co.id === action.payload.id ? { ...co, ...action.payload } : co
      );
    },
    addRFI: (state, action) => {
      state.rfiData.push(action.payload);
      localStorage.setItem("rfiData", JSON.stringify(state.rfiData));
    },
    showRFIs: (state, action) => {
      state.rfiData = action.payload;
    },
    deleteRFI: (state, action) => {
      state.rfiData = state.rfiData.filter((rfi) => rfi.id !== action.payload);
    },
    showMilestones: (state, action) => {
      state.milestones = action.payload;
    },
    addMilestone: (state, action) => {
      state.milestones.push(action.payload);
    },
    updateMilestoneData: (state, action) => {
      state.milestones = state.milestones.map((milestone) =>
        milestone.id === action.payload.id
          ? { ...milestone, ...action.payload }
          : milestone
      );
    },
    deleteMilestone: (state, action) => {
      state.milestones = state.milestones.filter(
        (milestone) => milestone.id !== action.payload
      );
    },
  },
});

export const {
  addProject,
  showProjects,
  updateProjectData,
  deleteProject,
  addCO,
  showCO,
  deleteCO,
  updateCO,
  addRFI,
  showRFIs,
  deleteRFI,
  showMilestones,
  addMilestone,
  updateMilestoneData,
  deleteMilestone,
} = projectSlice.actions;

export default projectSlice.reducer;
