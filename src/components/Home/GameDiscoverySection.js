import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  getFirestore,
} from "firebase/firestore";
import allgames from "./AllGames/AllGameData";
import "./GameDiscoverySection.css";

const GameDiscoverySection = (allgame) => {
  const navigate = useNavigate();
  const [hoveredGameId, setHoveredGameId] = useState(null);

  const handleMouseEnter = (gameId) => setHoveredGameId(gameId);
  const handleMouseLeave = () => setHoveredGameId(null);

  const handleExploreAllClick = () => {
    navigate("/allgames");
  };

  const featuredGames = allgames.slice(0, 6);
  // const latestGames = allgames.slice(0, 6);

  return (
    <section id="game-discovery-section" className="game-discovery-section">
      {/* <div className="game-discovery-header">
        <h2 className="gamesection-title">Discover Indie Gems</h2>
      </div> */}

      <div className="game-carousel-section">
        <h3 className="carousel-title">Featured Games of the Week</h3>

        <div id="games-carousel" className="carousel">
          {featuredGames.map((game) => (
            <Link
              to={`/games/${game.id}`}
              key={game.id}
              className="carousel-item-link"
              onMouseEnter={() => handleMouseEnter(game.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="game-card">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="game-image"
                />
                <h4 className="game-title">{game.title}</h4>
                <p className="game-subtitle">{game.genre}</p>
                {hoveredGameId === game.id && (
                  <p className="hover-text">
                    Click to rate, review, or get more information
                  </p>
                )}
              </div>
            </Link>
          ))}
          <button className="see-all-games" onClick={handleExploreAllClick}>
            See All Games →
          </button>
        </div>
      </div>

      {/* <div className="game-carousel-section">
        <h3 className="carousel-title">Latest Added Games</h3>
        <div className="carousel">
          {latestGames.map((game) => (
            <Link
              to={`/games/${game.id}`}
              key={game.id}
              className="carousel-item-link"
            >
              <div className="game-card">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="game-image"
                />
                <h4 className="game-title">{game.title}</h4>
                <p className="game-subtitle">{game.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default GameDiscoverySection;
