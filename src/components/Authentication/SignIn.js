import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { motion } from "framer-motion";

function SignIn() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Today's date without time

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
        navigate("/"); // Redirect to home page
      }, 3000);
    } catch (error) {
      console.error("Error signing in: ", error);
      setAlertMessage("Failed to sign in");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  return (
    <div className="bg-dark-bg text-white min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="bg-dark-bg p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <h1 className="text-xl font-light text-white">
            Join the Beta—Free Playtesting for Indie Devs
          </h1>
          <p className="text-sm text-gray-400">
            Devindie connects indie devs with human playtesters—launch with
            confidence.{" "}
          </p>
        </div>
        <h2 className="text-2xl text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            className="w-full p-3 mb-4 rounded-lg bg-dark-bg/50 text-white border border-gray-600 focus:border-teal focus:outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
          <motion.input
            className="w-full p-3 mb-4 rounded-lg bg-dark-bg/50 text-white border border-gray-600 focus:border-teal focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
          <motion.button
            type="submit"
            className="button w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Sign In
          </motion.button>
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal hover:text-teal-hover">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
      {showAlert && (
        <motion.div
          className="fixed top-4 right-4 bg-dark-bg/90 text-white p-4 rounded-lg shadow-lg border-l-4 border-teal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {alertMessage}
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-teal hover:text-teal-hover"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default SignIn;
