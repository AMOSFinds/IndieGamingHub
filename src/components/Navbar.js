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
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
      <nav className="navbar" ref={navRef}>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
        <Link to="/" className="navbar-home" onClick={closeNavbar}>
          Home
        </Link>
        <Link to="/all-devs" className="navbar-profile" onClick={closeNavbar}>
          Developers
        </Link>
        <Link to="/contact" className="navbar-profile" onClick={closeNavbar}>
          Feedback
        </Link>
        {currentUser ? (
          <div className="navbar-user">
            <Link
              to="/profile"
              className={`navbar-profile ${
                hasUnreadNotifications ? "highlight" : ""
              }`}
              onClick={closeNavbar}
            >
              {username}
            </Link>
            <SignOut />
          </div>
        ) : (
          <SignInButton />
        )}
      </nav>
      <Link to="/" className="navbar-logo">
        DevIndie
      </Link>
    </div>
  );
}

export default Navbar;
