import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/constants";
import toast from "react-hot-toast";

const AddQuestions = () => {
  const [formData, setFormData] = useState({
    questions: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const [errors, setErrors] = useState({
    questions: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));

    if (value.trim() !== "") {
      const newErrors = [...errors.options];
      newErrors[index] = "";
      setErrors((prev) => ({ ...prev, options: newErrors }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      questions: "",
      options: ["", "", "", ""],
      answer: "",
    };

    if (formData.questions.trim() === "") {
      newErrors.questions = "Question is required.";
      isValid = false;
    }

    formData.options.forEach((opt, idx) => {
      if (opt.trim() === "") {
        newErrors.options[idx] = `Option ${idx + 1} is required.`;
        isValid = false;
      }
    });

    if (formData.answer.trim() === "") {
      newErrors.answer = "Answer is required.";
      isValid = false;
    } else if (!formData.options.includes(formData.answer)) {
      newErrors.answer = "Answer must match one of the options.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/question/create`, formData);
      toast.success(res?.data?.message || "Question added successfully!");

      // Reset form
      setFormData({
        questions: "",
        options: ["", "", "", ""],
        answer: "",
      });

      setErrors({
        questions: "",
        options: ["", "", "", ""],
        answer: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit question. Try again."
      );
    }
  };

  return (
    <div className="p-5 max-w-xl my-12 mx-auto bg-[#181a19] shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Add a Question</h2>

      {/* Question */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-white">Question:</label>
        <input
          type="text"
          value={formData.questions}
          onChange={(e) => handleChange("questions", e.target.value)}
          placeholder="Enter your question"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
        />
        {errors.questions && (
          <p className="text-red-500 text-sm mt-1">{errors.questions}</p>
        )}
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-white">Options:</label>
        {formData.options.map((option, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            />
            {errors.options[index] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.options[index]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Answer */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-white">Answer:</label>
        <input
          type="text"
          value={formData.answer}
          onChange={(e) => handleChange("answer", e.target.value)}
          placeholder="Enter the correct answer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
        />
        {errors.answer && (
          <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddQuestions;
