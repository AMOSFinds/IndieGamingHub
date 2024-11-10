import React from "react";
import { useNavigate } from "react-router-dom";
import allgames from "./AllGames/AllGameData"; // Make sure to adjust the import path if needed
import SimpleAllGamesCard from "./AllGames/SimpleAllGamesCard";
import "./GameDiscoverySection.css";

const GameDiscoverySection = () => {
  const navigate = useNavigate();

  const handleExploreAllClick = () => {
    navigate("/allgames"); // Update this path to the actual route for the full games page
  };

  return (
    <section className="game-discovery-section">
      {/* Game Cards Grid */}
      <div className="game-cards-grid">
        {/* Display the first three games */}
        {allgames.slice(0, 3).map((game) => (
          <SimpleAllGamesCard key={game.id} allgame={game} />
        ))}

        <div className="explore-all-card" onClick={handleExploreAllClick}>
          <h3>Uncover Full Selection</h3>
          <p className="explore-arrow">→</p>
        </div>
      </div>
    </section>
  );
};

export default GameDiscoverySection;
