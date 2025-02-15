import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [email, setEmail] = useState("mandani@gmail.com");
  const [password, setPassword] = useState("Test@123");

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${baseUrl}/user/signin`, {
        email,
        password,
      });
      dispatch(addUser(res?.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-200 w-100">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
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

          <div className="card-actions justify-center">
            <button onClick={handleLogin} className="btn btn-success">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
