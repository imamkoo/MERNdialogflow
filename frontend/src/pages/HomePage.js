import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mengecek apakah pengguna sudah login dengan memeriksa token di local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleChatNow = () => {
    if (!isLoggedIn) {
      alert("Please sign in to use the chat feature.");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="h-screen bg-gray-200 w-full flex flex-col justify-center items-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome to Save Street Child Community!
      </h1>
      <div className="flex flex-wrap justify-center items-center space-x-4">
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </button>
        )}
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100"
          >
            Sign Up
          </button>
        )}
        <button
          onClick={handleChatNow}
          className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          Chat Now
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-red-700 bg-white hover:bg-gray-100"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
