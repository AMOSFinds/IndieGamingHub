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
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

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
      <img
        src={dev.profilePicUrl}
        alt={`${dev.name}'s profile`}
        className="dev-image"
      />
      <h3 className="dev-name">{dev.name}</h3>
      {dev.job && <h4 className="dev-job">{dev.job}</h4>}{" "}
      <p className="dev-bio">{dev.bio}</p>
      {dev.website && (
        <div className="dev-website">
          <a href={dev.website} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        </div>
      )}
      <div className="dev-socials">
        {dev.twitter && (
          <a href={dev.twitter} target="_blank" rel="noopener noreferrer">
            <BsTwitterX />
          </a>
        )}
        {dev.linkedin && (
          <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
      </div>
      <div className="dev-games">
        <h4 className="games-title">Games:</h4>
        <ul className="games-list">
          {dev.games && games.map((game, index) => <li key={index}>{game}</li>)}
        </ul>
      </div>
      <div className="dev-actions">
        <button onClick={handleFollow} className="follow-button">
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button onClick={handleViewDev} className="view-dev-button">
          View Dev
        </button>
      </div>
    </div>
  );
}

export default DevProfileCard;
