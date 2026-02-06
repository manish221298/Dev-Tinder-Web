'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';

const Navbar = () => {
  const userData = useSelector((state) => state.user);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="flex-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-xl font-bold text-gray-800 hover:text-blue-600 hover:scale-105 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Dev Tinder
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Welcome,{' '}
            <span className="text-blue-600 font-semibold">
              {userData?.firstName || 'User'}
            </span>
          </span>
        </div>
        <div className="relative inline-block">
          <div className="w-10 h-10 rounded-full ring-2 ring-blue-600 ring-offset-2 ring-offset-white overflow-hidden">
            <img
              alt="User avatar"
              src={
                userData?.photo ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              }
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

