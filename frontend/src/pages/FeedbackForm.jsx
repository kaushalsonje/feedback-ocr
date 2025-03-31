import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, XCircle } from "lucide-react";
import axios from "axios";

const FeedbackForm = ({ darkMode }) => {
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFileSelect = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setExtractedText("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setImage(e.dataTransfer.files[0]);
    setImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
    setExtractedText("");
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setExtractedText("");
    fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("feedback", feedback);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ocr/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.extracted_text) {
        setExtractedText(response.data.extracted_text);
      } else {
        alert("No text detected in the image.");
      }
    } catch (error) {
      alert("Error extracting text from image.");
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleReadAloud = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setCurrentCharIndex(0);
    const cleanText = stripHtmlTags(extractedText);
    utteranceRef.current = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current.onend = () => {
      setCurrentCharIndex(0);
      setIsPaused(false);
    };
    synthRef.current.speak(utteranceRef.current);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (synthRef.current.speaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-start h-full p-6 overflow-y-auto max-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">📝 Submit Feedback</h2>
      <form className="mt-4 space-y-4 w-full max-w-lg" onSubmit={(e) => e.preventDefault()}>
        <textarea className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 ${darkMode ? "bg-gray-900 text-white border-gray-700 focus:ring-gray-400" : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"}`} rows="5" placeholder="Write your feedback..." value={feedback} onChange={handleFeedbackChange} />

        <div className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${dragging ? "border-blue-500 bg-blue-100 dark:bg-gray-700" : "border-gray-300 dark:border-gray-600 hover:border-blue-500"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}>
          <UploadCloud className="text-blue-500 dark:text-gray-300" size={28} />
          <p className="text-gray-700 dark:text-gray-300 mt-2">Drag & drop an image here, or <span className="text-blue-600 dark:text-blue-400 font-semibold">click to upload</span></p>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
        </div>

        {imagePreview && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full flex justify-center mt-4">
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-40 rounded-lg shadow-md" />
            <button onClick={handleRemoveImage} className={`absolute top-0 right-0 rounded-full p-1 shadow-md transition ${darkMode ? "bg-white text-black hover:bg-gray-300" : "bg-gray-800 text-white hover:bg-gray-900"}`}>
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
        {loading && <p className="text-blue-600">🔄 Processing OCR...</p>}

        <button onClick={handleSubmit} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">🚀 Submit</button>

        {extractedText && (
          <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Extracted Text:</h3>
            <div className="text-gray-700 dark:text-gray-300 mx-6 italic whitespace-pre-line" dangerouslySetInnerHTML={{ __html: extractedText }} />
            <div className="mt-3 flex gap-4">
              <button onClick={handleReadAloud} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔊 Read Aloud</button>
              <button onClick={handlePauseResume} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{isPaused ? "▶ Resume" : "⏹ Stop"}</button>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default FeedbackForm;