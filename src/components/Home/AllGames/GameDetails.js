import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import allgames from "./AllGameData"; // Import the games data
import "./GameDetails.css";
import AllGamesCard from "./AllGamesCard";

function GameDetails() {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null);

  useEffect(() => {
    // Find the game with the matching ID from allgames
    const foundGame = allgames.find((game) => game.id.toString() === gameId);
    console.log("Found Game:", foundGame);
    setGame(foundGame);
  }, [gameId]);

  console.log("Game ID from URL:", gameId);
  console.log("All Games Data:", allgames);

  if (!game) return <p>Loading...</p>;

  return (
    <div className="game-details-page">
      {/* Reuse the AllGamesCard component for display */}
      <AllGamesCard key={game.id} allgame={game} />
    </div>
  );
}

export default GameDetails;
