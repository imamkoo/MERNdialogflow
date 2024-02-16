import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Komponen untuk menentukan apakah Navbar harus ditampilkan
const NavbarWrapper = ({ children }) => {
  const location = useLocation();
  // Jangan tampilkan Navbar di HomePage
  if (location.pathname === "/") {
    return <>{children}</>;
  }
  return (
    <div className="navbar">
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="*"
            element={
              <NavbarWrapper>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Routes>
              </NavbarWrapper>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
