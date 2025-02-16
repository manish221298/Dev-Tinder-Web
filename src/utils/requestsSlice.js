import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
    removeRequest: (state, action) => null,
  },
});

export const { addRequest, removeRequest } = requestsSlice.actions;

export default requestsSlice.reducer;
