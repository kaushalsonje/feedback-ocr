import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, XCircle } from "lucide-react";

const FeedbackForm = ({ darkMode }) => {
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle text feedback input
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Handle image selection
  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle file input selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  // Handle file drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  // Handle file drag leave
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Feedback submitted! ✅");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center justify-center h-full p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        📝 Submit Feedback
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 w-full max-w-lg">
        {/* Textarea for feedback */}
        <textarea
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 ${
            darkMode
              ? "bg-gray-900 text-white border-gray-700 focus:ring-gray-400"
              : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
          }`}
          rows="5"
          placeholder="Write your feedback..."
          value={feedback}
          onChange={handleFeedbackChange}
        />

        {/* Drag & Drop + Click to Upload */}
        <div
          className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
            dragging
              ? "border-blue-500 bg-blue-100 dark:bg-gray-700"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()} // Click to Upload
        >
          <UploadCloud
            className="text-blue-500 dark:text-gray-300"
            size={28}
          />
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Drag & drop an image here, or{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              click to upload
            </span>
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* Image Preview with Remove Option */}
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full flex justify-center mt-4"
          >
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-40 rounded-lg shadow-md"
            />
            {/* Remove Image Button */}
            <button
              onClick={handleRemoveImage}
              className={`absolute top-0 right-0 rounded-full p-1 shadow-md transition ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              <XCircle size={20} />
            </button>
          </motion.div>
        )}

        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
