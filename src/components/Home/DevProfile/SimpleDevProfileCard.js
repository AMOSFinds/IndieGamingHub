import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../DeveloperProfileSection.css";

function SimpleDevProfileCard({ dev }) {
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
    navigate(`/devpage/${dev.id}`);
  };

  const isOwner = user?.uid === dev?.id;

  return (
    <div className="profile-card">
      <img
        src={dev.profilePicUrl}
        alt={`${dev.name}'s profile`}
        className="dev-image"
      />
      <div className="developer-info">
        <h3 className="developer-name">{dev.name}</h3>
        <h4 className="dev-job">{dev.job}</h4>
        <p className="developer-bio">{dev.bio}</p>
        {!isOwner && (
          <button onClick={handleFollow} className="follow-button">
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
        <button onClick={handleViewDev} className="view-dev-button">
          View Profile
        </button>
      </div>
    </div>
  );
}

export default SimpleDevProfileCard;
