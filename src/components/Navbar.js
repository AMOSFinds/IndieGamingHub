import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "./Authentication/AuthContext";
import SignOut from "./Authentication/SignOut";
import SignInButton from "./Authentication/SignInButton";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { currentUser } = useAuth();
  const navRef = useRef();
  const [username, setUsername] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  };

  useEffect(() => {
    const fetchUserUsername = async (user) => {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username);
      }
    };

    const checkForUnreadNotifications = async (user) => {
      const db = getFirestore();
      const notificationsRef = collection(
        db,
        "users",
        user.uid,
        "notifications"
      );
      const q = query(notificationsRef, where("hasUnread", "==", true));
      const querySnapshot = await getDocs(q);

      setHasUnreadNotifications(!querySnapshot.empty);
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserUsername(user);
        checkForUnreadNotifications(user);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          DevIndie
        </Link>
      </div>

      <nav className="navbar-center">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/all-devs" className="navbar-link">
          Developers
        </Link>
        <Link to="/contact" className="navbar-link">
          Feedback
        </Link>
        <Link to="/leaderboard" className="navbar-link">
          Leaderboard
        </Link>
      </nav>

      <div className="navbar-right">
        {currentUser ? (
          <div className="navbar-user">
            <Link to="/profile" className="navbar-link highlight">
              {username}
            </Link>
            <SignOut />
          </div>
        ) : (
          <SignInButton />
        )}
        {/* <button className="navbar-button">Contact us</button> */}
      </div>
    </div>
  );
}

export default Navbar;
