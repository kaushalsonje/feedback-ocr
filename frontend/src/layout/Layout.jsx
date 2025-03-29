const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 flex flex-col">
        <h1 className="text-lg font-bold text-white mb-6">Student Feedback</h1>
        <nav className="flex flex-col space-y-2">
          <a href="/" className="text-gray-300 hover:text-white flex items-center">
            📊 Dashboard
          </a>
          <a href="/feedback" className="text-gray-300 hover:text-white flex items-center">
            📝 Feedback Form
          </a>
        </nav>
        <button className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );
};

export default Layout;
