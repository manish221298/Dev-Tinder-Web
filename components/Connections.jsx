'use client';

import React, { useEffect } from 'react';
import Table from '@/components/ui/Table';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '@/lib/store/slices/connectionsSlice';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';

const headers = ['Name', 'Nationality', 'Email', 'Chat'];

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
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
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
          Connections
        </h1>
        <p className="text-gray-600">Manage your professional network</p>
      </div>
      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-lg">
        <div className="p-6">
          <Table headers={headers} connectionData={connectionData} />
        </div>
      </div>
    </div>
  );
};

export default Connections;

