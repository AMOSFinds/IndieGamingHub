import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { useAuth } from "../Authentication/AuthContext";
import "./NavHeader.css";

export default function NavHeader() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional: Show loading spinner
  }

  return (
    <header className="header">
      <nav>
        <h1>Devindie</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {/* <li>
            <Link to="/dashboard">Dashboard</Link>
          </li> */}
          {currentUser ? (
            <li>
              Logged in as {currentUser.email}
              <button
                className="navheader-container"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
