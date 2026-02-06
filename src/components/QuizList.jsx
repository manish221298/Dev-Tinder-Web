import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const QuizList = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      console.error("Error fetching quiz sets:", err);
      toast.error("Failed to load quiz sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizSets();
  }, []);

  const handleSelectQuiz = (quizSetId) => {
    navigate(`/quiz/${quizSetId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 inline-block mr-3"
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
        <p className="text-base-content/70">Select a quiz set to start</p>
      </div>

      {quizSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-base-content/30 mb-4"
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
          <h2 className="text-xl font-semibold text-base-content/70">
            No Quiz Sets Available
          </h2>
          <p className="text-base-content/50 mt-2">Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizSets.map((quizSet) => (
            <div
              key={quizSet._id || quizSet.id}
              className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleSelectQuiz(quizSet._id || quizSet.id)}
            >
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
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
                  {quizSet.setName || "Quiz Set"}
                </h2>
                <div className="text-base-content/70 mb-4">
                  <p className="mb-1">
                    <span className="font-semibold">Question Set:</span> {quizSet.questionSet}
                  </p>
                  <p>
                    <span className="font-semibold">Total Questions:</span> {quizSet.totalCount}
                  </p>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">
                    Start Quiz
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
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

