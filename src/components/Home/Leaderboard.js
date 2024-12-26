import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import "./Leaderboard.css";
import LoadingIndicator from "../LoadingIndicator";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("points", "desc"), limit(10)); // Top 10 users

      try {
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaders(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ul className="leaderboard-list">
          {leaders.map((user, index) => (
            <li key={user.id} className="leaderboard-item">
              <div className="leaderboard-rank">#{index + 1}</div>
              <img
                src={user.profilePicUrl}
                alt={`${user.username}'s profile`}
                className="leaderboard-pic"
              />
              <div className="leaderboard-info">
                <p className="leaderboard-name">{user.username}</p>
                <p className="leaderboard-points">{user.points} points</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
