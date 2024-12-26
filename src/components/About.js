import React from "react";
import "./About.css";

const About = () => {
  return (
    <section id="about-section" className="about-section">
      <div className="about-content">
        <div className="about-images">
          <img
            src="./images/abou1.png"
            alt="Gaming Setup"
            className="about-image"
          />
          <img
            src="./images/abou2.png"
            alt="Excited Gamer"
            className="about-image"
          />
        </div>
        <div className="about-text">
          <h3 className="about-title">About Us</h3>
          <h2 className="about-heading">Welcome to DevIndie</h2>
          <p className="about-description">
            At DevIndie, we're dedicated to connecting gamers and developers in
            the indie gaming world. Our mission is to celebrate creativity,
            innovation, and passion by showcasing unique games that captivate
            players and inspire developers. Join us on this journey to
            experience the heart of indie gaming.
          </p>
          {/* <button className="about-button">Read More</button> */}
        </div>
      </div>
    </section>
  );
};

export default About;
