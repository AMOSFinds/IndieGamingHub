import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PaystackCheckout from "./PaystackCheckout";
import useSubscriptionTier from "./hooks/useSubscriptionTier";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions, app } from "../firebase/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

window.addEventListener("unhandledrejection", function (event) {
  console.error("🔥 Unhandled promise rejection:", event.reason);
});

export default function Dashboard() {
  const { tier, loading: tierLoading } = useSubscriptionTier();
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [playtime, setPlaytime] = useState("");
  const [scope, setScope] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const historyRef = collection(db, "games");
        const snapshot = await getDocs(
          query(historyRef, where("userId", "==", user.uid))
        );

        const userGames = snapshot.docs.map((doc) => doc.data());
        setHistory(userGames);
      }
    };

    fetchHistory();
  }, []);

  const exportHistoryToCSV = () => {
    const headers = [
      "Game",
      "Suggested Price",
      "Competitor Game",
      "Competitor Price",
      "Date",
    ];

    const rows = history.map((entry) => {
      const comp = entry.competitorGames?.[0] || {};
      const date = entry.createdAt?.toDate
        ? entry.createdAt.toDate().toLocaleDateString()
        : "N/A";

      return [
        entry.gameName || "N/A",
        `$${entry.suggestedPrice || "N/A"}`,
        comp.name || "N/A",
        `$${comp.price || "N/A"}`,
        date,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pricing_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSmartPricing = async () => {
    if (!description || !genre || !playtime || !scope) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setErrorMessage("You must be logged in to use this feature.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await auth.currentUser.getIdToken(true);

      // Log the request payload for debugging
      const requestData = { description, genre, playtime, scope };
      console.log("Calling getSmartPrice with data:", requestData);

      const getSmartPrice = httpsCallable(functions, "getSmartPrice");
      const response = await getSmartPrice(requestData);

      console.log("getSmartPrice response:", response);

      const data = response.data;
      setResult(data);
    } catch (err) {
      console.error("Error calling getSmartPrice:", err);
      console.error("Error details:", {
        code: err.code,
        message: err.message,
        details: err.details,
      });
      if (err.code === "unauthenticated") {
        setErrorMessage("Your session expired or you're not logged in.");
      } else {
        setErrorMessage(
          "Failed to get smart pricing: " +
            (err.message || "Unknown error occurred")
        );
      }
    }

    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    try {
      const cancel = httpsCallable(functions, "cancelSubscription");
      await cancel();
      setErrorMessage("Subscription cancelled. You are now on the Free plan.");
      window.location.reload();
    } catch (err) {
      setErrorMessage("Failed to cancel: " + err.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <motion.h1 className="text-4xl font-bold text-teal-400 text-center mb-6">
        AI-Powered Game Pricing Optimization
      </motion.h1>

      {errorMessage && (
        <div className="bg-red-700 text-white px-4 py-2 rounded-lg text-center mb-4 max-w-lg mx-auto">
          {errorMessage}
        </div>
      )}

      {tierLoading ? (
        <p className="text-gray-400 text-center">Loading your plan...</p>
      ) : tier === "free" && history.length >= 5 ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            You’ve used all your free pricing queries this month.
          </p>
          <div className="flex justify-center space-x-4">
            <PaystackCheckout plan="pro" />
            <PaystackCheckout plan="enterprise" />
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 text-center mb-6 max-w-xl mx-auto">
            Describe your game and let our AI do the rest. We’ll find similar
            games, calculate the ideal price, and explain why.
          </p>

          <div className="max-w-md mx-auto flex flex-col space-y-3">
            <textarea
              placeholder="Describe your game (e.g., A pixel-art platformer with boss fights and exploration)..."
              className="p-2 bg-gray-800 rounded-lg text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="p-2 bg-gray-800 rounded-lg text-white"
            >
              <option value="">Select Genre</option>
              <option value="Platformer">Platformer</option>
              <option value="RPG">RPG</option>
              <option value="FPS">FPS</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Strategy">Strategy</option>
              <option value="Simulation">Simulation</option>
              <option value="Adventure">Adventure</option>
            </select>
            <select
              value={playtime}
              onChange={(e) => setPlaytime(e.target.value)}
              className="p-2 bg-gray-800 rounded-lg text-white"
            >
              <option value="">Select Playtime</option>
              <option value="Short (<3 hrs)">Short (&lt;3 hrs)</option>
              <option value="Medium (3-10 hrs)">Medium (3–10 hrs)</option>
              <option value="Long (10+ hrs)">Long (10+ hrs)</option>
            </select>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="p-2 bg-gray-800 rounded-lg text-white"
            >
              <option value="">Select Scope</option>
              <option value="Solo Developer">Solo Developer</option>
              <option value="Small Team">Small Team</option>
              <option value="Studio-Level">Studio-Level</option>
            </select>
            <button
              onClick={handleSmartPricing}
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-white"
            >
              {loading ? "Calculating..." : "Get Smart Price"}
            </button>
          </div>
          {/* If user hits limit and tries again, button disables — or show inline message */}
          {tier === "free" && history.length >= 5 && (
            <p className="text-sm text-red-400 text-center mt-4">
              You’ve reached your 5 free queries this month. Upgrade for
              unlimited access.
            </p>
          )}

          {result && (
            <div className="mt-8 text-center">
              <h2 className="text-xl font-bold mb-2">
                💰 Suggested Price: ${result.suggestedPrice}
              </h2>
              <p className="text-gray-400 mb-4">{result.explanation}</p>

              <h3 className="text-lg font-semibold mt-6 mb-2">Similar Games</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                {result.competitors.map((game, index) => (
                  <li key={index}>
                    {game.name} –{" "}
                    {game.price === "$N/A" || !game.price
                      ? "$N/A"
                      : `$${game.price}`}
                  </li>
                ))}
              </ul>
              {(tier === "pro" || tier === "enterprise") &&
                history.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={exportHistoryToCSV}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      Download Pricing History (.CSV)
                    </button>
                  </div>
                )}
            </div>
          )}
          {tier === "enterprise" && history.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-teal-400 mb-4">
                Pricing Trends
              </h3>
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-gray-500 uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 py-2">Game</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="px-4 py-2">{entry.gameName}</td>
                      <td className="px-4 py-2">${entry.suggestedPrice}</td>
                      <td className="px-4 py-2">
                        {entry.createdAt?.toDate?.().toLocaleDateString() ||
                          "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tier === "free" && (
            <div className="flex justify-center mt-6">
              <PaystackCheckout plan="pro" />
              <PaystackCheckout plan="enterprise" />
            </div>
          )}

          {(tier === "pro" || tier === "enterprise") && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg "
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
