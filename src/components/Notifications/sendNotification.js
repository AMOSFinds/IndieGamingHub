import { getFirestore, collection, addDoc } from "firebase/firestore";

export const sendNotification = async (userId, title, message) => {
  try {
    const db = getFirestore();
    const notificationsRef = collection(db, `users/${userId}/notifications`);
    await addDoc(notificationsRef, {
      title,
      message,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
