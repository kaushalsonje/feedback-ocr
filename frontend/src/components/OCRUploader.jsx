import { useState } from "react";
import axios from "axios";

const OCRUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ocr/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Upload Image for OCR</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload"}
      </button>

      {extractedText && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-semibold">Extracted Text:</h3>
          <p className="text-gray-800">{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default OCRUploader;
