import React from "react";
import "./SimpleAllGamesCard.css";

function SimpleAllGamesCard({ allgame }) {
  return (
    <div className="all-games-card">
      <img
        src={allgame.imageUrl}
        alt={allgame.title}
        className="simplegame-image"
      />
      <div className="simplegame-info">
        <h3 className="simplegame-title">{allgame.title}</h3>
        <p className="simplegame-genre">{allgame.genre}</p>
      </div>
    </div>
  );
}

export default SimpleAllGamesCard;
