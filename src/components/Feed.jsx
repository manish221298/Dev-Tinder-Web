import axios from "axios";
import React, { useEffect } from "react";
import { baseUrl, getToken } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";

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
      dispatch(addFeed(res.data.feedUsers[3]));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-200 w-96 shadow-sm">
        <figure>
          <img
            src={
              feedData?.photo ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {feedData?.firstName + " " + feedData?.lastName}
          </h2>
          <p>{feedData?.gender + ", " + feedData?.nationality}</p>
          <p>{feedData?.bio}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-error">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
