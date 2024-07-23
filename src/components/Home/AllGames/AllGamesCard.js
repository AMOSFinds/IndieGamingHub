import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase-config";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import "./AllGames.css";
import CustomAlert from "../../CustomAlert";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AllGamesCard({ allgame }) {
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingCounts, setRatingCounts] = useState({
    veryGood: 0,
    good: 0,
    decent: 0,
    bad: 0,
  });
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  // const user = auth.currentUser;

  const addToFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userFavoritesRef = doc(
          db,
          `users/${user.uid}/favorites`,
          allgame.id.toString()
        );
        await setDoc(userFavoritesRef, { ...allgame, userId: user.uid });
        setAlertMessage("Added to favorites!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        setAlertMessage("You need to be signed in to add favorites.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000); // Hide alert after 3 seconds
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setAlertMessage("Error adding to favorites.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  useEffect(() => {
    const fetchUserRating = async (user) => {
      const ratingDoc = await getDoc(
        doc(db, `users/${user.uid}/ratings`, allgame.id.toString())
      );
      if (ratingDoc.exists()) {
        setUserRating(ratingDoc.data().rating);
      }
    };

    const fetchRatingCounts = async () => {
      const gameDoc = await getDoc(doc(db, "games", allgame.id.toString()));
      if (gameDoc.exists()) {
        setRatingCounts(
          gameDoc.data().ratings || {
            veryGood: 0,
            good: 0,
            decent: 0,
            bad: 0,
          }
        );
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRating(currentUser);
      }
      setLoading(false);
    });

    fetchRatingCounts();

    return () => unsubscribe();
  }, [allgame.id]);

  const handleRating = async (rating) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRatingsRef = doc(
          db,
          `users/${user.uid}/ratings`,
          allgame.id.toString()
        );

        const gameRef = doc(db, "games", allgame.id.toString());
        const gameDoc = await getDoc(gameRef);

        // If the game document does not exist, create it
        if (!gameDoc.exists()) {
          await setDoc(gameRef, {
            ratings: {
              veryGood: 0,
              good: 0,
              decent: 0,
              bad: 0,
            },
          });
        }

        // Undo previous rating if it exists
        if (userRating) {
          await updateDoc(gameRef, {
            [`ratings.${userRating.toLowerCase().replace(" ", "")}`]:
              increment(-1),
          });
        }

        // Set or undo the new rating
        const newRating = userRating === rating ? null : rating;
        setUserRating(newRating);

        if (newRating) {
          await setDoc(userRatingsRef, { rating: newRating }, { merge: true });
          await updateDoc(gameRef, {
            [`ratings.${newRating.toLowerCase().replace(" ", "")}`]:
              increment(1),
          });
        } else {
          await setDoc(userRatingsRef, { rating: newRating }, { merge: true });
        }

        // Fetch updated rating counts
        const updatedGameDoc = await getDoc(gameRef);
        if (updatedGameDoc.exists()) {
          setRatingCounts(updatedGameDoc.data().ratings);
        }
      } else {
        setAlertMessage("You need to be signed in to rate games.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000); // Hide alert after 3 seconds
      }
    } catch (error) {
      console.error("Error rating game:", error);
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
        <button className="btn-favorite" onClick={addToFavorites}>
          Add to Favorites
        </button>
        <div className="rating-system">
          {["Very Good", "Good", "Decent", "Bad"].map((rating) => (
            <button
              key={rating}
              className={`rating-button ${
                userRating === rating ? "selected" : ""
              }`}
              onClick={() => handleRating(rating)}
            >
              {rating.replace(/([A-Z])/g, " $1").trim()} (
              {ratingCounts[rating.toLowerCase().replace(" ", "")] || 0})
            </button>
          ))}
        </div>
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

export default AllGamesCard;
