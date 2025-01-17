import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./GameDiscoverySection.css";
import allgames from "./AllGames/AllGameData";

const GameDiscoverySection = () => {
  const navigate = useNavigate();
  const [hoveredGameId, setHoveredGameId] = useState(null);

  const featuredGames = allgames.slice(0, 10);

  return (
    <section id="game-discovery-section" className="game-discovery-section">
      <h2 className="gamesection-title">Featured Indie Gems of the Week</h2>
      <div className="discovery-game-carousel">
        {featuredGames.map((game) => (
          <div
            key={game.id}
            className="discovery-game-card"
            onMouseEnter={() => setHoveredGameId(game.id)}
            onMouseLeave={() => setHoveredGameId(null)}
          >
            <Link to={`/games/${game.id}`} className="discovery-game-link">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="discovery-game-image"
              />
              <h3 className="discovery-game-title">{game.title}</h3>
              <p className="discovery-game-genre">{game.genre}</p>
              {hoveredGameId === game.id && (
                <p className="discovery-hover-description">
                  "Our Take": {game.description.slice(0, 80)}...
                </p>
              )}
              <div className="discovery-platform-icons">
                {game.platform.map((platform) => (
                  <span key={platform} className="platform-icon">
                    {platform === "PC"
                      ? "💻"
                      : platform === "PS5"
                      ? "🎮"
                      : "🕹️"}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameDiscoverySection;
