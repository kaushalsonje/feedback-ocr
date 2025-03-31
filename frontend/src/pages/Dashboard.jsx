import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import FeedbackList from "../components/FeedbackList";
import OCRUploader from "../components/OCRUploader"; // Import OCR Uploader

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 x-auto max-w-6xl " // Fixed `x-auto` to `mx-auto`
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📊 Welcome to the Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Here you can track feedback and manage submissions.
      </p>

      {/* Feedback List Section */}
      <div className="mt-6 mx-auto max-w-6x">
        <FeedbackList />
      </div>

     
    </motion.div>
  );
};

export default Dashboard;
