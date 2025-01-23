import { React, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import allgames from "../AllGames/AllGameData"; // Import game data
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
  increment,
} from "firebase/firestore";

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
        const staticGameData = allgames.find(
          (game) => game.id.toString() === gameId
        );

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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleRating = async (rating) => {
    try {
      if (user) {
        const userRatingsRef = doc(db, "users", user.uid, "ratings", gameId);

        const gameRef = doc(db, "games", gameId);
        const gameDoc = await getDoc(gameRef);

        const currentRatings = gameDoc.data()?.ratings || {
          verygood: 0,
          good: 0,
          decent: 0,
          bad: 0,
        };

        // Adjust previous rating
        if (userRating) {
          const previousRatingKey = userRating.toLowerCase().replace(" ", "");
          if (currentRatings[previousRatingKey] > 0) {
            await updateDoc(gameRef, {
              [`ratings.${previousRatingKey}`]: increment(-1),
            });
          }
        }

        // Add new rating
        const newRating = userRating === rating ? null : rating;
        setUserRating(newRating);
        if (newRating) {
          const newRatingKey = newRating.toLowerCase().replace(" ", "");
          await updateDoc(gameRef, {
            [`ratings.${newRatingKey}`]: increment(1),
          });
          await setDoc(userRatingsRef, { rating: newRating }, { merge: true });
        }
      }
    } catch (error) {
      console.error("Error rating game:", error);
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
          timestamp: new Date(),
        };

        await addDoc(collection(db, "games", gameId, "reviews"), reviewData);
        setNewReview("");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // useEffect(() => {

  // }, [gameId]);

  if (loading) {
    return <div>Loading game details...</div>;
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

        {/* Ratings Section */}
        {/* <div className="rating-system">
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
        </div> */}

        {/* Reviews Section */}
        {/* <div className="review-section">
          <h3>Reviews:</h3>
          {user && (
            <div className="add-review">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
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
              <p>
                <strong>{review.username}</strong>: {review.comment}
              </p>
            </div>
          ))}
        </div> */}

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
