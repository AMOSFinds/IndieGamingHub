// Pricing.js
import React from "react";
import { useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";
import { auth, db } from "../firebase/firebase-config"; // Adjust path
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Pricing() {
  const navigate = useNavigate();

  const handleUpgrade = (tier) => {
    const paystack = new PaystackPop();
    const amount = tier === "pro" ? 150000 : 250000; // In kobo: $15 = 1,500,000, $25 = 2,500,000
    paystack.newTransaction({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: auth.currentUser.email,
      amount: amount,
      currency: "USD",
      reference: `DEVINDIE_UPGRADE_${new Date().getTime()}`,
      onSuccess: async (transaction) => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          pricingTier: tier,
          paymentReference: transaction.reference,
        });
        navigate("/dashboard");
      },
      onCancel: () => alert("Upgrade cancelled."),
      onError: () => alert("Upgrade error. Contact support."),
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <motion.h1
        className="text-4xl font-bold text-teal-400 text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Upgrade Your Plan
      </motion.h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl text-white font-bold mb-2">Free</h3>
          <p className="text-gray-300 mb-4">$0 / month</p>
          <ul className="text-gray-300 space-y-2">
            <li>1 demo/month</li>
            <li>1-3 testers per demo</li>
            <li>24-hour feedback</li>
            <li>Basic analytics</li>
          </ul>
          <motion.button
            className="mt-6 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            disabled
          >
            Current Plan
          </motion.button>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl text-white font-bold mb-2">Pro</h3>
          <p className="text-gray-300 mb-4">$15 / month</p>
          <ul className="text-gray-300 space-y-2">
            <li>5 demos/month</li>
            <li>3-5 testers per demo</li>
            <li>18-hour feedback</li>
            <li>Enhanced analytics</li>
          </ul>
          <motion.button
            onClick={() => handleUpgrade("pro")}
            className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Upgrade to Pro
          </motion.button>
        </motion.div>
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl text-white font-bold mb-2">Premium</h3>
          <p className="text-gray-300 mb-4">$25 / month</p>
          <ul className="text-gray-300 space-y-2">
            <li>Unlimited demos/month</li>
            <li>5+ testers per demo</li>
            <li>12-hour feedback</li>
            <li>Advanced analytics</li>
          </ul>
          <motion.button
            onClick={() => handleUpgrade("premium")}
            className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Upgrade to Premium
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
