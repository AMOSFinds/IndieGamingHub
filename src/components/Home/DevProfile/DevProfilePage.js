import React from "react";
import { Link } from "react-router-dom";

function DevProfilePage() {
  return (
    <div className="showcase-page">
      <div>
        <h1 className="tagline">Meet the Minds Behind the Games</h1>
        <p className="description">
          Go behind the scenes and connect with the creators with DevIndie's
          Developer Profiles. Each profile showcases the studio's history, game
          portfolio, and the passionate individuals behind the pixels. Learn
          about their creative processes, developmental challenges, and success
          stories. Supporting indie developers is more than just playing their
          games—it's about connecting with their stories and supporting their
          dreams.
        </p>
        <Link to="/devprofile-form">
          <button className="createprofile-btn">Create Dev Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default DevProfilePage;
