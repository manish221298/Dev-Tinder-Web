import React from "react";

const QuizPerformance = () => {
  const performanceData = {
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    scorePercentage: 70,
  };

  return (
    <div className="p-5 max-w-xl my-12 mx-auto bg-[#181a19] shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-white text-center mb-6">
        Quiz Performance
      </h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Total Questions:</span>
          <span className="text-slate-200 font-bold">
            {performanceData.totalQuestions}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Correct Answers:</span>
          <span className="text-green-600 font-bold">
            {performanceData.correctAnswers}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Incorrect Answers:</span>
          <span className="text-red-600 font-bold">
            {performanceData.incorrectAnswers}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Score Percentage:</span>
          <span className="text-blue-600 font-bold">
            {performanceData.scorePercentage}%
          </span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPerformance;
