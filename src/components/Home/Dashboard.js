import { auth, db } from "../firebase/firebase-config";
import {
  getDocs,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import PaystackCheckout from "./PaystackCheckout";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSubscriptionTier from "./hooks/useSubscriptionTier";
import { analytics } from "../firebase/firebase-config";
import { logEvent } from "firebase/analytics";

export default function Dashboard() {
  const { tier, loading: tierLoading } = useSubscriptionTier();
  const [gameName, setGameName] = useState("");
  const [genre, setGenre] = useState("");
  const [playtime, setPlaytime] = useState("");
  const [scope, setScope] = useState("");
  const [pricingData, setPricingData] = useState(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
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

  logEvent(analytics, "game_pricing_query", {
    user_id: auth.currentUser?.uid,
    tier: tier,
  });

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

      const appDetails = await Promise.all(
        data.items.slice(0, 10).map(async (item) => {
          const appId = item.id;
          try {
            const detailsRes = await fetch(
              `https://us-central1-my-gaming-platform.cloudfunctions.net/getSteamGameDetails?appid=${appId}`
            );
            const details = await detailsRes.json();
            const price = item.price
              ? `$${(item.price.final / 100).toFixed(2)}`
              : "N/A";
            return {
              gameId: appId,
              name: item.name,
              price,
              genres:
                details[appId]?.data?.genres?.map((g) => g.description) || [],
              playtime: details[appId]?.data?.average_playtime || 0,
            };
          } catch (err) {
            return null;
          }
        })
      );

      return appDetails.filter((game) => game !== null);
    } catch (error) {
      console.error("Error fetching Steam pricing:", error);
      return [];
    }
  };

  const handleCheckPricing = async () => {
    setIsPricingLoading(true);

    const queriesRef = collection(db, "queries");
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const querySnapshot = await getDocs(
      query(
        queriesRef,
        where("userId", "==", auth.currentUser.uid),
        where("timestamp", ">=", startOfMonth)
      )
    );

    const queryLimit = tier === "free" ? 10 : tier === "pro" ? 30 : Infinity;

    if (querySnapshot.size >= queryLimit) {
      alert(
        "You've hit your monthly limit. Upgrade to unlock more pricing checks."
      );
      setIsPricingLoading(false);
      return;
    }

    await addDoc(queriesRef, {
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    const competitorGames = await fetchSteamPricing(gameName);

    const filteredGames = competitorGames.filter((game) => {
      const genreMatch = genre
        ? game.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
        : true;
      return genreMatch;
    });

    const validPrices = filteredGames
      .map((game) => parseFloat(game.price.replace("$", "")))
      .filter((price) => !isNaN(price) && price > 0);

    const suggestedPrice =
      validPrices.length > 0
        ? Math.min(
            validPrices.reduce((sum, price) => sum + price, 0) /
              validPrices.length,
            49.99
          ).toFixed(2)
        : "N/A";

    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "games"), {
        userId: user.uid,
        gameName,
        genre,
        playtime,
        scope,
        suggestedPrice,
        competitorGames: filteredGames,
        createdAt: serverTimestamp(),
      });
    }

    if (suggestedPrice === "N/A") {
      alert(
        "We couldn't generate a price due to missing or bad competitor data. Try refining your input."
      );
    }

    setPricingData({
      suggestedPrice,
      competitorGames: filteredGames,
    });

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
      ) : tier === "free" && history.length >= 10 ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            You’ve used all your free pricing queries this month.
          </p>
          <PaystackCheckout plan="pro" />
          <br />
          <PaystackCheckout plan="enterprise" />
        </div>
      ) : (
        <>
          {/* <p className="text-sm text-gray-400 text-center mb-6">
            Enter the name of games similar to yours to get the best pricing
            recommendation based on real Steam market data.
          </p> */}

          <p className="text-sm text-gray-400 text-center mb-6 max-w-xl mx-auto">
            <strong>Step 1:</strong> Enter a popular or similar indie game on
            Steam that resembles yours.
            <br />
            <strong>Step 2:</strong> Tell us about your own game’s genre,
            playtime, and scope so we can fine-tune the pricing.
          </p>

          <div className="max-w-md mx-auto flex flex-col space-y-3">
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter your game title..."
              className="p-2 bg-gray-800 rounded-lg text-white"
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
              <option value="">Scope</option>
              <option value="Solo">Solo Developer</option>
              <option value="Small Team">Small Team</option>
              <option value="Studio-Level">Studio-Level</option>
            </select>
            <button
              onClick={handleCheckPricing}
              className="bg-teal-500 px-4 py-2 rounded-lg hover:bg-teal-600"
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
              <p className="text-gray-400 mt-3 text-sm">
                Based on {pricingData.competitorGames.length} Steam titles
                similar to the one you entered, adjusted for your game’s genre,
                playtime, and scope: <strong>{genre}</strong>, scope:{" "}
                <strong>{scope}</strong>, and playtime:{" "}
                <strong>{playtime}</strong>.
              </p>
              <h3 className="mt-4 text-lg">Competitor Games:</h3>
              <ul className="mt-2">
                {pricingData.competitorGames.map((game, index) => (
                  <li key={index} className="text-gray-300">
                    <span className="font-semibold">{game.name}</span> —{" "}
                    {game.price || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(tier === "pro" || tier === "enterprise") && (
            <div className="flex justify-center mt-12">
              <button
                onClick={exportHistoryToCSV}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mb-4 text-center"
              >
                Download CSV
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
