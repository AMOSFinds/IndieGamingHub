import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  where,
  getDocs,
  updateDoc,
  increment,
  query,
  collection,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";
import { FaUpload } from "react-icons/fa";
import LoadingIndicator from "../LoadingIndicator";
import { v4 as uuidv4 } from "uuid";

function SignUp() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const storage = getStorage();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profilePicUrl = "";

      if (profilePicture) {
        // Upload the selected profile picture
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(profilePicRef, profilePicture);
        profilePicUrl = await getDownloadURL(profilePicRef);
      } else {
        // Generate a default profile picture with the first letter of the username
        profilePicUrl = `https://ui-avatars.com/api/?name=${username.charAt(
          0
        )}&background=random&color=ffffff&bold=true`;
      }

      const referralCode = uuidv4().slice(0, 6).toUpperCase(); // Generate a 6-character code
      const referredBy = null; // Referral code entered by the new user

      await updateProfile(user, {
        displayName: username,
        photoURL: profilePicUrl,
      });

      // Save user info to database
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        profilePicUrl,
        points: 0, // Initialize points
        badges: [], // Initialize badges
        referralCode,
        referredBy,
        referralCount: 0,
      });

      if (referredBy) {
        // Update referrer's referral count and points
        const referrerQuery = query(
          collection(db, "users"),
          where("referralCode", "==", referredBy)
        );
        const referrerSnapshot = await getDocs(referrerQuery);

        if (!referrerSnapshot.empty) {
          const referrerDoc = referrerSnapshot.docs[0];
          const referrerRef = referrerDoc.ref;

          await updateDoc(referrerRef, {
            referralCount: increment(1),
            points: increment(100), // Reward points for referrer
          });

          // Optional: Send notification to referrer
          // await addDoc(collection(db, "users", referrerDoc.id, "notifications"), {
          //   message: `You earned 100 points for referring ${username}!`,
          //   timestamp: serverTimestamp(),
          //   hasUnread: true,
          // });
        }
      }

      setAlertMessage("Account created successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
        navigate("/"); // Redirect to home page
      }, 3000);
    } catch (error) {
      console.error("Error signing up: ", error);
      setAlertMessage("Failed to sign up");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div className="signin-container">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label className="profile-title">Profile Picture:</label>
            <label htmlFor="file-upload" className="custom-file-upload">
              <FaUpload /> Choose Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="file-input"
            />
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="signin-input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="signin-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="signin-input"
          />

          <button type="submit" className="signin-button">
            Sign Up
          </button>
        </form>
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

export default SignUp;
