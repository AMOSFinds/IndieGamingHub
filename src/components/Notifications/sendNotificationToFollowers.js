import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export const sendNotificationToFollowers = async (
  developerId,
  title,
  message
) => {
  const db = getFirestore();
  const followersRef = collection(db, `developers/${developerId}/followers`);
  const followersSnapshot = await getDocs(followersRef);

  if (followersSnapshot.empty) {
    console.error("No followers found for this developer.");
    return;
  }

  console.log("Developer ID:", developerId);

  followersSnapshot.forEach(async (doc) => {
    const followerId = doc.id; // Follower's userId
    console.log(`Sending notification to follower: ${followerId}`);

    try {
      const notificationsRef = collection(
        db,
        `users/${followerId}/notifications`
      );
      await addDoc(notificationsRef, {
        title,
        message,
        timestamp: new Date(),
        read: false,
      });
      const notificationsSnapshot = await getDocs(
        query(notificationsRef, orderBy("timestamp"), limit(11))
      );

      if (notificationsSnapshot.size > 10) {
        const oldestNotification = notificationsSnapshot.docs[0];
        await deleteDoc(oldestNotification.ref);
        console.log("Oldest notification deleted to maintain limit.");
      }
    } catch (error) {
      console.error(`Error sending notification to ${followerId}:`, error);
    }
  });
};
