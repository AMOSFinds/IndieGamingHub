import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Line } from "react-chartjs-2";

function AnalyticsDashboard({ gameId }) {
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [playtime, setPlaytime] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const db = getFirestore();

      // Fetch ratings
      const ratingsSnapshot = await getDocs(
        collection(db, `games/${gameId}/analytics/ratings`)
      );
      const ratingsData = ratingsSnapshot.docs.map((doc) => doc.data());
      setRatings(ratingsData);

      // Fetch reviews
      const reviewsSnapshot = await getDocs(
        collection(db, `games/${gameId}/analytics/reviews`)
      );
      const reviewsData = reviewsSnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);

      // Fetch playtime
      const playtimeSnapshot = await getDocs(
        collection(db, `games/${gameId}/analytics/playtime`)
      );
      const playtimeData = playtimeSnapshot.docs.map((doc) => doc.data());
      setPlaytime(playtimeData);
    };

    fetchAnalytics();
  }, [gameId]);

  return (
    <div className="analytics-dashboard">
      <h2>Analytics for Game {gameId}</h2>

      <div className="chart-container">
        <h3>Ratings</h3>
        <Line
          data={{
            labels: ratings.map((_, index) => `Rating ${index + 1}`),
            datasets: [
              {
                label: "Ratings",
                data: ratings.map((d) => d.rating),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className="chart-container">
        <h3>Reviews</h3>
        <Line
          data={{
            labels: reviews.map((_, index) => `Review ${index + 1}`),
            datasets: [
              {
                label: "Reviews",
                data: reviews.map((d) => d.rating),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
