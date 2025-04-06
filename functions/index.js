const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

admin.initializeApp();
const db = admin.firestore();

exports.updateGamePrices = onSchedule("every 24 hours", async () => {
  console.log("Updating game prices...");

  const gamesSnapshot = await db.collection("games").get();

  for (const gameDoc of gamesSnapshot.docs) {
    const gameData = gameDoc.data();
    const updatedCompetitors = [];

    for (const competitor of gameData.competitorGames) {
      try {
        const response = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${competitor.gameId}`
        );
        const data = await response.json();

        if (data[competitor.gameId]?.success) {
          const updatedPrice =
            data[competitor.gameId].data.price_overview?.final_formatted ||
            "N/A";
          updatedCompetitors.push({ ...competitor, price: updatedPrice });
        }
      } catch (error) {
        console.error(`Error fetching data for ${competitor.gameId}:`, error);
      }
    }

    await gameDoc.ref.update({ competitorGames: updatedCompetitors });
  }

  console.log("Game prices updated successfully.");
});

exports.fetchSteamPricing = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const gameName = req.query.name;
    if (!gameName) return res.status(400).send("Missing game name");

    try {
      const response = await fetch(
        `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
          gameName
        )}&cc=us&l=en`
      );
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Steam API fetch error:", error);
      return res.status(500).send("Failed to fetch Steam data");
    }
  });
});

exports.updateAdminStats = onDocumentCreated("queries/{queryId}", async () => {
  const adminDoc = db.collection("adminStats").doc("summary");

  await adminDoc.set(
    {
      totalQueries: FieldValue.increment(1),
      dateUpdated: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
});

exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  const secret = functions.config().paystack.secret; // Set this via Firebase CLI if you want
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Unauthorized");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const email = event.data.customer.email;
    const reference = event.data.reference;
    const plan = event.data.metadata?.plan || "pro";

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await userDoc.ref.set(
        {
          subscriptionTier: plan,
          lastPaymentReference: reference,
          lastPaidAt: new Date(),
        },
        { merge: true }
      );
    }
  }

  res.sendStatus(200);
});

exports.getSteamGameDetails = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const appid = req.query.appid;
    if (!appid) return res.status(400).send("Missing Steam appid");

    try {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}`
      );
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Steam game details fetch error:", error);
      return res.status(500).send("Failed to fetch Steam game details");
    }
  });
});
