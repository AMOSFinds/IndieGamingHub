import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add this
import { db } from "../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./Dashboard.css";

export default function Dashboard() {
  // No prop needed
  const { demoId } = useParams(); // Get demoId from URL
  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current demoId:", demoId);

    if (!demoId) {
      console.log("No demoId provided, skipping feedback fetch");
      setFeedback([]);
      return;
    }

    fetch("http://localhost:3000/api/aiPlaytest", {
      method: "POST",
      body: JSON.stringify({
        demoUrl:
          "https://firebasestorage.googleapis.com/v0/b/my-gaming-platform.appspot.com/o/demos%2Ftiny3.zip?alt=media&token=139f7e72-f78e-4e1f-96cf-d52440062848",
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(setReport)
      .catch((error) => console.error("AI fetch error:", error));

    getDocs(collection(db, "feedback"))
      .then((snapshot) => {
        const allDocs = snapshot.docs.map((doc) => doc.data());
        console.log("All feedback docs:", allDocs);
        const filteredDocs = snapshot.docs.filter((doc) => {
          const docDemoId = doc.data().demoId;
          console.log("Comparing:", docDemoId, "with", demoId);
          return docDemoId === demoId;
        });
        const data = filteredDocs.map((doc) => doc.data());
        console.log("Filtered feedback for demoId", demoId, ":", data);
        setFeedback(data);
      })
      .catch((error) => console.error("Feedback fetch error:", error));
  }, [demoId]);

  return (
    <div className="dashboard">
      <h1>Devindie Dashboard</h1>
      {report && (
        <div className="ai-report">
          <h2>AI Score: {report.score}/100</h2>
          <ul>
            {report.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="feedback-section">
        <h2>Tester Feedback</h2>
        <ul>
          {feedback.length > 0 ? (
            feedback.map((f, index) => (
              <li key={index}>
                Rating: {f.rating}/5 - {f.comment}
              </li>
            ))
          ) : (
            <li>No feedback yet</li>
          )}
        </ul>
      </div>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
