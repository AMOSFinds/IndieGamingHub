import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Favorites from "../components/Home/AllGames/Favorites";
import LoadingIndicator from "./LoadingIndicator";
import "./Profile.css";
function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [following, setFollowing] = useState([]);
  const [devProfile, setDevProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async (user) => {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }

      const devDoc = await getDoc(doc(db, "developers", user.uid));
      if (devDoc.exists()) {
        setDevProfile(devDoc.data());
      }
    };

    const fetchFollowing = async (user) => {
      const db = getFirestore();
      const followingCollection = collection(db, `users/${user.uid}/following`);
      const followingSnapshot = await getDocs(followingCollection);
      const followingList = followingSnapshot.docs.map((doc) => doc.data());
      setFollowing(followingList);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
        fetchFollowing(currentUser);
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

          {/* <div className="alldevs-list">
            <h3 className="favorites-title">Following Developers</h3>
            <div className="dev-profile-card">
              {following.map((dev) => (
                <div key={dev.developerId} className="following-card">
                  <img
                    src={dev.developerProfilePic}
                    alt={dev.developerName}
                    className="dev-image"
                  />
                  <h4 className="dev-name">{dev.developerName}</h4>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

export default Profile;
