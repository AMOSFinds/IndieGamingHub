import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import allgames from "../AllGames/AllGameData"; // Import game data
import "./GameDetails.css";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";

const GameDetails = () => {
  const { gameId } = useParams(); // Get game ID from URL
  // const game = allgames.find((g) => g.id === gameId); // Find the selected game
  const [game, setGame] = useState(null);

  // const platformIcons = {
  //   PC: "💻",
  //   PS5: "🎮",
  //   PS4: "🎮",
  //   Xbox: "🕹️",
  //   Switch: "🎮",
  //   Mac: "🍏",
  //   Linux: "🐧",
  //   iOS: "📱",
  //   Android: "🤖",
  // };

  useEffect(() => {
    // Find the game with the matching ID from allgames
    const foundGame = allgames.find((game) => game.id.toString() === gameId);
    // console.log("Found Game:", foundGame);
    setGame(foundGame);
  }, [gameId]);

  if (!game) {
    return <div className="error-message">Game not found!</div>; // Handle invalid game ID
  }

  return (
    <div className="game-detail-container">
      {/* Hero Section */}
      <div
        className="game-banner"
        style={{
          backgroundImage: `url(${game.bannerImage || game.imageUrl})`,
        }}
      ></div>
      <h1 className="game-title">{game.title}</h1>

      {/* Main Game Details */}
      <div className="game-info-section">
        <h2 className="section-heading">Why We Love It</h2>
        <p className="game-description">
          {game.description || "A hidden indie gem that stands out!"}
        </p>

        {/* Game Stats Section */}
        <div className="game-stats">
          <span className="game-genre">🎮 {game.genre}</span>
          <span className="release-date">🗓️ {game.release || "Unknown"}</span>
        </div>

        {/* Platform Icons */}
        <div className="platform-icons">
          {(Array.isArray(game.platform) ? game.platform : [game.platform]).map(
            (platform, index) => (
              <span key={index} className="platform-text">
                {platform}
              </span>
            )
          )}
        </div>

        {/* Screenshots Section */}
        <div className="game-screenshots">
          <h3 className="section-heading">Screenshots</h3>
          <div className="screenshot-gallery">
            {game.screenshots && game.screenshots.length ? (
              game.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  className="screenshot"
                />
              ))
            ) : (
              <p>No screenshots available</p>
            )}
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="game-cta">
          <a
            href={game.playLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="play-button"
          >
            Play Now
          </a>
          <Link to="/#game-discovery-section" className="back-button">
            Back to All Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
