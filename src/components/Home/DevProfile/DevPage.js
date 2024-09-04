import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import "./DevProfileCard.css";
import LoadingIndicator from "../../LoadingIndicator";
import AllGamesData from "../AllGames/AllGameData";

function DevPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [devProfile, setDevProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [curatedGames, setCuratedGames] = useState([]);
  const [developerGames, setDeveloperGames] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    const fetchUserData = async (user) => {
      setLoading(true);
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      const devDoc = await getDoc(doc(db, "developers", user.uid));
      if (devDoc.exists()) {
        const gamesFromProfile = devDoc
          .data()
          .games.split(",")
          .map((game) => game.trim().toLowerCase()); // Normalize

        setDevProfile(devDoc.data());
        setDeveloperGames(gamesFromProfile);

        // Fetch the followers count
        const followersSnapshot = await getDocs(
          collection(db, "developers", user.uid, "followers")
        );
        const followersCount = followersSnapshot.size;

        // Fetch the analytics data for each game
        const gameStats = {};
        for (const gameName of gamesFromProfile) {
          const matchingGame = AllGamesData.find(
            (game) => game.title.trim().toLowerCase() === gameName
          );

          if (matchingGame) {
            const gameId = matchingGame.id;
            const gameDoc = await getDoc(doc(db, "games", gameId.toString()));

            if (gameDoc.exists()) {
              const ratings = gameDoc.data().ratings || {};
              const reviewsSnapshot = await getDocs(
                collection(db, "games", gameId.toString(), "reviews")
              );
              const reviewCount = reviewsSnapshot.size;

              const averageRating =
                (ratings.verygood || 0) * 5 +
                (ratings.good || 0) * 4 +
                (ratings.decent || 0) * 3 +
                (ratings.bad || 0) * 2;

              const totalRatings =
                (ratings.verygood || 0) +
                (ratings.good || 0) +
                (ratings.decent || 0) +
                (ratings.bad || 0);

              gameStats[matchingGame.title] = {
                averageRating: totalRatings
                  ? (averageRating / totalRatings).toFixed(1)
                  : "No ratings yet",
                reviewCount,
              };
            }
          }
        }

        setAnalyticsData({ followers: followersCount, gameStats });
      }
      setLoading(false);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
        setCuratedGames(AllGamesData);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setEditedProfile(devProfile);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const db = getFirestore();
    const devDocRef = doc(db, "developers", user.uid);
    await updateDoc(devDocRef, editedProfile);
    setDevProfile(editedProfile);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmDelete) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "developers", user.uid));
        setDevProfile(null); // Optionally redirect or show a message after deletion
      } catch (err) {
        console.error("Error deleting profile: ", err);
      }
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dev-view">
      {devProfile ? (
        <div className="dev-profile-card">
          <div className="dev-name">
            <h3>Developer Profile</h3>
            <button onClick={handleEditClick} className="follow-button">
              Edit
            </button>
            {user && devProfile.userId && user.uid === devProfile.userId && (
              <button onClick={handleDelete} className="delete2-button">
                Delete
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="dev-profile-edit">
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    name: e.target.value,
                  })
                }
                className="signin-input"
              />
              <textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    bio: e.target.value,
                  })
                }
                className="signin-input"
              />
              <input
                type="text"
                value={editedProfile.games}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    games: e.target.value,
                  })
                }
                className="signin-input"
              />
              <button onClick={handleSaveClick} className="follow-button">
                Save
              </button>
            </div>
          ) : (
            <div className="alldevs-list">
              <img
                src={devProfile.profilePicUrl}
                alt={devProfile.name}
                className="dev-image"
              />
              <h4 className="dev-name">{devProfile.name}</h4>
              <p className="dev-bio">{devProfile.bio}</p>
              <p className="dev-bio">{devProfile.games}</p>
            </div>
          )}
          {Object.keys(analyticsData).length > 0 && (
            <div className="analytics-section">
              <h3 className="analytics-title">Analytics for Your Games</h3>
              {/* <p>Follower Count: {analyticsData.followers}</p> */}
              {Object.keys(analyticsData.gameStats).map((gameName) => (
                <div key={gameName} className="game-analytics">
                  <h4>{gameName}</h4>
                  <p>
                    Average Rating:{" "}
                    {analyticsData.gameStats[gameName].averageRating}
                  </p>
                  <p>
                    Review Count:{" "}
                    {analyticsData.gameStats[gameName].reviewCount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="no-profiles">You have no developer profile.</p>
      )}
    </div>
  );
}

export default DevPage;
