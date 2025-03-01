import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${baseUrl}/user/signin`, {
        email,
        password,
      });
      localStorage.setItem("token", res?.data?.token);
      dispatch(addUser(res?.data));
      navigation("/profile");
    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        toast.error(err.response.data);
      }
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${baseUrl}/user/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(res?.data);
      setIsLogin(true);
    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        toast.error(err.response.data);
      }
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-200 w-100">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLogin ? "Login" : "SignUp"}
          </h2>
          <div>
            {!isLogin && (
              <>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name*</legend>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    placeholder="Enter First Name"
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input"
                    placeholder="Enter Last Name"
                  />
                </fieldset>
              </>
            )}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Id*</legend>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="xyz@gmail.com"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password*</legend>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="********"
              />
            </fieldset>
          </div>

          <div className="card-actions justify-center items-center ">
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              className="btn btn-success px-5"
            >
              {isLogin ? "Login" : "SignUp"}
            </button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary underline cursor-pointer px-8 text-lg"
            >
              {isLogin ? "SignUp" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
