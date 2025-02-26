import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavHeader from "./NavHeader";
import UploadDemo from "./UploadDemo";
import FeedbackForm from "./FeedbackForm";
import Footer from "../Footer";

function Home() {
  const [demoId, setDemoId] = useState(
    () => localStorage.getItem("lastDemoId") || null
  );
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleDemoUploaded = (id) => {
    setDemoId(id);
    localStorage.setItem("lastDemoId", id);
    setFeedbackSubmitted(false); // Reset when uploading a new demo
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true);
  };

  const navigateToDashboard = () => {
    if (demoId && feedbackSubmitted) {
      navigate(`/dashboard/${demoId}`);
    } else {
      alert("Please upload a demo and submit feedback first!");
    }
  };

  return (
    <main>
      <NavHeader />
      <UploadDemo setDemoId={handleDemoUploaded} />
      {demoId ? (
        <FeedbackForm
          demoId={demoId}
          onSubmit={handleFeedbackSubmitted} // Pass callback
        />
      ) : (
        <p>No demo selected yet</p>
      )}
      <button
        onClick={navigateToDashboard}
        disabled={!demoId || !feedbackSubmitted}
        className="dashboard-button"
      >
        Go to Dashboard
      </button>
      <Footer />
    </main>
  );
}

export default Home;
