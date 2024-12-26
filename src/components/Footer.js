import React from "react";
import {
  FaDiscord,
  FaTwitch,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        {/* <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Email: info@example.com</li>
            <li>Phone: 123-456-7890</li>
            <li>Address: 123 Indie Lane, Game City</li>
          </ul>
        </div> */}

        {/* Navigation Links */}
        {/* <div className="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/all-devs">Developers</a>
            </li>
            <li>
              <a href="/contact">Feedback</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div> */}

        {/* Social Links */}
        {/* <div className="footer-column">
          <h4>Social</h4>
          <div className="footer-social-icons">
            <a href="https://discord.com">
              <FaDiscord />
            </a>
            <a href="https://twitch.tv">
              <FaTwitch />
            </a>
            <a href="https://facebook.com">
              <FaFacebook />
            </a>
            <a href="https://youtube.com">
              <FaYoutube />
            </a>
            <a href="https://twitter.com">
              <BsTwitterX />
            </a>
            <a href="https://linkedin.com">
              <FaLinkedin />
            </a>
          </div>
        </div> */}

        {/* Store Links */}
        {/* <div className="footer-column">
          <h4>Find Us On</h4>
          <div>
            <img
              src="/images/app-store.png"
              alt="App Store"
              style={{ width: "120px", margin: "0.5rem" }}
            />
            <img
              src="/images/google-play.png"
              alt="Google Play"
              style={{ width: "120px", margin: "0.5rem" }}
            />
          </div>
        </div> */}
      </div>

      <hr />

      {/* Footer Bottom Text */}
      <div className="footer-bottom">© 2025 DevIndie. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
