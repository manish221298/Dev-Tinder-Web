import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
  name: 'questions',
  initialState: null,
  reducers: {
    addQuestion: (state, action) => action.payload,
  },
});

export const { addQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;

