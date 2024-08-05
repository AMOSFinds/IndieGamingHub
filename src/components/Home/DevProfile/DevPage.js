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
import AnalyticsDashboard from "./AnalyticsDashboard";
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
        setDevProfile(devDoc.data());
        setDeveloperGames(
          devDoc
            .data()
            .games.split(",")
            .map((game) => game.trim())
        );
      }
      setLoading(false);
    };

    // const fetchCuratedGames = async () => {
    //   const db = getFirestore();
    //   const curatedGamesCollection = collection(db, "games");
    //   const curatedGamesSnapshot = await getDocs(curatedGamesCollection);
    //   const curatedGamesList = curatedGamesSnapshot.docs.map(
    //     (doc) => doc.data().gameId
    //   );
    //   setCuratedGames(curatedGamesList);
    // };

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

  const relevantGames = developerGames.filter((devGame) =>
    curatedGames.some((curatedGame) => curatedGame.name === devGame)
  );

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
          {/* {relevantGames.length > 0 && (
            <div className="analytics-section">
              <h3>Analytics for Your Games</h3>
              {relevantGames.map((gameName) => {
                const gameId = curatedGames.find(
                  (curatedGame) => curatedGame.name === gameName
                ).id;
                return <AnalyticsDashboard key={gameId} gameId={gameId} />;
              })}
            </div>
          )} */}
        </div>
      ) : (
        <p className="no-profiles">You have no developer profile.</p>
      )}
    </div>
  );
}

export default DevPage;
