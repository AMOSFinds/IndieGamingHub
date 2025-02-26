import { useState } from "react";
import { db, auth } from "../firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import "./FeedbackForm.css";
import CustomAlert from "../CustomAlert"; // Adjust path

export default function FeedbackForm({ demoId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const submitFeedback = async () => {
    if (!auth.currentUser) {
      setAlertMessage("Please log in!");
      setShowAlert(true);
      return;
    }
    if (!demoId) {
      setAlertMessage("No demo selected!");
      setShowAlert(true);
      return;
    }
    try {
      await addDoc(collection(db, "feedback"), {
        demoId,
        rating,
        comment,
        timestamp: new Date(),
      });
      setAlertMessage("Feedback submitted!");
      setShowAlert(true);
      setRating(0);
      setComment("");
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Failed: " + error.message);
      setShowAlert(true);
    }
  };

  return (
    <div className="feedback-form">
      <h3>Submit Feedback</h3>
      <p className="tooltip">
        Rate & comment on your uploaded game demo for better insights—helps
        refine our AI tool for the final version.
      </p>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rate your demo (1-5)"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Feedback about your demo..."
      />
      <button onClick={submitFeedback}>Submit</button>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
