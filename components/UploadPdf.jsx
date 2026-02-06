'use client';

import { useState } from 'react';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

export default function UploadPdf() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !window.pdfjsLib) {
      setError('PDF.js not loaded or file missing');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join(' ');
        fullText += text + '\n';
      }

      const cleanedText = fullText
        .replace(/Quiz Questions/g, '')
        .replace(/\s+/g, ' ');

      const questionRegex =
        /Question\s*(\d+):\s*(.*?)\s*Option1:\s*(.*?)\s*Option2:\s*(.*?)\s*Option3:\s*(.*?)\s*Option4:\s*(.*?)\s*Answer:\s*(.*?)(?=\s*Question\s*\d+:|$)/gi;

      const structured = [];
      let match;
      while ((match = questionRegex.exec(cleanedText)) !== null) {
        structured.push({
          [`Question`]: match[2].trim(),
          options: [match[3], match[4], match[5], match[6]].map((x) =>
            x.trim()
          ),
          answer: match[7].trim(),
        });
      }

      setQuizData(structured);
    } catch (err) {
      console.error('PDF parse error', err);
      setError('Failed to extract PDF content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const pdfSubmit = () => {
    console.log('onsubmit data', quizData);

    axios
      .post(
        `${baseUrl}/upload/quiz/pdf`,
        {
          questions: quizData,
          setName: 'Customer care executive',
          questionSet: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((res) => {
        console.log('res pdf data', res);
        toast.success('Quiz uploaded successfully!');
      })
      .catch((err) => {
        console.log('error data', err);
        toast.error('Failed to upload quiz');
      });
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200 rounded-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            PDF to Quiz Converter
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a PDF file to extract quiz questions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <label className="flex-1 px-4 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Choose PDF File
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              onClick={pdfSubmit}
              disabled={quizData.length === 0 || loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Questions
            </button>
          </div>

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex items-center gap-3">
              <Spinner size="md" />
              <span>Processing PDF...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {quizData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Extracted Questions ({quizData.length})
              </h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[60vh]">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(quizData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

