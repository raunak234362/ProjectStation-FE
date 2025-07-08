import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rfqData: [],
  rfqRecord: [],
};

const rfqSlice = createSlice({
  name: "rfq",
  initialState,
  reducers: {
    addRFQ: (state, action) => {
      state.rfqData.push(action.payload);
    },
    showRFQs: (state, action) => {
      state.rfqData = action.payload;
    },
    deleteRFQ: (state, action) => {
      state.rfqData = state.rfqData.filter((rfq) => rfq.id !== action.payload);
    },
    updateRFQ: (state, action) => {
      state.rfqData = state.rfqData.map((rfq) =>
        rfq.id === action.payload.id ? { ...rfq, ...action.payload } : rfq,
      );
    },
    showRFQRecord: (state, action) => {
      state.rfqRecord = action.payload;
    },
  },
});

export const { addRFQ, showRFQs, deleteRFQ, updateRFQ, showRFQRecord } = rfqSlice.actions;

export default rfqSlice.reducer;