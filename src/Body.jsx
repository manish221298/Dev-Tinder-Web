import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./menubar/Navbar";
import Sidebar from "./menubar/Sidebar";
import Footer from "./menubar/Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl, getToken } from "./utils/constants";
import { addUser } from "./utils/userSlice";

const Body = () => {
  const userData = useSelector((state) => state.user);
  const navigation = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = getToken();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    fetchData();
    if (!token) {
      navigation("/login");
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/profile/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(addUser(res?.data?.userData));
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className={`flex-1 flex flex-col ${token && !isLoginPage ? "lg:ml-0" : ""}`}>
          <main className="flex-grow pb-20 px-4 lg:px-8">
            <Outlet />
          </main>
          {token && !isLoginPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Body;
