import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header-container">
      <div className="header-overlay">
        <h1 className="header-title">Discover Hidden Gems in Indie Gaming</h1>
        <p className="header-subtitle">
          Explore curated collections of the most creative and unique indie
          games. Start your adventure now!
        </p>
        <div className="header-buttons">
          <a href="#game-discovery-section" className="explore-now-button">
            Explore Now
          </a>
          {/* <a href="#about-section" className="learn-more-button"> */}
          <Link to="/signin" className="learn-more-button">
            Join the community
          </Link>

          {/* </a> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
