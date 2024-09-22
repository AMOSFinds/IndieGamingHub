import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import this to navigate to the DevPage
import "./DevProfileCard.css";

function DevProfileCard({ dev }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const checkFollowing = async () => {
        const docRef = doc(db, `users/${user.uid}/following`, dev.id);
        const docSnap = await getDoc(docRef);
        setIsFollowing(docSnap.exists());
      };
      checkFollowing();
    }
  }, [user, dev.id, db]);

  const handleFollow = async () => {
    if (user) {
      const userFollowRef = doc(db, `users/${user.uid}/following`, dev.id);
      const developerFollowerRef = doc(
        db,
        `developers/${dev.id}/followers`,
        user.uid
      );
      if (isFollowing) {
        await deleteDoc(userFollowRef);
        await deleteDoc(developerFollowerRef);
        setIsFollowing(false);
      } else {
        await setDoc(userFollowRef, {
          developerId: dev.id,
          developerName: dev.name,
          developerProfilePic: dev.profilePicUrl,
        });
        await setDoc(developerFollowerRef, {
          userId: user.uid,
          userName: user.displayName,
          userProfilePic: user.photoURL,
        });
        setIsFollowing(true);
      }
    }
  };

  const handleViewDev = () => {
    navigate(`/devpage/${dev.id}`); // Redirect to the developer's page
  };

  let games = [];
  if (Array.isArray(dev.games)) {
    games = dev.games;
  } else if (typeof dev.games === "string") {
    games = [dev.games];
  }

  return (
    <div className="dev-profile-card">
      <div className="dev-profile-header">
        <h3 className="dev-name">{dev.name}</h3>
        <div className="dev-profile-actions">
          <button onClick={handleFollow} className="follow-button">
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <button onClick={handleViewDev} className="view-dev-button">
            View Dev
          </button>
        </div>
      </div>
      <img
        src={dev.profilePicUrl}
        alt={`${dev.name}'s profile`}
        className="dev-image"
      />
      <p className="dev-bio">{dev.bio}</p>
      <h3 className="website-title">Website:</h3>
      <p className="dev-website">
        <a href={dev.website} target="_blank" rel="noopener noreferrer">
          {dev.website}
        </a>
      </p>
      <p className="dev-socials">
        <a href={dev.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>{" "}
        <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
      <div className="dev-games">
        <h3>Games:</h3>
        {games.length > 0 ? (
          <ul>
            {games.map((game, index) => (
              <li key={index}>{game}</li>
            ))}
          </ul>
        ) : (
          <p>No games listed.</p>
        )}
      </div>
    </div>
  );
}

export default DevProfileCard;
