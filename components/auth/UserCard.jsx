'use client';

import React from 'react';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { useDispatch } from 'react-redux';
import { removeFeed } from '@/lib/store/slices/feedSlice';

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
    return <h1 className="items-center text-blue-600">New user not exist</h1>;
  }

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl w-full max-w-md border border-gray-200 rounded-lg hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
      <figure className="relative overflow-hidden rounded-t-lg">
        <img
          src={
            feedData?.photo ||
            'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          }
          alt="Profile"
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
      </figure>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">
            {feedData?.firstName + ' ' + feedData?.lastName}
          </h2>
        </div>

        {feedData?.nationality && (
          <div className="flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {feedData?.nationality}
            </span>
          </div>
        )}

        {feedData?.bio && (
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {feedData?.bio}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => handleCards('ignored', feedData?._id)}
            className="flex-1 px-4 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Ignore
          </button>
          <button
            onClick={() => handleCards('interested', feedData?._id)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

