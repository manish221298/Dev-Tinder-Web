'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';
import ProgressBar from '@/components/ui/ProgressBar';

const Quiz = ({ quizSetId }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/quiz/${quizSetId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setQuestions(res?.data?.questionSet?.questions || []);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      toast.error('Failed to load quiz');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizSetId) {
      fetchQuiz();
    }
  }, [quizSetId]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSkip = () => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: null,
    });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuizResults = async (results, summary) => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${baseUrl}/quiz/submit`,
        {
          quizSetId: quizSetId,
          results: results,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log('Quiz results submitted:', res.data);

      toast.success(
        `Quiz submitted! Score: ${summary.score}/${summary.total} (${summary.percentage}%)`,
        { duration: 4000 }
      );

      setResultSummary(summary);
      setShowResults(true);

      setTimeout(() => {
        setShowResults(false);
        router.push('/quiz');
      }, 5000);

      return res.data;
    } catch (err) {
      console.error('Error submitting quiz results:', err);
      toast.error('Failed to submit quiz results');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;
    let skippedQuestions = 0;

    const results = questions.map((question, index) => {
      const selectedAnswer = selectedAnswers[index];

      if (selectedAnswer === null || selectedAnswer === undefined) {
        skippedQuestions++;
      } else if (selectedAnswer === question.answer) {
        correctAnswers++;
      }

      return {
        question: question.Question || question.question,
        questionId: question._id,
        selectedAnswer: selectedAnswer || null,
      };
    });

    const totalQuestions = questions.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    const summary = {
      score: correctAnswers,
      total: totalQuestions,
      percentage: percentage,
      skipped: skippedQuestions,
    };

    await submitQuizResults(results, summary);
  };

  const handleBackToList = () => {
    router.push('/quiz');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
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
          No Questions Found
        </h2>
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Back to Quiz List
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasSelectedAnswer =
    selectedAnswers[currentQuestionIndex] !== undefined &&
    selectedAnswers[currentQuestionIndex] !== null;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Brief Results Section */}
      {showResults && resultSummary && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-800 mb-1">
                Quiz Submitted Successfully!
              </h3>
              <p className="text-sm text-green-700">
                Score:{' '}
                <span className="font-semibold">
                  {resultSummary.score}/{resultSummary.total}
                </span>{' '}
                ({resultSummary.percentage}%)
                {resultSummary.skipped > 0 && (
                  <span className="ml-2">• Skipped: {resultSummary.skipped}</span>
                )}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200 rounded-lg">
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              max={100}
            />
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {currentQuestion.Question || currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {(() => {
                let options = [];
                if (
                  currentQuestion.options &&
                  Array.isArray(currentQuestion.options)
                ) {
                  options = currentQuestion.options;
                } else {
                  for (let i = 1; i <= 4; i++) {
                    const optionKey = `Option${i}`;
                    if (currentQuestion[optionKey]) {
                      options.push(currentQuestion[optionKey]);
                    }
                  }
                }

                return options.map((option, optionIndex) => {
                  const optionValue =
                    typeof option === 'string' ? option : String(option);
                  const isSelected =
                    selectedAnswers[currentQuestionIndex] === optionValue;

                  return (
                    <label
                      key={optionIndex}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={optionValue}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswerSelect(currentQuestionIndex, optionValue)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-lg">{optionValue}</span>
                    </label>
                  );
                });
              })()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6 gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              Previous
            </button>

            <div className="flex gap-2">
              {!isLastQuestion && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-transparent text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  Skip
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
              )}

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

