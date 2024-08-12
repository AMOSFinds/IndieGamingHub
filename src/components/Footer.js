import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Make sure to create and style this CSS file

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2024 DevIndie. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          {/* <Link to="/contact" className="footer-link">
            Contact Us
          </Link> */}
        </div>
        <div className="footer-social">
          <a
            href="https://x.com/forIndieDevs"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Social Media
          </a>
          {/* <a
            href="https://facebook.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Facebook
          </a> */}
          {/* Add more social media links as needed */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
