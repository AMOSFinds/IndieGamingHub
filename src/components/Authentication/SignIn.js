import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  updateDoc,
  doc,
  increment,
  getDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";
import LoadingIndicator from "../LoadingIndicator";
import { BADGES } from "../Home/Badges";
import "./SignIn.css";

function SignIn() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  /**
   * Award a badge to a user if they haven't already received it.
   * @param {DocumentReference} userDocRef - Firestore document reference for the user.
   * @param {Object} badge - Badge object with properties: id, name, description, icon.
   */
  const awardBadge = async (userDocRef, badge) => {
    const userDocSnap = await getDoc(userDocRef);
    const currentBadges = userDocSnap.data()?.badges || [];
    const alreadyAwarded = currentBadges.some((b) => b.id === badge.id);
    if (!alreadyAwarded) {
      const updatedBadges = [...currentBadges, badge];
      await updateDoc(userDocRef, { badges: updatedBadges });
    }
  };

  const checkDailyStreak = async (userDocRef, now, today) => {
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data() || {};
    const lastLogin = userData.lastLoginDate || null;
    let currentStreak = userData.loginStreak || 0;

    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin.seconds * 1000);
      // Calculate yesterday's date based on 'today'
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Check if last login was yesterday
      if (
        lastLoginDate.getFullYear() === yesterday.getFullYear() &&
        lastLoginDate.getMonth() === yesterday.getMonth() &&
        lastLoginDate.getDate() === yesterday.getDate()
      ) {
        // Continue the streak
        currentStreak += 1;
      } else if (
        lastLoginDate.getFullYear() === today.getFullYear() &&
        lastLoginDate.getMonth() === today.getMonth() &&
        lastLoginDate.getDate() === today.getDate()
      ) {
        // Already logged in today; do nothing extra.
      } else {
        // Streak broken; reset to 1 (today is the new start)
        currentStreak = 1;
      }
    } else {
      // First time login
      currentStreak = 1;
    }

    // Update user document with the new streak and the current login timestamp
    await updateDoc(userDocRef, {
      loginStreak: currentStreak,
      lastLoginDate: now,
    });

    return currentStreak;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Today's date without time

      // Check if the user has already earned points today
      if (userDoc.exists()) {
        const lastSignIn = userDoc.data().lastSignInPoints || null;
        const lastSignInDate = lastSignIn
          ? new Date(lastSignIn.seconds * 1000)
          : null;

        if (!lastSignInDate || lastSignInDate < today) {
          // Award points if this is the first login of the day
          await updateDoc(userRef, {
            points: increment(10), // Award points
            lastSignInPoints: now, // Update last points date
          });

          setAlertMessage("Signed in successfully. ");
        } else {
          setAlertMessage("Welcome back! ");
        }
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
        navigate("/"); // Redirect to home page
      }, 3000);
    } catch (error) {
      console.error("Error signing in: ", error);
      setAlertMessage("Failed to sign in");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  return (
    <div className="auth-form">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          {alertMessage && <p className="error">{alertMessage}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Sign In</button>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      )}
      {showAlert && (
        <div className="alert">
          {alertMessage}
          <button onClick={() => setShowAlert(false)}>OK</button>
        </div>
      )}
    </div>
  );
}

export default SignIn;
