import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import "./ActivityFeed.css";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchAllActivities = async () => {
      const db = getFirestore();

      try {
        const activitiesList = [];

        // Fetch ratings, reviews, followings, and activities
        const ratingsQuery = query(
          collection(db, "users"),
          orderBy("timestamp", "desc")
        );
        const userSnapshots = await getDocs(ratingsQuery);
        for (const userDoc of userSnapshots.docs) {
          const ratingsRef = collection(db, `users/${userDoc.id}/ratings`);
          const ratingsSnapshot = await getDocs(ratingsRef);
          ratingsSnapshot.forEach((ratingDoc) => {
            const ratingData = ratingDoc.data();
            activitiesList.push({
              id: ratingDoc.id,
              type: "Rating",
              content: `${userDoc.data().username} rated "${
                ratingData.gameTitle
              }" as "${ratingData.rating}"`,
              profilePicUrl:
                userDoc.data().profilePicUrl || "default-profile-pic-url",
              timestamp: ratingData.timestamp || new Date(),
            });
          });
        }

        const gamesRef = collection(db, "games");
        const gamesSnapshot = await getDocs(gamesRef);
        for (const gameDoc of gamesSnapshot.docs) {
          const reviewsRef = collection(db, `games/${gameDoc.id}/reviews`);
          const reviewsSnapshot = await getDocs(reviewsRef);
          reviewsSnapshot.forEach((reviewDoc) => {
            const reviewData = reviewDoc.data();
            activitiesList.push({
              id: reviewDoc.id,
              type: "Review",
              content: `${reviewData.username} reviewed "${
                gameDoc.data().title
              }" with "${reviewData.comment}"`,
              profilePicUrl:
                reviewData.profilePicUrl || "default-profile-pic-url",
              timestamp: reviewData.timestamp || new Date(),
            });
          });
        }

        const activitiesRef = collection(db, "activities");
        const activitiesSnapshot = await getDocs(activitiesRef);
        activitiesSnapshot.forEach((activityDoc) => {
          const activityData = activityDoc.data();
          activitiesList.push({
            id: activityDoc.id,
            type: activityData.type || "Activity",
            content: activityData.content,
            profilePicUrl:
              activityData.profilePicUrl || "default-profile-pic-url",
            timestamp: activityData.timestamp || new Date(),
          });
        });

        activitiesList.sort((a, b) => {
          const aTime = a.timestamp?.seconds
            ? a.timestamp.seconds
            : new Date(a.timestamp).getTime();
          const bTime = b.timestamp?.seconds
            ? b.timestamp.seconds
            : new Date(b.timestamp).getTime();
          return bTime - aTime; // Sort descending by time
        });

        setActivities(activitiesList);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchAllActivities();
  }, []);

  return (
    <div className="activity-feed-container">
      <h2>Activity Feed</h2>
      <ul className="activity-feed-list">
        {activities.map((activity) => (
          <li key={activity.id} className="activity-feed-item">
            <img
              src={activity.profilePicUrl}
              alt={`${activity.type} profile`}
              className="activity-profile-pic"
            />
            <div className="activity-content">
              <p>{activity.content}</p>
              <span className="activity-timestamp">
                {new Date(
                  activity.timestamp?.seconds
                    ? activity.timestamp.toDate() // Firestore Timestamp
                    : activity.timestamp // Already a Date or string
                ).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
