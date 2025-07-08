import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import projectReducer from "./projectSlice";
import fabricatorReducer from "./fabricatorSlice";
import vendorReducer from "./vendorSlice";
import taskSlice from './taskSlice'
import rfqSlice from './rfqSlice';
const store = configureStore({
  reducer: {
    userData: userReducer,
    projectData: projectReducer,
    fabricatorData: fabricatorReducer,
    vendorData: vendorReducer,
    taskData: taskSlice,
    rfqData: rfqSlice,
  },
});

export default store;
