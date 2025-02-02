import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  increment,
  deleteDoc,
  setDoc,
  where,
} from "firebase/firestore";
import "./Leaderboard.css";
import LoadingIndicator from "../LoadingIndicator";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topReviewers, setTopReviewers] = useState([]);
  const [mostFollowedDevs, setMostFollowedDevs] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("points", "desc"), limit(10)); // Top 10 users

      try {
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.points > 0); // Filter out zero points
        setLeaders(leaderboardData);

        // Fetch Top 10 Reviewers
        const qReviews = query(
          usersRef,
          orderBy("reviewsCount", "desc"),
          limit(10)
        );
        const reviewersSnapshot = await getDocs(qReviews);
        const reviewersData = reviewersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopReviewers(reviewersData);

        // Fetch Most Followed Developers
        const developersRef = collection(db, "developers");
        const qFollowers = query(
          developersRef,
          orderBy("followersCount", "desc"),
          limit(10),
          where("followersCount", ">", 0)
        );
        const developersSnapshot = await getDocs(qFollowers);
        const developersData = developersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMostFollowedDevs(developersData);

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
      <p className="leaderboard-text">
        Earn points for daily sign-ins, rating games, writing reviews, and more!
      </p>
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
      <hr className="section-divider" />
      <h3 className="leaderboard-subtitle">Top Reviewers</h3>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ul className="leaderboard-list">
          {topReviewers.map((reviewer, index) => (
            <li key={reviewer.id} className="leaderboard-item">
              <div className="leaderboard-rank">#{index + 1}</div>
              <img
                src={reviewer.profilePicUrl}
                alt={`${reviewer.username}'s profile`}
                className="leaderboard-pic"
              />
              <div className="leaderboard-info">
                <p className="leaderboard-name">{reviewer.username}</p>
                <p className="leaderboard-points">
                  {reviewer.reviewsCount} reviews
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* <h3 className="leaderboard-subtitle">Most Followed Developers</h3>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ul className="leaderboard-list">
          {mostFollowedDevs.map((dev, index) => (
            <li key={dev.id} className="leaderboard-item">
              <div className="leaderboard-rank">#{index + 1}</div>
              <img
                src={dev.profilePicUrl}
                alt={`${dev.name}'s profile`}
                className="leaderboard-pic"
              />
              <div className="leaderboard-info">
                <p className="leaderboard-name">{dev.name}</p>
                <p className="leaderboard-points">
                  {dev.followersCount} followers
                </p>
              </div>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default Leaderboard;
