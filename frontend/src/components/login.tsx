import React, { useState } from "react";
import { FaKiwiBird } from "react-icons/fa";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (password == "rudiwella") {
      setErrorMessage("");
      onLoginSuccess();
    } else {
      setErrorMessage("Invalid password");
    }
  };

  const handleLogin1 = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          password: password,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // You can store the received data (e.g., access token) in a state or context
        setErrorMessage("");
        onLoginSuccess();
      } else {
        setErrorMessage("Invalid password");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-800 grid-background">
      <div className="pt-8 title-container mb-8">
        <h1 className="text-5xl text-white flex items-center">
          <FaKiwiBird className="mr-4" />
          <span className="font-bold text-fuchsia-400 neon-text">Chirp</span>
          <span className="font-thin">Chase</span>
        </h1>
        <p className="mt-2 text-sm text-white font-mono">
          Analyze and leverage content generation
        </p>
      </div>
      <div className="animate-pop-in table-container title-container">
        <div className="relative p-6 mb-8 bg-zinc-900 text-gray-300  rounded-lg shadow-lg shadow-green-400 neon-border">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-700 placeholder-zinc-500 text-white rounded-lg focus:outline-none focus:shadow-outline mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 font-bold text-white font-mono text-sm bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
