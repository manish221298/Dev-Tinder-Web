import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./menubar/Navbar";
import Footer from "./menubar/Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseUrl, getToken } from "./utils/constants";
import { addUser } from "./utils/userSlice";

const Body = () => {
  const userData = useSelector((state) => state.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    if (!getToken()) {
      navigation("/login");
    }
  }, [getToken()]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/profile/list`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      dispatch(addUser(res?.data?.userData));
    } catch (err) {}
  };

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
