import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  where,
  getDocs,
  updateDoc,
  increment,
  query,
  collection,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";
import { FaUpload } from "react-icons/fa";
import LoadingIndicator from "../LoadingIndicator";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../firebase/firebase-config";
import { motion } from "framer-motion";
import PaystackPop from "@paystack/inline-js";

function SignUp() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pricingTier, setPricingTier] = useState("free");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const storage = getStorage();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      if (pricingTier === "free") {
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          pricingTier,
          createdAt: new Date(),
        });
        setAlertMessage("Signed up successfully on Free tier!");
        setShowAlert(true);
      } else {
        handlePaystackPayment();
      }
      setAlertMessage("Account created successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
        navigate("/"); // Redirect to home page
      }, 3000);
    } catch (error) {
      console.error("Error signing up: ", error);
      setAlertMessage("Failed to sign up");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  const handlePaystackPayment = () => {
    const paystack = new PaystackPop();
    const amount = pricingTier === "pro" ? 150000 : 250000; // In kobo: $15 = 1,500,000 kobo, $25 = 2,500,000 kobo
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount,
      currency: "USD", // Use USD for international pricing
      reference: `DEVINDIE_SUB_${new Date().getTime()}`, // Unique reference
      onSuccess: async (transaction) => {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          username,
          email,
          pricingTier,
          paymentReference: transaction.reference,
          createdAt: new Date(),
        });
        setAlertMessage(
          `Payment successful! Subscribed to ${pricingTier} tier.`
        );
        setShowAlert(true);
      },
      onCancel: () => {
        setAlertMessage("Payment cancelled. Please try again.");
        setShowAlert(true);
      },
      onError: () => {
        setAlertMessage("Payment error. Please contact support.");
        setShowAlert(true);
      },
    });
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
        <h2 className="text-2xl text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            className="w-full p-3 mb-4 rounded-lg bg-dark-bg/50 text-white border border-gray-600 focus:border-teal focus:outline-none"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
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
          <select
            value={pricingTier}
            onChange={(e) => setPricingTier(e.target.value)}
            className="w-full p-2 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-400 outline-none appearance-none transition-colors duration-200 pr-8"
          >
            <option value="free">Basic ($29/month)</option>
            <option value="pro">Pro ($79/month)</option>
            <option value="premium">Premium ($299/month)</option>
          </select>
          <motion.button
            type="submit"
            className="bg-teal-500 text-white w-full px-4 py-2 rounded-lg hover:bg-teal-600 active:scale-95 transition-transform duration-100 flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up
          </motion.button>
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

export default SignUp;
