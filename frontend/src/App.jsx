import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import FeedbackForm from "./pages/FeedbackForm";
import NotFound from "./pages/NotFound";
import FeedbackList from "./components/FeedbackList";


const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}>
        <Navbar
          toggleSidebar={() => setIsOpen(!isOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="flex h-screen overflow-hidden">
  <Sidebar isOpen={isOpen} darkMode={darkMode} />
  <main className="ml-64 p-6 w-screen h-screen overflow-y-auto scrollbar-hide pb-24">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/feedback" element={<FeedbackForm darkMode={darkMode} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
</div>

      </div>
    </Router>
  );
};

export default App;
