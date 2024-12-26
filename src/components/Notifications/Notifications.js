import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const db = getFirestore();
      const userId = "currentUserId"; // Replace with logged-in user's ID
      const notificationsRef = collection(db, `users/${userId}/notifications`);
      const q = query(notificationsRef, orderBy("timestamp", "desc"));

      try {
        const querySnapshot = await getDocs(q);
        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const db = getFirestore();
      const userId = "currentUserId"; // Replace with logged-in user's ID
      const notificationRef = doc(db, `users/${userId}/notifications`, id);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
            >
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <button onClick={() => markAsRead(notification.id)}>
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
