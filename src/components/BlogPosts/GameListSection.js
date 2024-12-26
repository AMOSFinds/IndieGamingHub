import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const GameListSection = () => {
  const [gameLists, setGameLists] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const listsRef = collection(db, "gameLists");
    const q = query(listsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGameLists(fetchedLists);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="game-list-section">
      <h2>User Game Lists</h2>
      {gameLists.map((list) => (
        <div key={list.id} className="game-list">
          <h3>{list.title}</h3>
          <ul>
            {list.games.map((game, index) => (
              <li key={index}>{game}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GameListSection;
