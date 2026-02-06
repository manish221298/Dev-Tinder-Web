'use client';

import axios from 'axios';
import { useEffect } from 'react';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '@/lib/store/slices/feedSlice';
import UserCard from '@/components/auth/UserCard';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-500 mb-2">
            No New Users
          </h1>
          <p className="text-gray-400">Check back later for new connections!</p>
        </div>
      </div>
    );
  }

  return (
    feedData && (
      <div className="flex justify-center items-center min-h-[70vh] px-4 py-10">
        <UserCard feedData={feedData[0]} />
      </div>
    )
  );
};

export default Feed;

