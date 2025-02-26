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
import { deleteUser, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Link } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import "./Profile.css";
import { FaUpload } from "react-icons/fa";
import CustomAlert from "./CustomAlert";

function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [following, setFollowing] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [editing, setEditing] = useState(false); // To toggle the edit form
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedProfilePic, setUpdatedProfilePic] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // For image upload
  const [uploading, setUploading] = useState(false);

  const db = getFirestore();

  const storage = getStorage(); // Initialize Firebase Storage

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

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

      // Fetch the followers count for the developer's profile
      const devProfileRef = doc(db, "developers", user.uid);
      const devProfileDoc = await getDoc(devProfileRef);
      if (devProfileDoc.exists()) {
        setIsDeveloper(true);
        setFollowersCount(devProfileDoc.data().followersCount || 0);
      }
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

  const handleEdit = async () => {
    try {
      let profilePicUrl = userData.profilePicUrl;

      // Upload the new profile picture if selected
      if (selectedImage) {
        setUploading(true);
        const storageRef = ref(
          storage,
          `profileImages/${user.uid}/${selectedImage.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload failed:", error);
              setUploading(false);
              reject(error);
            },
            async () => {
              profilePicUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              resolve();
            }
          );
        });
      }

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        username: updatedUsername || userData.username,
        profilePicUrl,
      });

      // Optionally update Firebase Auth profile
      await updateProfile(user, {
        displayName: updatedUsername || userData.username,
        photoURL: profilePicUrl,
      });

      setUserData((prev) => ({
        ...prev,
        username: updatedUsername || prev.username,
        profilePicUrl,
      }));

      setEditing(false); // Close the edit form
      setAlertMessage("Profile updated successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlertMessage("Failed to update profile. Please try again later.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "users", user.uid));
        if (isDeveloper) {
          await deleteDoc(doc(db, "developers", user.uid));
        }

        // Delete user from Firebase Auth
        await deleteUser(user);

        alert("Profile deleted successfully!");
        window.location.href = "/"; // Redirect after deletion
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Failed to delete profile. Please try again.");
      }
    }
  };

  // Function to copy referral link to clipboard
  const copyReferralLink = () => {
    // Assume the referral code is stored in userData.referralCode.
    // Construct a referral URL – adjust the URL to your domain.
    const referralURL = `${window.location.origin}/?ref=${userData.referralCode}`;
    navigator.clipboard.writeText(referralURL).then(
      () => {
        setAlertMessage("Referral link copied to clipboard!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      },
      () => {
        setAlertMessage("Failed to copy referral link.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    );
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="profile-container">
      {editing ? (
        <div className="edit-profile-form">
          <h3 className="edit-title">Edit Profile</h3>
          <input
            type="text"
            placeholder="New Username"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
          />
          <label htmlFor="file-upload" className="profilepicedit">
            <FaUpload /> Choose Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {uploading && <p className="upload-loading">Uploading image...</p>}
          <button onClick={handleEdit}>Save Changes</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-buttons">
          <button onClick={() => setEditing(true)}>Edit Profile</button>
          <button onClick={handleDelete} className="delete-profile-button">
            Delete Profile
          </button>
        </div>
      )}
      {user ? (
        <div className="profile-info">
          <img
            src={userData.profilePicUrl}
            alt="Profile"
            className="profile-pic"
          />
          <h1 className="profile-username">{userData.username}</h1>
          <h2 className="profile-email">{userData.email}</h2>

          {/* Referral Section */}
          {userData.referralCode && (
            <div className="referral-section">
              <h4 className="referral-text">
                Share this site with your friends! If they enter your code upon
                signing up, gain points and exclusive badges!
              </h4>
              <h3 className="referral-title">Your Referral Code:</h3>

              <p className="referral-code">{userData.referralCode}</p>
              <button onClick={copyReferralLink} className="btn-referral">
                Copy Referral Link
              </button>
            </div>
          )}

          {/* Followers count section */}
          {/* {isDeveloper && (
            <div className="followers-count">
              <h3>Followers</h3>
              <p>{followersCount} users following your developer profile</p>
            </div>
          )}

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
          </div> */}

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
                {userData.badges && userData.badges.length > 0 ? (
                  userData.badges.map((badge) => (
                    <div key={badge.id} className="badge-card">
                      <img
                        src={badge.icon}
                        alt={badge.name}
                        className="badge-icon"
                      />
                      <p className="badge-name">{badge.name}</p>
                      <p className="badge-name">{badge.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-badges">No badges earned yet.</p>
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
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default Profile;
