import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { FaUpload } from "react-icons/fa";
import CustomAlert from "../../CustomAlert";
import LoadingIndicator from "../../LoadingIndicator";
import { useNavigate } from "react-router-dom";
import "./DevProfileForm.css";

function DevProfileForm() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [games, setGames] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [job, setJob] = useState("");

  const navigate = useNavigate();
  const bioWordLimit = 100;

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBioChange = (e) => {
    const words = e.target.value.split(/\s+/);
    if (words.length <= bioWordLimit) {
      setBio(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();
    const storage = getStorage();

    if (user) {
      let profileImageUrl = "";

      if (image) {
        // Upload the selected profile image to Firebase Storage
        const storageRef = ref(
          storage,
          `profileImages/${user.uid}/${image.name}`
        );
        await uploadBytes(storageRef, image);
        profileImageUrl = await getDownloadURL(storageRef);
        setImageUrl(profileImageUrl);
      } else {
        // Generate a default profile picture URL using initials from the developer's name
        const initials = name
          .split(" ")
          .map((word) => word[0])
          .join("");
        profileImageUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=ffffff&bold=true`;
      }

      // Normalize game titles
      const normalizedGames = games
        .split(",")
        .map((game) => game.trim().toLowerCase()) // Trim and convert to lowercase
        .join(","); // Join back to string for storage

      // Save games as an array
      const gamesArray = games.split(",").map((game) => game.trim());

      const userRef = doc(db, `developers/${user.uid}`);
      await setDoc(
        userRef,
        {
          name,
          job,
          bio,
          website,
          twitter,
          linkedin,
          games: gamesArray,
          profilePicUrl: profileImageUrl,
          userId: user.uid,
        },
        { merge: true }
      );

      setAlertMessage("Profile updated successfully!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
        navigate("/all-devs"); // Navigate to AllDevs page
      }, 3000); // Hide alert after 3 seconds
    } else {
      setAlertMessage("You need to be signed in to update your profile.");
      setShowAlert(true);
      setLoading(false);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  return (
    <div className="signin-container">
      {loading ? (
        <LoadingIndicator />
      ) : (
        <form onSubmit={handleSubmit} className="signin-form">
          <h1 className="create-title">Create Developer Profile</h1>
          <div className="form-group">
            <label className="profile-title">Profile Image:</label>
            <label htmlFor="file-upload" className="custom-file-upload">
              <FaUpload /> Choose Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="signin-input"
          />
          <input
            type="text"
            placeholder="Job Title (e.g., Software Engineer)"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="signin-input"
          />
          <textarea
            placeholder="Bio (Max 100 words)"
            value={bio}
            onChange={handleBioChange}
            required
            className="signin-input"
          />
          <input
            type="text"
            placeholder="Games (comma separated)"
            value={games}
            onChange={(e) => setGames(e.target.value)}
            required
            className="signin-input"
          />
          <small style={{ color: "#888899", fontSize: "14px" }}>
            Enter game titles, separated by commas.
          </small>
          <input
            type="url"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="signin-input"
          />
          <input
            type="url"
            placeholder="X Profile URL"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="signin-input"
          />
          <input
            type="url"
            placeholder="LinkedIn Profile URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="signin-input"
          />
          <button type="submit" className="signin-button">
            Submit
          </button>
        </form>
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default DevProfileForm;
