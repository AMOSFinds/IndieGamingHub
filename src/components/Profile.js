import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUpload } from "react-icons/fa";
import Favorites from "../components/Home/AllGames/Favorites";
import LoadingIndicator from "./LoadingIndicator";
import "./Profile.css";
function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [following, setFollowing] = useState([]);
  const [devProfile, setDevProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleEditClick = () => {
    setEditedProfile(userData);
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    const db = getFirestore();
    const storage = getStorage();
    let profileImageUrl = userData.profilePicUrl;

    if (image) {
      const storageRef = ref(
        storage,
        `profileImages/${user.uid}/${image.name}`
      );
      await uploadBytes(storageRef, image);
      profileImageUrl = await getDownloadURL(storageRef);
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      ...editedProfile,
      profilePicUrl: profileImageUrl,
    });
    setUserData({
      ...editedProfile,
      profilePicUrl: profileImageUrl,
    });
    setIsEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "users", user.uid));
        setUser(null); // Log the user out after deleting the profile
      } catch (err) {
        console.error("Error deleting profile: ", err);
      }
    }
  };

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-info">
          {isEditing ? (
            <div className="profile-edit">
              <input
                type="text"
                value={editedProfile.username}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    username: e.target.value,
                  })
                }
                className="signin-input"
              />

              <div className="form-group">
                <label className="profile-title">Profile Image:</label>
                <label htmlFor="file-upload" className="custom-file-upload">
                  <FaUpload /> Choose Image
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
              <button onClick={handleSaveClick} className="follow-button">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div>
              <img
                src={userData.profilePicUrl}
                alt="Profile"
                className="profile-pic"
              />
              <h1 className="profile-username">{userData.username}</h1>
              <h2 className="profile-email">{userData.email}</h2>
              <button onClick={handleEditClick} className="follow-button">
                Edit
              </button>
              <button onClick={handleDelete} className="delete2-button">
                Delete
              </button>
            </div>
          )}
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
