import React from "react";
import "./DevProfileCard.css";

function DevProfileCard({ dev }) {
  // Ensure dev.games is always an array or a single string
  let games = [];
  if (Array.isArray(dev.games)) {
    games = dev.games;
  } else if (typeof dev.games === "string") {
    games = [dev.games];
  }
  return (
    <div className="dev-profile-card">
      <img
        src={dev.imageUrl}
        alt={`${dev.name}'s profile`}
        className="dev-image"
      />
      <h3 className="dev-name">{dev.name}</h3>
      <p className="dev-bio">{dev.bio}</p>
      <h3 className="website-title">Website:</h3>
      <p className="dev-website">
        <a href={dev.website} target="_blank" rel="noopener noreferrer">
          {dev.website}
        </a>
      </p>
      <p className="dev-socials">
        <a href={dev.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>{" "}
        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
      <div className="dev-games">
        <h3>Games:</h3>
        {games.length > 0 ? (
          <ul>
            {games.map((game, index) => (
              <li key={index}>{game}</li>
            ))}
          </ul>
        ) : (
          <p>No games listed.</p>
        )}
      </div>
    </div>
  );
}

export default DevProfileCard;
