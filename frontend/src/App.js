import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
