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
      dispatch(addRequest(res?.data?.requestedData));
      _requestStatus("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requestStatus]);

  return (
    <div>
      <h1 className="text-3xl text-bold flex my-5 justify-center">
        REQUEST RECEIVED
      </h1>
      <Table
        headers={headers}
        connectionData={requestData}
        _requestStatus={_requestStatus}
      />
    </div>
  );
};

export default Requests;
