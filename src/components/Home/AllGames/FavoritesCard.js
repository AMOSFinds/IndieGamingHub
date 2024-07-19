import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase-config";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import "./Favorites.css";
import CustomAlert from "../../CustomAlert";

function FavoritesCard({ allgame, onRemove }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [isRated, setIsRated] = useState(false);

  // const addToFavorites = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     if (user) {
  //       const userFavoritesRef = doc(
  //         db,
  //         `users/${user.uid}/favorites`,
  //         allgame.id.toString()
  //       );
  //       await setDoc(userFavoritesRef, { ...allgame, userId: user.uid });
  //       alert("Added to favorites!");
  //     } else {
  //       alert("You need to be signed in to add favorites.");
  //     }
  //   } catch (error) {
  //     console.error("Error adding to favorites:", error);
  //   }
  // };

  const removeFromFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userFavoritesRef = doc(
          db,
          `users/${user.uid}/favorites`,
          allgame.id.toString()
        );
        await deleteDoc(userFavoritesRef);
        onRemove(allgame.id); // Notify parent component to remove this game from state
        setAlertMessage("Removed from favorites!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000); // Hide alert after 3 seconds
      } else {
        setAlertMessage("You need to be signed in to remove favorites.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000); // Hide alert after 3 seconds
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setAlertMessage("Error removing from favorites.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  return (
    <div className="game-entry">
      <img src={allgame.imageUrl} alt={allgame.title} className="game-image" />
      <div className="game-info">
        <h3 className="game-title">{allgame.title}</h3>
        <p className="game-developer">{allgame.developer}</p>
        <p className="game-description">{allgame.description}</p>
        <ul className="game-details">
          <li>{allgame.genre}</li>
          <li>{allgame.release}</li>
          <li>{allgame.platform}</li>
        </ul>
        <button className="btn-favorite" onClick={removeFromFavorites}>
          Remove from Favorites
        </button>
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default FavoritesCard;
