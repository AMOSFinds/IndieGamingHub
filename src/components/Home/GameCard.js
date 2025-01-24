import React from "react";

const GameCard = ({ game }) => {
  return (
    <div
      style={{
        width: "300px",
        margin: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={game.imageUrl}
        alt={game.title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <div style={{ padding: "10px" }}>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
      </div>
    </div>
  );
};

export default GameCard;
