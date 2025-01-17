import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header-container">
      <div className="header-overlay">
        <h1 className="header-title">Discover Hidden Indie Gems</h1>
        <p className="header-subtitle">
          Curated weekly collections of the most unique indie games.
        </p>
        <div className="header-buttons">
          <a href="#game-discovery-section" className="explore-now-button">
            See This Week's Gems
          </a>
          <Link to="/signin" className="learn-more-button">
            Join the Community
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
