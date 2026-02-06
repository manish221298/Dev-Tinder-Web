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
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl w-full max-w-md border border-base-300">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-base-content/70">
              {isLogin ? "Sign in to continue" : "Join Dev Tinder today"}
            </p>
          </div>
          
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">First Name *</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Enter First Name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Enter Last Name"
                  />
                </div>
              </>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full focus:input-primary"
                placeholder="xyz@gmail.com"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password *</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full focus:input-primary"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="card-actions flex-col gap-3 mt-6">
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              className="btn btn-primary w-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="btn btn-ghost w-full text-sm"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span className="text-primary font-semibold ml-1">Sign Up</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-primary font-semibold ml-1">Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
