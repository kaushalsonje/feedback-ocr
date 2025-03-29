import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-screen text-center"
    >
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-500">Oops! Page not found.</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
        Go to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
