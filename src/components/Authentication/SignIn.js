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

function SignIn() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

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

          setAlertMessage(
            "Signed in successfully. You've earned 10 points for logging in!"
          );
        } else {
          setAlertMessage(
            "Welcome back! Points can only be earned once per day."
          );
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
    <div className="signin-container">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <form onSubmit={handleSubmit} className="signin-form">
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
            Sign In
          </button>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
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

export default SignIn;
