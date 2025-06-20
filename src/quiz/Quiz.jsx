import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { addQuestion } from "../utils/questionsSlice";

const Quiz = () => {
  const dispatch = useDispatch();
  const questionsData = useSelector((state) => state.questions);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  console.log("Questions Data:", questionsData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/question/list`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        console.log("Fetched Questions:", res?.data?.questionList);

        if (res.data) {
          dispatch(addQuestion(res?.data?.questionList));
        } else {
          toast.error("No questions available.");
        }
      } catch (error) {
        toast.error("Failed to load quiz data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Show loading or fallback
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading quiz...
        </div>
      </div>
    );
  }

  if (!questionsData?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-lg font-medium text-red-600">
          No quiz questions found.
        </div>
      </div>
    );
  }

  const currentQuestion = questionsData[currentQuestionIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Question {currentQuestionIndex + 1} of {questionsData.length}
        </h2>

        <p className="text-lg text-gray-700 mb-6 font-medium">
          {currentQuestion.questions}
        </p>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptions[currentQuestionIndex] === option;

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left py-3 px-4 rounded-lg text-base shadow-md transition duration-200 ${
                  isSelected
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questionsData.length - 1}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
