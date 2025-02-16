import React, { useEffect } from "react";
import Table from "../ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";

const headers = ["Name", "Nationality", "Email", "Bio"];

const Connections = () => {
  const dispatch = useDispatch();

  const connectionData = useSelector((state) => state.connections);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/connection/accepted`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      dispatch(addConnections(res?.data?.myConnection));
    } catch (err) {
      //   console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-bold flex my-5 justify-center">
        CONNECTIONS
      </h1>
      <Table headers={headers} connectionData={connectionData} />
    </div>
  );
};

export default Connections;
