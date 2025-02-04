import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import allgames from "../AllGames/AllGameData"; // Import game data
import archives from "../AllGames/ArchiveData";
import "./GameDetails.css";
import { db, auth } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import LoadingIndicator from "../../LoadingIndicator";
import CustomAlert from "../../CustomAlert";
import { BADGES } from "../Badges";

const GameDetails = (allgame) => {
  const { gameId } = useParams(); // Get game ID from URL
  // const game = allgames.find((g) => g.id === gameId); // Find the selected game
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [userRating, setUserRating] = useState(null);
  const [ratingCounts, setRatingCounts] = useState({
    verygood: 0,
    good: 0,
    decent: 0,
    bad: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [user, setUser] = useState(null);

  /**
   * Award a badge to a user if they haven't already received it.
   * @param {DocumentReference} userDocRef - Firestore document reference for the user.
   * @param {Object} badge - Badge object with properties: id, name, description, icon.
   */
  const awardBadge = async (userDocRef, badge) => {
    const userDocSnap = await getDoc(userDocRef);
    const currentBadges = userDocSnap.data()?.badges || [];
    const alreadyAwarded = currentBadges.some((b) => b.id === badge.id);
    if (!alreadyAwarded) {
      const updatedBadges = [...currentBadges, badge];
      await updateDoc(userDocRef, { badges: updatedBadges });
    }
  };

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Step 1: Get static data from AllGameData
        const staticGameData =
          allgames.find((game) => game.id.toString() === gameId) ||
          archives.find((game) => game.id.toString() === gameId);

        if (!staticGameData) {
          throw new Error("Game not found in AllGameData");
        }

        // Step 2: Fetch dynamic data from Firebase
        const gameDoc = await getDoc(doc(db, "games", gameId));
        const firebaseGameData = gameDoc.exists()
          ? gameDoc.data()
          : { ratings: {}, reviews: [] };

        // Step 3: Combine static and dynamic data
        const combinedGameData = {
          ...staticGameData, // Static data
          ...firebaseGameData, // Dynamic data
        };

        setGame(combinedGameData);

        // Step 4: Fetch reviews
        const reviewsRef = collection(db, "games", gameId, "reviews");
        const reviewsQuery = query(reviewsRef, orderBy("timestamp", "desc"));
        onSnapshot(reviewsQuery, (snapshot) => {
          const reviewsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviewsList);
        });

        // Step 5: Fetch ratings
        setRatingCounts(combinedGameData.ratings || {});

        if (auth.currentUser) {
          const userRatingsRef = doc(
            db,
            "users",
            auth.currentUser.uid,
            "ratings",
            gameId
          );
          const userRatingDoc = await getDoc(userRatingsRef);
          if (userRatingDoc.exists()) {
            setUserRating(userRatingDoc.data().rating);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if authenticated
      } else {
        setUser(null); // Reset user to null if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleRating = async (rating) => {
    try {
      if (user) {
        const userRatingsRef = doc(db, "users", user.uid, "ratings", gameId);
        const gameRef = doc(db, "games", gameId);
        const ratingsCountForUser = userRatingsRef.ratingCounts || 0;

        // Optimistically update local state
        const previousRating = userRating;
        const newRating = userRating === rating ? null : rating;

        setUserRating(newRating);
        setRatingCounts((prevCounts) => {
          const updatedCounts = { ...prevCounts };

          if (previousRating) {
            const previousKey = previousRating.toLowerCase().replace(" ", "");
            if (updatedCounts[previousKey] > 0) {
              updatedCounts[previousKey] =
                Number(updatedCounts[previousKey] || 0) - 1;
            }
          }

          if (newRating) {
            const newKey = newRating.toLowerCase().replace(" ", "");
            updatedCounts[newKey] = Number(updatedCounts[newKey] || 0) + 1;
          }

          return updatedCounts;
        });

        // Firestore operations
        const gameDoc = await getDoc(gameRef);

        // Decrement previous rating in Firestore
        if (previousRating) {
          const previousKey = previousRating.toLowerCase().replace(" ", "");
          if (gameDoc.data()?.ratings?.[previousKey] > 0) {
            await updateDoc(gameRef, {
              [`ratings.${previousKey}`]: increment(-1),
            });
          }
        }

        // Increment new rating in Firestore
        if (newRating) {
          const newKey = newRating.toLowerCase().replace(" ", "");
          await updateDoc(gameRef, {
            [`ratings.${newKey}`]: increment(1),
          });
          await setDoc(userRatingsRef, { rating: newRating }, { merge: true });
        } else {
          // Delete user's rating if unselected
          await deleteDoc(userRatingsRef);
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

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

          if (!previousRating && newRating) {
            await updateDoc(userDocRef, {
              ratingsCount: increment(1),
            });
          }

          // Award the "First Rating" badge if this is the first rating
          await awardBadge(userDocRef, BADGES.FIRST_RATING);
          // Optionally, if you track number of ratings, check if ratingsCount reaches 10:
          if (ratingsCountForUser >= 10) {
            // You need to track this value
            await awardBadge(userDocRef, BADGES.ACTIVE_GAMER);
          }

          setAlertMessage("Rating submitted! You've earned 5 points.");
        } else {
          setAlertMessage(
            "Rating submitted, but no points awarded (daily limit reached)."
          );
        }
      }
    } catch (error) {
      console.error("Error rating game:", error);

      // Roll back optimistic update if an error occurs
      setUserRating((prev) => prev); // Restore previous state
    }
  };

  const handleAddReview = async () => {
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const currentReviewsCount = userDocSnap.data()?.reviewsCount || 0;

        if (!userDocSnap.exists()) {
          throw new Error("User document not found");
        }

        const userData = userDocSnap.data();

        const reviewData = {
          username: userData.username,
          profilePicUrl: userData.profilePicUrl,
          comment: newReview,
          userId: user.uid,
          timestamp: new Date(),
        };

        // Add the review once to the reviews subcollection of the game
        await addDoc(collection(db, "games", gameId, "reviews"), reviewData);

        // Set up date checks for awarding points
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const lastReviewPoints = userData.lastReviewPoints || null;
        const lastReviewDate = lastReviewPoints
          ? new Date(lastReviewPoints.seconds * 1000)
          : null;

        if (!lastReviewDate || lastReviewDate < today) {
          await updateDoc(userDocRef, {
            points: increment(10), // Award points for writing a review
            lastReviewPoints: now, // Update timestamp
          });

          // Increment reviewsCount in the user document
          await updateDoc(userDocRef, {
            reviewsCount: increment(1),
          });

          // Award "First Review" badge
          await awardBadge(userDocRef, BADGES.FIRST_REVIEW);
          // Check if reviewsCount is now 5 for "Reviewer Novice"
          if (currentReviewsCount + 1 >= 5) {
            // Assume you track currentReviewsCount from userData.reviewsCount
            await awardBadge(userDocRef, BADGES.REVIEWER_NOVICE);
          }
          // Similarly, if reviewsCount reaches 10, award "Reviewer Extraordinaire"
          if (currentReviewsCount + 1 >= 10) {
            await awardBadge(userDocRef, BADGES.REVIEWER_EXTRAORDINAIRE);
          }
          setAlertMessage("Review added! You've earned 10 points.");
        } else {
          setAlertMessage(
            "Review added, but no points awarded (daily limit reached)."
          );
        }

        setNewReview("");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setAlertMessage("You need to be signed in to add a review.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setAlertMessage("Error adding review.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const reviewRef = doc(db, "games", gameId, "reviews", reviewId);
      await deleteDoc(reviewRef);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
      console.log("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const addToFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Use 'game' (or whatever your game state variable is) instead of 'allgame'
        if (!game || !game.id) {
          throw new Error("Game data is not available.");
        }

        const userFavoritesRef = doc(
          db,
          `users/${user.uid}/favorites`,
          game.id.toString()
        );

        await setDoc(userFavoritesRef, { ...game, userId: user.uid });
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
            doc(db, `users/${user.uid}/favorites`, game.id.toString()),
            { ...game, userId: user.uid }
          );

          await updateDoc(userRef, {
            points: increment(3), // Award points for adding a favorite
            lastFavoritePoints: now, // Update timestamp
          });

          // Award the "First Favorite" badge
          await awardBadge(userRef, BADGES.FIRST_FAVORITE);

          setAlertMessage(
            "Added to favorites! You've earned 3 points. Check your Profile!"
          );
        } else {
          setAlertMessage(
            "Added to favorites, but no points awarded (daily limit reached). Check your Profile!"
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
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setAlertMessage("Error adding to favorites.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  // useEffect(() => {

  // }, [gameId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!game) {
    return <div className="error-message">Game not found!</div>;
  }

  const starRatings = [
    { label: "★★★★★", value: "Very Good" },
    { label: "★★★★", value: "Good" },
    { label: "★★★", value: "Decent" },
    { label: "★★", value: "Bad" },
  ];

  return (
    <div className="game-detail-container">
      {/* Hero Section */}
      <div
        className="game-banner"
        style={{
          backgroundImage: `url(${game.bannerImage || game.imageUrl})`,
        }}
      ></div>
      <h1 className="game-title">{game.title}</h1>

      {/* Main Game Details */}
      <div className="game-info-section">
        <h2 className="section-heading">Why We Love It</h2>
        <p className="game-description">
          {game.description || "A hidden indie gem that stands out!"}
        </p>

        <button className="btn-favorite" onClick={addToFavorites}>
          Add to Favorites
        </button>

        {/* Game Stats Section */}
        <div className="game-stats">
          <span className="game-genre">🎮 {game.genre}</span>
          <span className="release-date">🗓️ {game.release || "Unknown"}</span>
        </div>

        {/* Platform Icons */}
        <div className="platform-icons">
          {(Array.isArray(game.platform) ? game.platform : [game.platform]).map(
            (platform, index) => (
              <span key={index} className="platform-text">
                {platform}
              </span>
            )
          )}
        </div>

        {/* Screenshots Section */}
        <div className="game-screenshots">
          <h3 className="section-heading">Screenshots</h3>
          <div className="screenshot-gallery">
            {game.screenshots && game.screenshots.length ? (
              game.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  className="screenshot"
                />
              ))
            ) : (
              <p>No screenshots available</p>
            )}
          </div>
        </div>

        {/* YouTube Video Review Section */}
        {game.youtubeReview && (
          <div className="youtube-review">
            <h3 className="section-heading">🎥 Video Review</h3>
            <iframe
              width="60%"
              height="400"
              src={`https://www.youtube.com/embed/${game.youtubeReview}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            {game.reviewer && (
              <p className="review-credit">Review by {game.reviewer}</p>
            )}
          </div>
        )}

        {/* Ratings Section */}
        <div className="rating-system">
          <h3>Rate this Game:</h3>
          {starRatings.map((star) => (
            <button
              key={star.value}
              className={`rating-button ${
                userRating === star.value ? "selected" : ""
              }`}
              onClick={() => handleRating(star.value)}
            >
              {star.label} (
              {ratingCounts[star.value.toLowerCase().replace(" ", "")] || 0})
            </button>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="review-section">
          <h3>Reviews:</h3>
          {user && (
            <div className="add-review">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                className="review-textarea"
              ></textarea>
              <button onClick={handleAddReview}>Add Review</button>
            </div>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="review-entry">
              <img
                src={review.profilePicUrl}
                alt="Profile"
                className="review-profile-pic"
              />
              <p className="review-talks">
                <strong>{review.username}</strong>: {review.comment}
              </p>
              {user?.uid === review.userId && ( // Show delete button only for the review author
                <button
                  className="delete-review-button"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="game-cta">
          <a
            href={game.playLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="play-button"
          >
            Play Now
          </a>
          <Link to="/#game-discovery-section" className="back-button">
            Back to All Games
          </Link>
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
};

export default GameDetails;
