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

const GameDetails = () => {
  const { gameId } = useParams(); // Get game ID from URL
  // const game = allgames.find((g) => g.id === gameId); // Find the selected game
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Optimistically update local state
        const previousRating = userRating;
        const newRating = userRating === rating ? null : rating;

        setUserRating(newRating);
        setRatingCounts((prevCounts) => {
          const updatedCounts = { ...prevCounts };

          if (previousRating) {
            const previousKey = previousRating.toLowerCase().replace(" ", "");
            if (updatedCounts[previousKey] > 0) {
              updatedCounts[previousKey] -= 1;
            }
          }

          if (newRating) {
            const newKey = newRating.toLowerCase().replace(" ", "");
            updatedCounts[newKey] = (updatedCounts[newKey] || 0) + 1;
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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const reviewData = {
          username: userDoc.data().username,
          profilePicUrl: userDoc.data().profilePicUrl,
          comment: newReview,
          userId: user.uid,
          timestamp: new Date(),
        };

        await addDoc(collection(db, "games", gameId, "reviews"), reviewData);
        setNewReview("");
      }
    } catch (error) {
      console.error("Error adding review:", error);
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

  // useEffect(() => {

  // }, [gameId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!game) {
    return <div className="error-message">Game not found!</div>;
  }

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
          {["Very Good", "Good", "Decent", "Bad"].map((rating) => (
            <button
              key={rating}
              className={`rating-button ${
                userRating === rating ? "selected" : ""
              }`}
              onClick={() => handleRating(rating)}
            >
              {rating} (
              {ratingCounts[rating.toLowerCase().replace(" ", "")] || 0})
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
    </div>
  );
};

export default GameDetails;
