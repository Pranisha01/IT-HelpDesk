import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import requestsService from "../../services/RequestsService";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const user = await requestsService.login(username, password);

    if (!user) {
      setError("Invalid username or password");
      return;
    }
    dispatch(login({ userData: user }));
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-2 bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-xs sm:w-80 p-4 sm:p-6 border border-gray-300 rounded-lg bg-white shadow-sm"
      >
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-blue-800">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-2 sm:mb-3 text-sm sm:text-base font-semibold">
            {error}
          </p>
        )}

        <label className="block text-xs sm:text-sm font-medium mb-1">
          Username
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 sm:mb-4 focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block text-xs sm:text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 sm:mb-4 focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all text-sm sm:text-base"
        >
          Login
        </button>
      </form>
    </div>
  );
}
