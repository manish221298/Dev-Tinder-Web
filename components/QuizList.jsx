'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

const QuizList = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchQuizSets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/quiz/list`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setQuizSets(res?.data?.questionSetsSummary || []);
    } catch (err) {
      console.error('Error fetching quiz sets:', err);
      toast.error('Failed to load quiz sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizSets();
  }, []);

  const handleSelectQuiz = (quizSetId) => {
    router.push(`/quiz/${quizSetId}`);
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Quiz Sets
        </h1>
        <p className="text-gray-600">Select a quiz set to start</p>
      </div>

      {quizSets.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            No Quiz Sets Available
          </h2>
          <p className="text-gray-400">Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizSets.map((quizSet) => (
            <div
              key={quizSet._id || quizSet.id}
              className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleSelectQuiz(quizSet._id || quizSet.id)}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {quizSet.setName || 'Quiz Set'}
                </h2>
                <div className="text-gray-600 mb-4">
                  <p className="mb-1">
                    <span className="font-semibold">Question Set:</span>{' '}
                    {quizSet.questionSet}
                  </p>
                  <p>
                    <span className="font-semibold">Total Questions:</span>{' '}
                    {quizSet.totalCount}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Start Quiz
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;

