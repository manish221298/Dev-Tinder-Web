import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import Login from "./auth/Login";
import Profile from "./auth/Profile";
import Feed from "./components/Feed";
import { Provider } from "react-redux";
import store from "./utils/appStore";
import { Toaster } from "react-hot-toast";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
