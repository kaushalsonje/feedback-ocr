import { Moon, Sun, Menu } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ toggleSidebar, darkMode, setDarkMode }) => {
  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white p-4 w-screen flex justify-between items-center shadow-md transition-all duration-500"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Sidebar Toggle Button */}
      <button className="text-white md:hidden" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Title */}
      <h1 className="text-lg font-bold tracking-wider">📘 Student Feedback</h1>

      {/* Theme Toggle Button with Spacing */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 bg-gray-900 rounded-full transition-all duration-300 hover:bg-gray-700 ml-auto mr-4"
      >
        {darkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-blue-300" />}
      </button>
    </motion.nav>
  );
};

export default Navbar;
