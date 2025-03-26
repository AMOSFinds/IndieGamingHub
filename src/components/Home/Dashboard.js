import { auth, db } from "../firebase/firebase-config";
import {
  getDocs,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import PaystackCheckout from "./PaystackCheckout";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSubscriptionTier from "./hooks/useSubscriptionTier";

export default function Dashboard() {
  const { tier, loading: tierLoading } = useSubscriptionTier(); // Subscription hook
  const [gameName, setGameName] = useState("");
  const [pricingData, setPricingData] = useState(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false); // Renamed to avoid conflict
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const historyRef = collection(db, "games");
        const snapshot = await getDocs(historyRef);
        const userGames = snapshot.docs
          .map((doc) => doc.data())
          .filter((entry) => entry.userId === user.uid);

        setHistory(userGames);
      }
    };

    fetchHistory();
  }, []);

  const fetchSteamPricing = async (gameName) => {
    try {
      const response = await fetch(
        `https://us-central1-my-gaming-platform.cloudfunctions.net/fetchSteamPricing?name=${encodeURIComponent(
          gameName
        )}`
      );
      const data = await response.json();

      if (!data || !data.items) {
        return [];
      }

      return data.items.map((item) => ({
        gameId: item.id,
        name: item.name,
        price: item.price ? `$${(item.price.final / 100).toFixed(2)}` : "N/A",
      }));
    } catch (error) {
      console.error("Error fetching Steam pricing:", error);
      return [];
    }
  };

  const handleCheckPricing = async () => {
    setIsPricingLoading(true);

    const competitorGames = await fetchSteamPricing(gameName);

    if (competitorGames.length > 0) {
      const suggestedPrice = (
        competitorGames
          .map((game) => parseFloat(game.price.replace("$", "")) || 0)
          .reduce((sum, price) => sum + price, 0) / competitorGames.length
      ).toFixed(2);

      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "games"), {
          userId: user.uid,
          gameName,
          suggestedPrice,
          competitorGames,
          createdAt: serverTimestamp(),
        });
      }

      setPricingData({
        suggestedPrice,
        competitorGames,
      });
    } else {
      setPricingData(null);
      alert("No competitor pricing data found for this game.");
    }

    setIsPricingLoading(false);
  };

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
        entry.gameName,
        `$${entry.suggestedPrice}`,
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

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <motion.h1 className="text-4xl font-bold text-teal-400 text-center mb-6">
        AI-Powered Game Pricing Optimization
      </motion.h1>

      {tierLoading ? (
        <p className="text-gray-400 text-center">Loading your plan...</p>
      ) : tier === "free" ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Upgrade to access full features!</p>
          <PaystackCheckout plan="pro" />
          <PaystackCheckout plan="enterprise" />
          <p className="text-xs text-gray-500 mt-2">
            You’ll be charged in your local currency. Powered by Paystack.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 text-center mb-6">
            Enter the name of games similar to yours to get the best pricing
            recommendation based on real Steam market data.
          </p>

          <div className="max-w-md mx-auto flex space-x-2">
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter your game title..."
              className="p-2 flex-grow bg-gray-800 rounded-lg text-white"
            />
            <button
              onClick={handleCheckPricing}
              className="bg-teal-500 px-4 py-2 rounded-lg"
              disabled={isPricingLoading}
            >
              {isPricingLoading ? "Loading..." : "Get Pricing Data"}
            </button>
          </div>

          {pricingData && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold">
                Suggested Price: ${pricingData.suggestedPrice}
              </h2>
              <h3 className="mt-4 text-lg">Competitor Games:</h3>
              <ul className="mt-2">
                {pricingData.competitorGames.map((game, index) => (
                  <li key={index} className="text-gray-300">
                    {game.name} - ${game.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center mt-12">
            <button
              onClick={exportHistoryToCSV}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mb-4 text-center"
            >
              Download CSV
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-teal-400 text-center mb-4">
                Your Pricing History
              </h2>
              <div className="overflow-x-auto max-w-4xl mx-auto">
                <table className="w-full bg-gray-800 text-white rounded-lg shadow-lg text-sm">
                  <thead>
                    <tr className="bg-teal-600 text-left">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Game</th>
                      <th className="px-4 py-2">Suggested Price</th>
                      <th className="px-4 py-2">Top Competitor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-700 hover:bg-gray-700"
                      >
                        <td className="px-4 py-2">
                          {entry.createdAt?.toDate
                            ? entry.createdAt.toDate().toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2">{entry.gameName}</td>
                        <td className="px-4 py-2">${entry.suggestedPrice}</td>
                        <td className="px-4 py-2">
                          {entry.competitorGames &&
                          entry.competitorGames.length > 0
                            ? `${entry.competitorGames[0].name} ($${entry.competitorGames[0].price})`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
