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
  updateDoc,
  orderBy,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "./Authentication/AuthContext";
import SignOut from "./Authentication/SignOut";
import SignInButton from "./Authentication/SignInButton";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
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
      const q = query(notificationsRef, orderBy("timestamp", "desc")); // Fetch in descending order

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // console.log("Notifications snapshot size:", snapshot.size);
        // console.log("Fetched notifications:", fetchedNotifications);

        setNotifications(fetchedNotifications); // Set full list of notifications
        setHasUnreadNotifications(fetchedNotifications.some((n) => !n.read)); // Check if any are unread
      });

      // console.log("Fetched notifications and set state");

      return () => unsubscribe();
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

  const markNotificationsAsRead = async () => {
    if (currentUser && notifications.length > 0) {
      const db = getFirestore();

      notifications.forEach(async (notification) => {
        if (!notification.read) {
          const notificationRef = doc(
            db,
            "users",
            currentUser.uid,
            "notifications",
            notification.id
          );
          await updateDoc(notificationRef, { read: true });
        }
      });

      console.log("Marking notifications as read:", notifications);

      setHasUnreadNotifications(false); // Clear red bubble
    }
  };

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);

    console.log("Toggled notifications. Show:", showNotifications);

    if (!showNotifications && notifications.length > 0) {
      markNotificationsAsRead(); // Only mark as read when notifications exist
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          DevIndie
        </Link>
      </div>

      <div className="hamburger-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
      </div>

      <nav className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        {/* <Link
          to="/allgames"
          className="navbar-link"
          onClick={() => setMenuOpen(false)}
        >
          Games
        </Link>
        <Link
          to="/all-devs"
          className="navbar-link"
          onClick={() => setMenuOpen(false)}
        >
          Developers
        </Link> */}
        <Link
          to="/contact"
          className="navbar-link"
          onClick={() => setMenuOpen(false)}
        >
          Feedback
        </Link>
        {/* <Link
          to="/leaderboard"
          className="navbar-link"
          onClick={() => setMenuOpen(false)}
        >
          Leaderboard
        </Link> */}
      </nav>

      <div className="navbar-right">
        {/* <div className="notifications-container">
          <FaBell className="bell-icon" onClick={toggleNotifications} />
          {hasUnreadNotifications && <div className="notification-bubble" />}
          {showNotifications && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <p className="notification-timestamp">
                      {new Date(
                        notification.timestamp.seconds * 1000
                      ).toLocaleString()}{" "}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
            </div>
          )}
        </div> */}

        {currentUser ? (
          <div className="navbar-user">
            <Link
              to="/profile"
              className="navbar-link highlight"
              onClick={() => setMenuOpen(false)}
            >
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
