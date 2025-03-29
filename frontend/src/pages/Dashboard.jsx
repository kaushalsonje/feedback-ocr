import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-800">📊 Welcome to the Dashboard</h1>
      <p className="text-gray-600 mt-2">Here you can track feedback and manage submissions.</p>
    </motion.div>
  );
};

export default Dashboard;
