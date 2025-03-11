// HumanFeedbackForm.js (for testers)
import React, { useState } from "react";
import { db, auth } from "../firebase/firebase-config"; // Adjust path
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function HumanFeedbackForm({ demoId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setAlertMessage("Please log in as a tester!");
      setShowAlert(true);
      return;
    }

    // Check if user is a tester (from Firestore)
    const userId = auth.currentUser.uid;
    const testerQuery = query(
      collection(db, "testers"),
      where("userId", "==", userId)
    );
    const testerSnapshot = await getDocs(testerQuery);
    if (testerSnapshot.empty) {
      setAlertMessage("Only testers can submit feedback!");
      setShowAlert(true);
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        demoId,
        userId,
        rating,
        comment,
        timestamp: new Date(),
      });
      setAlertMessage("Feedback submitted successfully!");
      setShowAlert(true);
      setRating(0);
      setComment("");
      if (onSubmit) onSubmit({ rating, comment });
    } catch (error) {
      console.error("Feedback error:", error);
      setAlertMessage("Failed to submit feedback: " + error.message);
      setShowAlert(true);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl text-center text-white mb-4 flex items-center justify-center">
        <span className="text-yellow-400 mr-2">★</span> Submit Feedback
      </h2>
      <p className="text-sm text-gray-400 text-center mb-4">
        Rate & comment on the uploaded game demo.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-500"
                }`}
              >
                ★
              </span>
            </motion.button>
          ))}
        </div>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your feedback..."
          required
        />
        <motion.button
          type="submit"
          className="bg-purple-500 text-white w-full px-4 py-2 rounded-lg hover:bg-purple-600 active:scale-95 transition-transform duration-100"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Submit
        </motion.button>
      </form>
      {showAlert && (
        <motion.div
          className="mt-4 bg-gray-800/90 text-white p-2 rounded-lg shadow-lg border-l-4 border-teal-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {alertMessage}
          <button
            onClick={() => setShowAlert(false)}
            className="ml-2 text-teal-400 hover:text-teal-300"
          >
            Close
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
