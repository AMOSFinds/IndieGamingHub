import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { useAuth } from "../Authentication/AuthContext";
import "./NavHeader.css";
import { FaBars, FaTimes } from "react-icons/fa";

export default function NavHeader() {
  const { currentUser, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show loading spinner
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Truncate email for mobile
  const truncateEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length > 10) {
      return `${name.slice(0, 1)}.${name.slice(-1)}@${domain}`;
    }
    return email;
  };

  return (
    <header className="header">
      <nav>
        <h1>Devindie</h1>
        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="nav-menu">
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            {/* Removed Dashboard link for beta, as discussed */}
          </ul>
          {currentUser ? (
            <div className={`user-actions ${isMenuOpen ? "active" : ""}`}>
              <span className="user-email">
                {truncateEmail(currentUser.email)}
              </span>
              <button
                className="navheader-container"
                onClick={() => {
                  auth.signOut();
                  setIsMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li>
                <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
