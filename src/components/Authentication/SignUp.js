// src/pages/SignUp.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pricingTier, setPricingTier] = useState("free");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        subscriptionTier: pricingTier,
        createdAt: new Date(),
      });

      setAlertMessage("Account created successfully.");
      setShowAlert(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setAlertMessage("Sign up failed: " + error.message);
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
        <h2 className="text-2xl font-bold text-center mb-2">
          Create an Account
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Get started with AI-powered pricing tools for indie games.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            value={pricingTier}
            onChange={(e) => setPricingTier(e.target.value)}
          >
            <option value="free">Free Plan</option>
            <option value="pro">Pro – $29/month</option>
            <option value="enterprise">Enterprise – $99/month</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
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

export default SignUp;
