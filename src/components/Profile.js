import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Favorites from "../components/Home/AllGames/Favorites";
import LoadingIndicator from "./LoadingIndicator";
import "./Profile.css";
function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async (user) => {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-info">
          <img
            src={userData.profilePicUrl}
            alt="Profile"
            className="profile-pic"
          />
          <h1 className="profile-username">{userData.username}</h1>
          <h2 className="profile-email">{userData.email}</h2>
          {/* Add more user info and features here */}
          <Favorites />
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

export default Profile;
