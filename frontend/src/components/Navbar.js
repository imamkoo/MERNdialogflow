import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-2 bg-gray-800 text-white">
      <button
        onClick={() => navigate("/chat")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
      >
        Chat
      </button>
      <button
        onClick={handleSignOut}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Navbar;
