// Dashboard.js (updated for pricing options)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebase/firebase-config"; // Adjust path
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UploadDemo from "./UploadDemo";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const { demoId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [demoUploaded, setDemoUploaded] = useState(false);
  const [pricingTier, setPricingTier] = useState("free"); // Default to free
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/signin");
      return;
    }

    // Fetch user's pricing tier from Firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (doc) => {
        if (doc.exists()) {
          setPricingTier(doc.data().pricingTier || "free");
        }
      },
      (error) => console.error("Pricing tier fetch error:", error)
    );

    if (demoId) {
      const q = query(
        collection(db, "feedback"),
        where("demoId", "==", demoId)
      );
      const feedbackUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          setFeedback(data);
        },
        (error) => console.error("Feedback listener error:", error)
      );

      return () => {
        unsubscribe();
        feedbackUnsubscribe();
      };
    }

    return () => unsubscribe();
  }, [demoId, navigate]);

  const handleUpload = async (file) => {
    if (!file) {
      setAlertMessage("Please select a valid file!");
      setShowAlert(true);
      return;
    }

    const userId = auth.currentUser.uid;
    const demosQuery = query(
      collection(db, "demos"),
      where("userId", "==", userId),
      where("pricingTier", "==", pricingTier)
    );
    const demosSnapshot = await getDocs(demosQuery);
    const currentMonth = new Date().getMonth();
    const freeDemosThisMonth = demosSnapshot.docs.filter(
      (doc) => new Date(doc.data().uploadedAt).getMonth() === currentMonth
    ).length;

    if (pricingTier === "free" && freeDemosThisMonth >= 1) {
      setAlertMessage(
        "Free tier allows only 1 demo per month. Upgrade to Pro or Premium for more!"
      );
      setShowAlert(true);
      return;
    }
    if (pricingTier === "pro" && freeDemosThisMonth >= 5) {
      setAlertMessage(
        "Pro tier allows only 5 demos per month. Upgrade to Premium for unlimited demos!"
      );
      setShowAlert(true);
      return;
    }

    const demoId = `${userId}-${file.name}-${Date.now()}`;
    const storageRef = ref(storage, `demos/${demoId}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "demos"), {
        demoId,
        userId,
        fileURL: url,
        uploadedAt: new Date(),
        pricingTier,
      });

      // Assign testers based on pricing tier
      await assignTesters(demoId, pricingTier);

      setDemoUploaded(true);
      setAlertMessage("Demo uploaded successfully!");
      setShowAlert(true);
      navigate(`/dashboard/${demoId}`);
    } catch (error) {
      console.error("Upload error:", error);
      setAlertMessage("Upload failed: " + error.message);
      setShowAlert(true);
    }
  };

  const assignTesters = async (demoId, tier) => {
    const testersQuery = query(
      collection(db, "testers"),
      where("isActive", "==", true)
    );
    const testersSnapshot = await getDocs(testersQuery);
    let assignedTesters = [];

    if (tier === "free") {
      assignedTesters = testersSnapshot.docs.slice(0, 3).map((doc) => doc.id); // 1-3 testers
    } else if (tier === "pro") {
      assignedTesters = testersSnapshot.docs.slice(0, 5).map((doc) => doc.id); // 3-5 testers
    } else if (tier === "premium") {
      assignedTesters = testersSnapshot.docs.slice(0, 7).map((doc) => doc.id); // 5+ testers
    }

    await updateDoc(doc(db, "demos", demoId), { assignedTesters });
    await notifyTesters(demoId, assignedTesters);
  };

  const notifyTesters = async (demoId, assignedTesters) => {
    const testerEmails = assignedTesters.map((id) => {
      const testerDoc = doc(db, "testers", id);
      return getDoc(testerDoc).then((doc) => doc.data().email);
    });
    const emails = await Promise.all(testerEmails);

    await fetch("YOUR_DISCORD_WEBHOOK_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `New demo to test: https://yourapp.com/tester/${demoId} for testers ${emails.join(
          ", "
        )}`,
      }),
    });
  };

  const feedbackRatings = feedback.map((fb) => fb.rating || 0);
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => feedbackRatings.filter((rate) => rate === r).length || 0
  );

  const chartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Rating Distribution",
        data: ratingCounts,
        backgroundColor: "#00c4b4",
        borderColor: "#00a89a",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: { y: { beginAtZero: true, ticks: { color: "#ffffff" } } },
    plugins: { legend: { labels: { color: "#ffffff" } } },
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      <motion.h1
        className="text-4xl font-bold text-teal-400 text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Devindie Dashboard
      </motion.h1>
      <p className="text-sm text-gray-400 text-center mb-6">
        Upload your game demo and get real human feedback in{" "}
        {pricingTier === "premium" ? "12" : pricingTier === "pro" ? "18" : "24"}{" "}
        hours.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UploadDemo onUpload={handleUpload} />
        </motion.div>
        {demoUploaded && !feedback.length && (
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl text-white mb-4">Awaiting Feedback</h3>
            <p className="text-gray-300">
              Your demo is being reviewed by{" "}
              {pricingTier === "premium"
                ? "5+"
                : pricingTier === "pro"
                ? "3-5"
                : "1-3"}{" "}
              testers. Check back in{" "}
              {pricingTier === "premium"
                ? "12"
                : pricingTier === "pro"
                ? "18"
                : "24"}{" "}
              hours for feedback.
            </p>
          </motion.div>
        )}
        {feedback.length > 0 && (
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl text-white mb-4">Human Feedback</h3>
            <ul className="space-y-4">
              {feedback.map((fb, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  Rating: {fb.rating}/5 - {fb.comment} (by Tester ID:{" "}
                  {fb.userId})
                </motion.li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="text-white mb-2">Analytics</h4>
              <Bar data={chartData} options={options} />
              <p className="text-gray-400 mt-2">
                Average Rating:{" "}
                {(
                  feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
                  feedback.length
                ).toFixed(1)}
                /5
              </p>
              <p className="text-gray-400">
                Quit Points:{" "}
                {feedback.some((f) => f.comment?.includes("quit"))
                  ? "Detected"
                  : "None reported"}
              </p>
            </div>
            {(pricingTier === "free" || pricingTier === "pro") && (
              <motion.button
                className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 hover:scale-105 transition-transform duration-200"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate("/pricing")} // Link to pricing page or modal
              >
                Upgrade to {pricingTier === "free" ? "Pro" : "Premium"} for More
                Features
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
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
}
