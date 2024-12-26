import React from "react";
import "./SimpleAllGamesCard.css";
import { Link } from "react-router-dom";

function SimpleAllGamesCard({ allgame }) {
  return (
    <Link to={`/games/${allgame.id}`} className="game-card-link">
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
    </Link>
  );
}

export default SimpleAllGamesCard;
