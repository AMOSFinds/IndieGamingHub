import React, { useState, useEffect } from "react";

const Recommendations = ({ userId }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    fetch(`/api/recommendations?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [userId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>Recommended for You</h2>
      {games.map((game) => (
        <div
          key={game.id}
          style={{ margin: "10px", border: "1px solid #ccc", padding: "10px" }}
        >
          <img
            src={game.imageUrl}
            alt={game.title}
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
          />
          <h3>{game.title}</h3>
          <p>{game.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
