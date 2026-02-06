"use client";
import { useState } from "react";
import axios from "axios";
import { baseUrl, getToken } from "../utils/constants";
import toast from "react-hot-toast";

export default function UploadPdf() {
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file || !window.pdfjsLib) {
            setError("PDF.js not loaded or file missing");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const text = content.items.map((item) => item.str).join(" ");
                fullText += text + "\n";
            }

            const cleanedText = fullText.replace(/Quiz Questions/g, "").replace(/\s+/g, " ");

            // Regex pattern to match full question blocks
            const questionRegex = /Question\s*(\d+):\s*(.*?)\s*Option1:\s*(.*?)\s*Option2:\s*(.*?)\s*Option3:\s*(.*?)\s*Option4:\s*(.*?)\s*Answer:\s*(.*?)(?=\s*Question\s*\d+:|$)/gi;

            const structured = [];
            let match;
            while ((match = questionRegex.exec(cleanedText)) !== null) {
                structured.push({
                    [`Question`]: match[2].trim(),
                    options: [match[3], match[4], match[5], match[6]].map((x) => x.trim()),
                    answer: match[7].trim(),
                });
            }

            setQuizData(structured);
        } catch (err) {
            console.error("PDF parse error", err);
            setError("Failed to extract PDF content: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const pdfSubmit = () => {
        console.log("onsubmit data", quizData)

        axios.post(`${baseUrl}/upload/quiz/pdf`, {
            questions: quizData,
            setName: 'Customer care executive',
            questionSet: 1
        }).then(res => {
            console.log("res pdf data", res)
        }).catch(err => {
            console.log("error data", err)
        })

    }

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-300">
                <div className="card-body p-6">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        PDF to Quiz Converter
                    </h2>
                    <p className="text-base-content/70 mb-6">Upload a PDF file to extract quiz questions</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <label className="btn btn-primary btn-lg flex-1 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
                            className="btn btn-success btn-lg flex-1 hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Questions
                        </button>
                    </div>
                    
                    {loading && (
                        <div className="alert alert-info">
                            <span className="loading loading-spinner loading-md"></span>
                            <span>Processing PDF...</span>
                        </div>
                    )}
                    
                    {error && (
                        <div className="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {quizData.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Extracted Questions ({quizData.length})</h3>
                            <div className="bg-base-200 rounded-lg p-4 overflow-auto max-h-[60vh]">
                                <pre className="text-sm text-base-content whitespace-pre-wrap">
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
