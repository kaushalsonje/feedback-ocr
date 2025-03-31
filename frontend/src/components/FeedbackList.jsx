import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi"; // Import trash icon

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState({});
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRefs = useRef({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:8000/feedback"); // Adjust if backend runs on a different port
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("❌ Error fetching feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to remove feedback
      const response = await fetch(`http://localhost:8000/feedback/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove feedback from the state (UI) after successful deletion
        setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
      } else {
        console.error("❌ Error deleting feedback");
      }
    } catch (error) {
      console.error("❌ Error deleting feedback:", error);
    }
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleReadAloud = (id, text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel(); // Stop any ongoing speech
    }
    
    setCurrentCharIndex((prev) => ({ ...prev, [id]: 0 })); // Reset index to start
  
    const cleanText = stripHtmlTags(text);
    utteranceRefs.current[id] = new SpeechSynthesisUtterance(cleanText);
  
    utteranceRefs.current[id].onend = () => {
      setCurrentCharIndex((prev) => ({ ...prev, [id]: 0 }));
      setIsPaused(false);
    };
  
    synthRef.current.speak(utteranceRefs.current[id]);
    setIsPaused(false);
  };
  
  const handlePauseResume = (id) => {
    if (synthRef.current.speaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };
  

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📢 User Feedback</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No feedback available yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <motion.div
            key={fb.id}
            className="relative p-4 border rounded-lg mt-4 bg-white dark:bg-gray-800 shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {/* ❌ Delete Button positioned top-right */}
            <button
              onClick={() => handleDelete(fb.id)}
              className="absolute top-2 right-2 p-2 text-red-600 hover:text-red-800 rounded-full transition duration-200"
            >
              <FiTrash2 className="text-xl" />
            </button>

            {/* ✅ Display Original Input Feedback */}
            <p className="text-gray-700 dark:text-gray-300 font-semibold mx-6">📝 Input Feedback:</p>
            <p className="text-gray-700 dark:text-gray-300 mx-6">{fb.feedback || "No feedback provided"}</p>

            {/* ✅ Display Feedback Image (if available) */}
            {fb.image_url && (
              <div className="mt-4 flex justify-center">
                <img
                  src={fb.image_url}
                  alt="Feedback Image"
                  className="max-w-[250px] h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            )}

            {/* ✅ Display Extracted Text (if available) */}
            {fb.extracted_text && (
              <>
                <p className="text-gray-700 dark:text-gray-300 font-semibold mx-6 mt-2">🔍 Extracted Text:</p>
                <div
                  className="text-gray-700 dark:text-gray-300 mx-6 italic whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: fb.extracted_text }} // ✅ Correctly renders HTML line breaks
                />
                <div className="mt-3 flex gap-4 mx-6">
                  <button onClick={() => handleReadAloud(fb.id, fb.extracted_text)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔊 Read Aloud</button>
                  <button onClick={() => handlePauseResume(fb.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{isPaused ? "▶ Resume" : "⏹ Stop"}</button>
                </div>
              </>
            )}

            {/* ✅ Display Timestamp (Formatted) */}
            {fb.timestamp && (
              <p className="text-gray-500 text-sm mx-6 mt-2">
                ⏳ Submitted on: {new Date(fb.timestamp).toLocaleString()}
              </p>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default FeedbackList;