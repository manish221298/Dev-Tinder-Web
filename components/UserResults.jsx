'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

const UserResults = ({ quizSetId }) => {
  const router = useRouter();
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizSetInfo, setQuizSetInfo] = useState(null);

  const fetchUserResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/result/set/${quizSetId}/users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUserResults(res?.data?.userResults || []);

      if (res?.data) {
        setQuizSetInfo({
          setName: res.data.quizSetName,
          quizSetId: res.data.quizSetId,
          totalSubmissions: res.data.totalSubmissions,
        });
      }
    } catch (err) {
      console.error('Error fetching user results:', err);
      toast.error('Failed to load user results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizSetId) {
      fetchUserResults();
    }
  }, [quizSetId]);

  const handleBack = () => {
    router.push('/result');
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      const res = await axios.delete(`${baseUrl}/result/${resultId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success('Result deleted successfully');

      fetchUserResults();
    } catch (err) {
      console.error('Error deleting result:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete result');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-transparent text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-4 flex items-center gap-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Results
        </button>

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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            User Results
          </h1>
          {quizSetInfo && (
            <div className="text-gray-600">
              <p className="mb-1">{quizSetInfo.setName}</p>
              <p className="text-sm">
                Total Submissions:{' '}
                <span className="font-semibold">
                  {quizSetInfo.totalSubmissions || 0}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {userResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-300 mb-4"
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
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            No User Results Found
          </h2>
          <p className="text-gray-400">
            No users have completed this quiz yet.
          </p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-lg">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="font-bold text-base py-4 px-4 text-left">
                      User
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Score
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Correct
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Incorrect
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Percentage
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Submitted At
                    </th>
                    <th className="font-bold text-base py-4 px-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userResults.map((result, index) => {
                    const skippedCount =
                      result.results?.filter(
                        (r) => r.selectedAnswer === null
                      ).length || 0;

                    return (
                      <tr
                        key={result.resultId || result._id || index}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative inline-block">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-600 ring-offset-2 ring-offset-white">
                                <img
                                  src={
                                    result.user?.photo ||
                                    'https://img.daisyui.com/images/profile/demo/2@94.webp'
                                  }
                                  alt="User avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">
                                {result.user?.firstName && result.user?.lastName
                                  ? `${result.user.firstName} ${result.user.lastName}`
                                  : result.user?.email || 'Anonymous User'}
                              </div>
                              {result.user?.email && (
                                <div className="text-sm text-gray-600">
                                  {result.user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full">
                            {result.correctAnswers || 0} /{' '}
                            {result.totalQuestions || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                            {result.correctAnswers || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                            {result.incorrectAnswers || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold">
                            {result.score || 0}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {result.submittedAt
                            ? new Date(result.submittedAt).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDelete(result.resultId)}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 hover:scale-105 transition-transform flex items-center gap-1"
                            title="Delete result"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserResults;

