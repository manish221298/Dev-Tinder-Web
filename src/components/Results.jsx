import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Results = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResultSets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/result/sets`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setQuizSets(res?.data?.quizSets || []);
    } catch (err) {
      console.error("Error fetching result sets:", err);
      toast.error("Failed to load result sets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultSets();
  }, []);

  const handleViewResults = (quizSetId) => {
    navigate(`/result/set/${quizSetId}`);
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Quiz Results
        </h1>
        <p className="text-base-content/70">View results for completed quiz sets</p>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-base-content/70">
            No Result Sets Available
          </h2>
          <p className="text-base-content/50 mt-2">Complete some quizzes to see results!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizSets.map((quizSet) => (
            <div
              key={quizSet._id || quizSet.id}
              className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleViewResults(quizSet._id || quizSet.id)}
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
                  <p className="mb-1">
                    <span className="font-semibold">Total Questions:</span> {quizSet.totalQuestions}
                  </p>
                  <p>
                    <span className="font-semibold">Submissions:</span>{" "}
                    <span className="badge badge-primary badge-sm">
                      {quizSet.submissionCount || 0}
                    </span>
                  </p>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">
                    View Results
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

export default Results;

