import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaHeadset } from "react-icons/fa6";
import { useAuth } from "./Authentication/AuthContext";
import SignOut from "./Authentication/SignOut";
import SignInButton from "./Authentication/SignInButton";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const { currentUser } = useAuth();
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  };

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
        <Link to="/favorites" className="navbar-profile" onClick={closeNavbar}>
          Favorites
        </Link>
        <Link to="/all-devs" className="navbar-profile" onClick={closeNavbar}>
          Developers
        </Link>
        <Link to="/contact" className="navbar-profile" onClick={closeNavbar}>
          Contact Us
        </Link>
        {currentUser ? <SignOut /> : <SignInButton />}
      </nav>
      <Link to="/" className="navbar-logo">
        DevIndie
      </Link>
    </div>
  );
}

export default Navbar;
