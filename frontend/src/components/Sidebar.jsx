import { Link } from "react-router-dom";
import { Home, MessageSquare, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, darkMode }) => {
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className={`w-64 h-screen p-5 fixed transition-all duration-100 ${
        darkMode ? "bg-gray-100 text-800" : "bg-gray-900 text-gray-white"
      }`}
    >
      <h2 className="text-lg font-bold tracking-wide text-blue-500">Menu</h2>

      <nav className="mt-6 space-y-2">
        <Link
          to="/"
          className={`flex items-center space-x-2 p-3 rounded-md transition ${
            darkMode ? "hover:bg-gray-800" : "hover:bg-gray-300"
          }`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/feedback"
          className={`flex items-center space-x-2 p-3 rounded-md transition ${
            darkMode ? "hover:bg-gray-800" : "hover:bg-gray-300"
          }`}
        >
          <MessageSquare size={20} />
          <span>Scan & Extract</span>
        </Link>
      </nav>

      
    </motion.aside>
  );
};

export default Sidebar;
