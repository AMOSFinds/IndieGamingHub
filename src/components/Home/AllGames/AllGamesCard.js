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
  serverTimestamp,
} from "firebase/firestore";
import "./AllGames.css";
import { FaEllipsisV } from "react-icons/fa";
import CustomAlert from "../../CustomAlert";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AllGamesCard({ allgame, layout = "details" }) {
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
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const lastFavoritePoints = userDoc.data()?.lastFavoritePoints || null;
        const lastFavoriteDate = lastFavoritePoints
          ? new Date(lastFavoritePoints.seconds * 1000)
          : null;

        if (!lastFavoriteDate || lastFavoriteDate < today) {
          await setDoc(
            doc(db, `users/${user.uid}/favorites`, allgame.id.toString()),
            {
              ...allgame,
              userId: user.uid,
            }
          );

          await updateDoc(userRef, {
            points: increment(3), // Award points for adding a favorite
            lastFavoritePoints: now, // Update timestamp
          });

          setAlertMessage("Added to favorites! You've earned 3 points.");
        } else {
          setAlertMessage(
            "Added to favorites, but no points awarded (daily limit reached)."
          );
        }
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
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...currentUser,
              profilePicUrl:
                userDoc.data().profilePicUrl || "default-profile-pic-url",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

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
        fetchUserData();
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

        const currentRatings = gameDoc.data()?.ratings || {
          verygood: 0,
          good: 0,
          decent: 0,
          bad: 0,
        };

        if (userRating) {
          const previousRatingKey = userRating.toLowerCase().replace(" ", "");
          if (currentRatings[previousRatingKey] > 0) {
            await updateDoc(gameRef, {
              [`ratings.${previousRatingKey}`]: increment(-1),
            });
          }
        }

        const newRating = userRating === rating ? null : rating;
        setUserRating(newRating);

        if (newRating) {
          const newRatingKey = newRating.toLowerCase().replace(" ", "");
          await updateDoc(gameRef, {
            [`ratings.${newRatingKey}`]: increment(1),
          });
          await setDoc(userRatingsRef, { rating: newRating }, { merge: true });
        } else {
          await deleteDoc(userRatingsRef); // Remove rating if unselected
        }

        const updatedGameDoc = await getDoc(gameRef);
        if (updatedGameDoc.exists()) {
          setRatingCounts(updatedGameDoc.data().ratings);
        }

        // Award points and update badges
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const badges = userDoc.data()?.badges || [];
        const hasFirstStepsBadge = badges.some(
          (badge) => badge.id === "first_steps"
        );

        if (!hasFirstStepsBadge) {
          badges.push({
            id: "first_steps",
            name: "First Steps",
            description: "Rated your first game!",
            icon: "/images/starbadge.png",
          });

          await updateDoc(userDocRef, { badges });
        }

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const lastRatingPoints = userDoc.data()?.lastRatingPoints || null;
        const lastRatingDate = lastRatingPoints
          ? new Date(lastRatingPoints.seconds * 1000)
          : null;

        if (!lastRatingDate || lastRatingDate < today) {
          await updateDoc(userDocRef, {
            points: increment(5), // Award points for rating a game
            lastRatingPoints: now, // Update timestamp
          });

          setAlertMessage("Rating submitted! You've earned 5 points.");
        } else {
          setAlertMessage(
            "Rating submitted, but no points awarded (daily limit reached)."
          );
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
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
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

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const lastReviewPoints = userDoc.data()?.lastReviewPoints || null;
        const lastReviewDate = lastReviewPoints
          ? new Date(lastReviewPoints.seconds * 1000)
          : null;

        if (!lastReviewDate || lastReviewDate < today) {
          await addDoc(
            collection(db, "games", allgame.id.toString(), "reviews"),
            {
              username: userDoc.data().username,
              profilePicUrl: userDoc.data().profilePicUrl,
              comment: newReview,
              timestamp: new Date(),
            }
          );

          await updateDoc(userDocRef, {
            points: increment(10), // Award points for writing a review
            lastReviewPoints: now, // Update timestamp
          });

          setAlertMessage("Review added! You've earned 10 points.");
        } else {
          setAlertMessage(
            "Review added, but no points awarded (daily limit reached)."
          );
        }

        const reviewsCount = userDoc.data().reviewsCount || 0;
        const badges = userDoc.data().badges || [];
        const hasReviewerBadge = badges.some(
          (badge) => badge.id === "reviewer_extraordinaire"
        );

        if (reviewsCount + 1 >= 5 && !hasReviewerBadge) {
          badges.push({
            id: "reviewer_extraordinaire",
            name: "Reviewer Extraordinaire",
            description: "Wrote 5 reviews!",
            icon: "/path-to-icons/torchbadge.png",
          });

          await updateDoc(userDocRef, { badges });
        }

        // Increment reviews count
        await updateDoc(userDocRef, {
          reviewsCount: increment(1),
        });

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

  const starRatings = [
    { label: "★★★★★", value: "Very Good", count: ratingCounts.verygood },
    { label: "★★★★", value: "Good", count: ratingCounts.good },
    { label: "★★★", value: "Decent", count: ratingCounts.decent },
    { label: "★★", value: "Bad", count: ratingCounts.bad },
  ];

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
            {starRatings.map((rating) => (
              <button
                key={rating.value}
                className={`rating-button ${
                  userRating === rating.value ? "selected" : ""
                }`}
                onClick={() => handleRating(rating.value)}
              >
                {rating.label} ({rating.count || 0})
              </button>
            ))}
          </div>
          <div className="review-section">
            {/* <h2 className="review-title">Reviews</h2> */}
            <div className="review-entries">
              <div className="add-review">
                {user && (
                  <img
                    src={user.profilePicUrl || "default-profile-pic-url"}
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
