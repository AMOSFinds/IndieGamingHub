// src/pages/SignIn.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setAlertMessage("Login failed: " + error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
      <motion.div
        className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-sm text-center text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300">
              Sign up here
            </Link>
          </p>
        </form>

        {showAlert && (
          <p className="text-sm text-teal-400 text-center mt-4">
            {alertMessage}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default SignIn;
