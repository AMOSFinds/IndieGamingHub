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
import { Link } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [following, setFollowing] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (user) => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        setBadges(userDoc.data().badges || []);
      }

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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleScrollLeft = (carouselId) => {
    document
      .getElementById(carouselId)
      .scrollBy({ left: -300, behavior: "smooth" });
  };

  const handleScrollRight = (carouselId) => {
    document
      .getElementById(carouselId)
      .scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return <LoadingIndicator />;

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

          <div className="profile-row">
            <h3 className="section-title">Following Developers</h3>
            <div className="profilecarousel-wrapper">
              <button
                className="profilecarousel-arrow left"
                onClick={() => handleScrollLeft("developers-carousel")}
              >
                ❮
              </button>
              <div id="developers-carousel" className="profilecarousel">
                {following.map((dev) => (
                  <div key={dev.developerId} className="developer-card">
                    <img
                      src={dev.developerProfilePic}
                      alt={dev.developerName}
                      className="developer-image"
                    />
                    <h4 className="developer-name">{dev.developerName}</h4>
                    <Link
                      to={`/devpage/${dev.developerId}`}
                      className="view-profile-button"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
              <button
                className="profilecarousel-arrow right"
                onClick={() => handleScrollRight("developers-carousel")}
              >
                ❯
              </button>
            </div>
          </div>

          <div className="profile-row">
            <h3 className="section-title">Badges</h3>
            <div className="profilecarousel-wrapper">
              <button
                className="profilecarousel-arrow left"
                onClick={() => handleScrollLeft("badges-carousel")}
              >
                ❮
              </button>
              <div id="badges-carousel" className="profilecarousel">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <div key={badge.id} className="badge-card">
                      <img
                        src={badge.icon}
                        alt={badge.name}
                        className="badge-icon"
                      />
                      <p className="badge-name">{badge.name}</p>
                    </div>
                  ))
                ) : (
                  <p>No badges earned yet.</p>
                )}
              </div>
              <button
                className="profilecarousel-arrow right"
                onClick={() => handleScrollRight("badges-carousel")}
              >
                ❯
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

export default Profile;
