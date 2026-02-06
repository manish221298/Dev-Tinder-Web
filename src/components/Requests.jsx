import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import Table from "../ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/requestsSlice";

const headers = ["Name", "Nationality", "Email", "Actions"];

const Requests = () => {
  const dispatch = useDispatch();
  const requestData = useSelector((state) => state.requests);
  const [requestStatus, _requestStatus] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/request/received`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("log data", res.data.data);

      dispatch(addRequest(res?.data?.data));
      _requestStatus("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requestStatus]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 inline-block mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Connection Requests
        </h1>
        <p className="text-base-content/70">Review and manage incoming requests</p>
      </div>
      <div className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300">
        <div className="card-body p-6">
          <Table
            headers={headers}
            connectionData={requestData}
            _requestStatus={_requestStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Requests;
