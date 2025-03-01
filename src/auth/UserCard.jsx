import React from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ feedData }) => {
  const dispatch = useDispatch();

  const handleCards = async (status, fromUserId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/request/send/${status}/${fromUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      dispatch(removeFeed(fromUserId));
    } catch (err) {
      console.log(err);
    }
  };

  if (feedData?.length <= 0) {
    return <h1 className="items-center text-primary">New user not exist</h1>;
  }

  return (
    <div className="card bg-base-200 w-96 shadow-sm">
      <figure className="mt-2">
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
        <p>{"Nationality:" + " " + feedData?.nationality}</p>
        <p>{feedData?.bio}</p>
        <div className="card-actions justify-center">
          <button
            onClick={() => handleCards("ignored", feedData?._id)}
            className="btn btn-error"
          >
            Ignore
          </button>
          <button
            onClick={() => handleCards("interested", feedData?._id)}
            className="btn btn-secondary"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
