import { useState } from "react";

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
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join(" ");
        fullText += text + "\n";
      }

      console.log("Extracted Text:", fullText);

      const regex =
        /Question\s*(\d+):\s*(.*?)\s*Option1:\s*(.*?)\s*Option2:\s*(.*?)\s*Option3:\s*(.*?)\s*Option4:\s*(.*?)\s*Answer:\s*(.*?)(?=Question\s*\d+:|$)/gi;

      const structured = [];
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        structured.push({
          [`Question ${match[1]}`]: match[2].trim(),
          options: [match[3], match[4], match[5], match[6]],
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧠 Quiz PDF to JSON</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>⏳ Processing PDF...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {quizData.length > 0 && (
        <pre
          style={{
            background: "#03958",
            padding: "1rem",
            borderRadius: "8px",
            // maxHeight: "400px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(quizData, null, 2)}
        </pre>
      )}
    </div>
  );
}
