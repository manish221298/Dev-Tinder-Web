import axios from "axios";
import React, { useEffect } from "react";
import { baseUrl, getToken } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "../auth/UserCard";

const Feed = () => {
  const feedData = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/feed?page=&limit=10`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      dispatch(addFeed(res?.data?.feedUsers));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (feedData?.length <= 0) {
    return (
      <h1 className="flex text-2xl my-5 justify-center items-center text-primary">
        New user not exist
      </h1>
    );
  }

  return (
    feedData && (
      <div className="flex justify-center my-10">
        <UserCard feedData={feedData[0]} />
      </div>
    )
  );
};

export default Feed;
