import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase-config";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./AllGames.css";
import { FaEllipsisV } from "react-icons/fa";
import CustomAlert from "../../CustomAlert";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AllGamesCard({ allgame }) {
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingCounts, setRatingCounts] = useState({
    verygood: 0,
    good: 0,
    decent: 0,
    bad: 0,
  });
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [showDeleteOptions, setShowDeleteOptions] = useState({}); // Track delete menu visibility

  const auth = getAuth();
  const db = getFirestore();
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
    const fetchReviews = () => {
      try {
        const reviewsRef = collection(
          db,
          "games",
          allgame.id.toString(),
          "reviews"
        );
        const q = query(reviewsRef, orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
          const reviewsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviewsList);
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchUserRating = async (user) => {
      try {
        const ratingDoc = await getDoc(
          doc(db, `users/${user.uid}/ratings`, allgame.id.toString())
        );
        if (ratingDoc.exists()) {
          setUserRating(ratingDoc.data().rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    const fetchRatingCounts = async () => {
      try {
        const gameDoc = await getDoc(doc(db, "games", allgame.id.toString()));
        if (gameDoc.exists()) {
          setRatingCounts(
            gameDoc.data().ratings || {
              verygood: 0,
              good: 0,
              decent: 0,
              bad: 0,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching rating counts:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRating(currentUser);
      }
      setLoading(false);
    });

    fetchRatingCounts();
    fetchReviews();

    return () => unsubscribe();
  }, [allgame.id, db]);

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

        if (!gameDoc.exists()) {
          await setDoc(gameRef, {
            ratings: {
              verygood: 0,
              good: 0,
              decent: 0,
              bad: 0,
            },
          });
        }

        if (userRating) {
          await updateDoc(gameRef, {
            [`ratings.${userRating.toLowerCase().replace(" ", "")}`]:
              increment(-1),
          });
        }

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

  const handleAddReview = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const reviewData = {
          username: userDoc.data().username,
          profilePicUrl: userDoc.data().profilePicUrl,
          comment: newReview,
          timestamp: new Date(),
        };

        await addDoc(
          collection(db, "games", allgame.id.toString(), "reviews"),
          reviewData
        );
        setNewReview("");
      } else {
        setAlertMessage("You need to be signed in to add reviews.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(
          doc(db, "games", allgame.id.toString(), "reviews", reviewId)
        );
        setAlertMessage("Review deleted successfully.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
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
        <div className="game-content">
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
          <div className="review-section">
            {/* <h2 className="review-title">Reviews</h2> */}
            <div className="review-entries">
              <div className="add-review">
                {user && (
                  <img
                    src={user.photoURL || "default-profile-pic-url"}
                    alt="Profile"
                  />
                )}
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write a review..."
                ></textarea>
                <button onClick={handleAddReview}>Add Review</button>
              </div>
              {reviews.map((review, index) => (
                <div key={index} className="review-entry">
                  <img
                    src={review.profilePicUrl}
                    alt="Profile"
                    className="review-profile-pic"
                  />
                  <div className="review-content">
                    <p className="review-username">{review.username}</p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                  {user && review.username === user.displayName && (
                    <div className="review-options">
                      <FaEllipsisV
                        onClick={() =>
                          setShowDeleteOptions((prevState) => ({
                            ...prevState,
                            [review.id]: !prevState[review.id],
                          }))
                        }
                        className="three-dot-icon"
                      />
                      {showDeleteOptions[review.id] && (
                        <div
                          className="delete-option"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Delete
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
