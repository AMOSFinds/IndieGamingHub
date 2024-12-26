import React, { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const GameListForm = () => {
  const [title, setTitle] = useState("");
  const [games, setGames] = useState([]);
  const [gameInput, setGameInput] = useState("");
  const auth = getAuth();
  const db = getFirestore();

  const handleAddGame = () => {
    if (gameInput) {
      setGames([...games, gameInput]);
      setGameInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) return;

    const newList = {
      userId: user.uid,
      username: user.displayName,
      title,
      games,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "gameLists"), newList);
      setTitle("");
      setGames([]);
    } catch (error) {
      console.error("Error adding game list:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="game-list-form">
      <input
        type="text"
        placeholder="List Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div>
        <input
          type="text"
          placeholder="Add a game"
          value={gameInput}
          onChange={(e) => setGameInput(e.target.value)}
        />
        <button type="button" onClick={handleAddGame}>
          Add
        </button>
      </div>
      <ul>
        {games.map((game, index) => (
          <li key={index}>{game}</li>
        ))}
      </ul>
      <button type="submit">Save List</button>
    </form>
  );
};

export default GameListForm;
