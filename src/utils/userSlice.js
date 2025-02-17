import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      const data = state.filter((state) => state._id !== action.payload);
      return data;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
