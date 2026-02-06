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
    <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl w-full max-w-md border border-base-300 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
      <figure className="relative overflow-hidden rounded-t-2xl">
        <img
          src={
            feedData?.photo ||
            "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          }
          alt="Profile"
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 to-transparent"></div>
      </figure>
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="card-title text-2xl font-bold">
            {feedData?.firstName + " " + feedData?.lastName}
          </h2>
        </div>
        
        {feedData?.nationality && (
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="badge badge-primary badge-lg">{feedData?.nationality}</span>
          </div>
        )}
        
        {feedData?.bio && (
          <div className="mb-4">
            <p className="text-base-content/80 leading-relaxed line-clamp-3">{feedData?.bio}</p>
          </div>
        )}
        
        <div className="card-actions justify-center gap-3 mt-4">
          <button
            onClick={() => handleCards("ignored", feedData?._id)}
            className="btn btn-error btn-lg flex-1 hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Ignore
          </button>
          <button
            onClick={() => handleCards("interested", feedData?._id)}
            className="btn btn-primary btn-lg flex-1 hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
