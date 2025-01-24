import React from "react";
import pattern from "../pattern.svg"; // Adjust the path to your file

const BackgroundPattern = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#002147",
      }}
    >
      <img
        src={pattern}
        alt="Circuit Board Pattern"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default BackgroundPattern;
