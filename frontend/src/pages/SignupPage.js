import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred. Please try again.");
      }

      login(data.token);
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to connect. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white">
        <h1 className="text-2xl font-bold text-center">Signup</h1>
        {error && (
          <div className="p-3 mb-2 text-center text-white bg-red-500 rounded">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>
          <button
            type="button" // Pastikan ini bukan type submit
            onClick={() => setShowPassword(!showPassword)}
            className=""
          >
            {showPassword ? "Hide" : "Show"} Password
          </button>
          <button
            type="submit"
            className="w-full p-2 text-white bg-red-500 rounded-md hover:bg-red-700"
          >
            Signup
          </button>
          <button
            type="submit"
            onClick={() => navigate("/login")}
            className="w-full p-2 text-white bg-green-500 rounded-md hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
