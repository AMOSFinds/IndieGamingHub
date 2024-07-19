import React, { useState } from "react";
import "./Slideshow.css";
import { Link } from "react-router-dom";

const Slideshow = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + games.length) % games.length);
  };

  return (
    <div className="slideshow-container">
      <img
        src={games[currentIndex].imageUrl}
        alt={games[currentIndex].title}
        className="slideshow-image"
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
        }}
      >
        <span
          className="slideshow-arrow"
          style={{
            position: "absolute",
            left: "-100px",
            cursor: "pointer",
            fontSize: "50px",
          }}
          onClick={prevSlide}
        >
          &#10094;
        </span>
        <span
          className="slideshow-arrow"
          style={{
            position: "absolute",
            right: "-100px",
            cursor: "pointer",
            fontSize: "50px",
          }}
          onClick={nextSlide}
        >
          &#10095;
        </span>
      </div>
      <div className="slideshow-info">
        <h3>{games[currentIndex].title}</h3>
        <p>{games[currentIndex].description}</p>
      </div>
    </div>
  );
};

export default Slideshow;
