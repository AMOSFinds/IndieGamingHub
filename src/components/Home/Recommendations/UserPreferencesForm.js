import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

function UserPreferencesForm() {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [playstyle, setPlaystyle] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setGenres(
      genres.includes(value)
        ? genres.filter((genre) => genre !== value)
        : [...genres, value]
    );
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setPlatforms(
      platforms.includes(value)
        ? platforms.filter((platform) => platform !== value)
        : [...platforms, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, `users/${user.uid}`);
        await setDoc(
          userRef,
          {
            preferences: {
              genres,
              platforms,
              playstyle,
            },
          },
          { merge: true }
        );
        alert("Preferences saved!");
      } else {
        alert("You need to be signed in to save preferences.");
      }
    } catch (error) {
      console.error("Error saving preferences: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="preferences-form">
        <h2>Set Your Preferences</h2>

        <div className="form-group">
          <label>Favorite Genres:</label>
          <div className="checkbox-group">
            <input
              type="checkbox"
              value="Adventure"
              onChange={handleGenreChange}
            />{" "}
            Adventure
            <input
              type="checkbox"
              value="Puzzle"
              onChange={handleGenreChange}
            />{" "}
            Puzzle
            <input
              type="checkbox"
              value="Horror"
              onChange={handleGenreChange}
            />{" "}
            Horror
            <input
              type="checkbox"
              value="Simulation"
              onChange={handleGenreChange}
            />{" "}
            Simulation
          </div>
        </div>

        <div className="form-group">
          <label>Preferred Platforms:</label>
          <div className="checkbox-group">
            <input type="checkbox" value="PC" onChange={handlePlatformChange} />{" "}
            PC
            <input
              type="checkbox"
              value="Console"
              onChange={handlePlatformChange}
            />{" "}
            Console
            <input
              type="checkbox"
              value="Mobile"
              onChange={handlePlatformChange}
            />{" "}
            Mobile
          </div>
        </div>

        <div className="form-group">
          <label>Playstyle:</label>
          <div className="radio-group">
            <input
              type="radio"
              value="Casual"
              name="playstyle"
              onChange={(e) => setPlaystyle(e.target.value)}
            />{" "}
            Casual
            <input
              type="radio"
              value="Competitive"
              name="playstyle"
              onChange={(e) => setPlaystyle(e.target.value)}
            />{" "}
            Competitive
            <input
              type="radio"
              value="Story-driven"
              name="playstyle"
              onChange={(e) => setPlaystyle(e.target.value)}
            />{" "}
            Story-driven
          </div>
        </div>

        <button type="submit" className="submit-button">
          Save Preferences
        </button>
      </form>
      <Link to="/algorithm">
        <button type="button" className="recommended-btn">
          Recommended Games
        </button>
      </Link>
    </div>
  );
}

export default UserPreferencesForm;
