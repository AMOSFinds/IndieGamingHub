/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const faker = require("faker");

admin.initializeApp();

const db = admin.firestore();

// Cloud Function to generate fake user activity (Ratings and Reviews)
exports.generateFakeActivity = functions.https.onRequest(async (req, res) => {
  try {
    const fakeUsers = [
      { name: "DevIndieFan1", email: "fan1@fake.com" },
      { name: "DevIndieFan2", email: "fan2@fake.com" },
      { name: "DevIndieFan3", email: "fan3@fake.com" },
    ];

    const fakeRatings = [5, 4, 3, 4, 5];
    const fakeComments = [
      "Amazing!",
      "Loved it!",
      "Could be better!",
      "Well done!",
      "Fantastic!",
    ];

    // Step 1: Create fake users
    const userRefs = [];
    for (const user of fakeUsers) {
      const newUser = await db.collection("users").add({
        username: user.name,
        email: user.email,
        points: Math.floor(Math.random() * 500), // Random points
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      userRefs.push(newUser.id);
    }

    // Step 2: Add fake ratings and comments for each user
    for (const userId of userRefs) {
      await db
        .collection("games")
        .doc("gameId1")
        .collection("reviews")
        .add({
          userId,
          rating: fakeRatings[Math.floor(Math.random() * fakeRatings.length)],
          comment:
            fakeComments[Math.floor(Math.random() * fakeComments.length)],
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      // Update points for the action
      await db
        .collection("users")
        .doc(userId)
        .update({
          points: admin.firestore.FieldValue.increment(10),
        });
    }

    res.status(200).send("Fake activity data successfully generated!");
  } catch (error) {
    console.error("Error generating fake activity:", error);
    res.status(500).send("Error generating fake activity.");
  }
});

// Cloud Function to generate fake blog posts and developer data
exports.generateFakeData = functions.https.onRequest(async (req, res) => {
  try {
    // Generate fake blog posts
    const blogPostsRef = db.collection("blogPosts");
    for (let i = 0; i < 5; i++) {
      const fakeBlog = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        username: faker.internet.userName(),
        profilePicUrl: faker.image.avatar(),
        likes: faker.datatype.number({ min: 0, max: 100 }),
        comments: generateFakeComments(3),
        timestamp: admin.firestore.Timestamp.now(),
      };
      await blogPostsRef.add(fakeBlog);
    }

    // Generate developer profiles
    const developersRef = db.collection("developers");
    for (let i = 0; i < 5; i++) {
      const fakeDeveloper = {
        name: faker.name.findName(),
        bio: faker.lorem.sentence(),
        job: faker.name.jobTitle(),
        profilePicUrl: faker.image.avatar(),
        games: [faker.commerce.productName(), faker.commerce.productName()],
      };

      const devDoc = await developersRef.add(fakeDeveloper);

      // Generate polls for developer profiles
      const pollsRef = devDoc.collection("polls");
      for (let j = 0; j < 2; j++) {
        const fakePoll = {
          question: faker.lorem.sentence(),
          options: [
            {
              option: "Option 1",
              votes: faker.datatype.number({ min: 0, max: 10 }),
            },
            {
              option: "Option 2",
              votes: faker.datatype.number({ min: 0, max: 10 }),
            },
            {
              option: "Option 3",
              votes: faker.datatype.number({ min: 0, max: 10 }),
            },
          ],
          timestamp: admin.firestore.Timestamp.now(),
        };
        await pollsRef.add(fakePoll);
      }

      // Generate developer updates
      const updatesRef = devDoc.collection("developerUpdates");
      for (let k = 0; k < 2; k++) {
        const fakeUpdate = {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          timestamp: admin.firestore.Timestamp.now(),
        };
        await updatesRef.add(fakeUpdate);
      }

      // Generate comments for developer profiles
      const commentsRef = devDoc.collection("comments");
      for (let l = 0; l < 3; l++) {
        const fakeComment = {
          username: faker.internet.userName(),
          profilePicUrl: faker.image.avatar(),
          text: faker.lorem.sentence(),
          timestamp: admin.firestore.Timestamp.now(),
        };
        await commentsRef.add(fakeComment);
      }
    }

    res
      .status(200)
      .send(
        "Fake blog posts, developer profiles, and related data generated successfully!"
      );
  } catch (error) {
    console.error("Error generating fake data: ", error);
    res.status(500).send("Failed to generate fake data.");
  }
});

// Helper function to generate fake comments
function generateFakeComments(count) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push({
      username: faker.internet.userName(),
      profilePicUrl: faker.image.avatar(),
      text: faker.lorem.sentence(),
      timestamp: admin.firestore.Timestamp.now(),
    });
  }
  return comments;
}
