// TesterDashboard.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/firebase-config"; // Adjust path
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import FeedbackForm from "./FeedbackForm";
import { motion } from "framer-motion";

export default function TesterDashboard() {
  const { demoId } = useParams();
  const [demo, setDemo] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      // Redirect or handle unauthorized access
      return;
    }

    const q = query(collection(db, "demos"), where("demoId", "==", demoId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs[0]?.data();
        if (data) setDemo(data);
      },
      (error) => console.error("Demo fetch error:", error)
    );

    return () => unsubscribe();
  }, [demoId]);

  if (!demo) return <div className="text-white">Loading demo...</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      <motion.h1
        className="text-4xl font-bold text-teal-400 text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Test Demo {demoId}
      </motion.h1>
      <p className="text-gray-300 mb-4">
        Access the demo at:{" "}
        <a
          href={demo.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-400 hover:text-teal-300"
        >
          Download Demo
        </a>
      </p>
      <FeedbackForm demoId={demoId} onSubmit={handleFeedbackSubmit} />
      {showAlert && (
        <motion.div
          className="fixed top-4 right-4 bg-gray-800/90 text-white p-4 rounded-lg shadow-lg border-l-4 border-teal-400"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {alertMessage}
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-teal-400 hover:text-teal-300"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );

  async function handleFeedbackSubmit(feedbackData) {
    try {
      await addDoc(collection(db, "feedback"), {
        demoId,
        userId: auth.currentUser.uid, // Tester’s ID
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        timestamp: new Date(),
      });
      setAlertMessage("Feedback submitted successfully!");
      setShowAlert(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
      setAlertMessage("Failed to submit feedback: " + error.message);
      setShowAlert(true);
    }
  }
}
