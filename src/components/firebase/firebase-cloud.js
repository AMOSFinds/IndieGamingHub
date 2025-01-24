const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.recalculatePoints = functions.https.onRequest(async (req, res) => {
  const userPoints = {};

  // Step 1: Count points from past ratings
  const ratingsSnapshot = await db.collectionGroup("ratings").get();
  ratingsSnapshot.forEach((doc) => {
    const userId = doc.ref.parent.parent.id;
    if (!userPoints[userId]) userPoints[userId] = 0;
    userPoints[userId] += 5;
  });

  // Step 2: Count points from past reviews
  const reviewsSnapshot = await db.collectionGroup("reviews").get();
  reviewsSnapshot.forEach((doc) => {
    const userId = doc.ref.parent.parent.id;
    if (!userPoints[userId]) userPoints[userId] = 0;
    userPoints[userId] += 10;
  });

  // Step 3: Count points from past favorites
  const favoritesSnapshot = await db.collectionGroup("favorites").get();
  favoritesSnapshot.forEach((doc) => {
    const userId = doc.ref.parent.parent.id;
    if (!userPoints[userId]) userPoints[userId] = 0;
    userPoints[userId] += 3;
  });

  // Step 4: Update user profiles with the total points
  const batch = db.batch();
  for (const [userId, points] of Object.entries(userPoints)) {
    const userRef = db.collection("users").doc(userId);
    batch.update(userRef, { points: points });
  }

  await batch.commit();
  res.send("User points updated successfully.");
});
