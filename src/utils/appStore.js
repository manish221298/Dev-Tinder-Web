import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import feedReducer from "../utils/feedSlice";
import connectionsReducer from "../utils/connectionsSlice";
import requestsReducer from "../utils/requestsSlice";
import questionsReducer from "../utils/questionsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
    questions: questionsReducer, // Assuming you have a questionsSlice
  },
});

export default store;
