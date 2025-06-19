import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorData: [],
  vendorUserData: [],
};

const vendorSlice = createSlice({
  name: "vendorData",
  initialState,
  reducers: {
    loadVendor: (state, action) => {
      state.vendorData = action.payload;
    },
    addVendor: (state, action) => {
      state.vendorData.push(action.payload);
    },
    deleteVendor: (state, action) => {
      state.vendorData = state.vendorData.filter(
        (vendor) => vendor.id !== action.payload
      );
    },
    loadVendorUser: (state, action) => {
      state.vendorUserData = action.payload;
    },
    addVendorUser: (state, action) => {
      state.vendorUserData.push(action.payload);
    },
    deleteVendorUser: (state, action) => {
      state.vendorUserData = state.vendorUserData.filter(
        (vendor) => vendor.id !== action.payload
      );
    },
  },
});

export const {
  addVendor,
  loadVendor,
  deleteVendor,
  loadVendorUser,
  addVendorUser,
  deleteVendorUser,
} = vendorSlice.actions;

export default vendorSlice.reducer;
