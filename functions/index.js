const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAI } = require("openai");
require("dotenv").config();
const { onCall } = require("firebase-functions/v2/https");

admin.initializeApp();
const db = admin.firestore();

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  if (
    event.event === "charge.success" ||
    event.event === "subscription.create" ||
    event.event === "invoice.create"
  ) {
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
          subscriptionCode: subscriptionCode,
        },
        { merge: true }
      );
    }
  }

  res.sendStatus(200);
});

exports.getSmartPrice = functions.https.onCall(
  {
    // <— this line turns on infra-level App Check enforcement
    enforceAppCheck: true,
  },
  async (request) => {
    const { description, genre, playtime, scope } = request.data;
    const context = request;

    if (!context.app) {
      throw new Error("⛔ App Check token missing or invalid");
    }

    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be logged in"
      );
    }

    const userId = context.auth.uid;

    try {
      // Step 1: Build input
      const inputText = `${description} Genre: ${genre}. Estimated Playtime: ${playtime}. Team size: ${scope}.`;

      // Enforce 5-query limit for free tier users
      const userDoc = await db.collection("users").doc(userId).get();
      const subscriptionTier = userDoc.data().subscriptionTier || "free";

      if (subscriptionTier === "free") {
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const querySnapshot = await db
          .collection("games")
          .where("userId", "==", userId)
          .where("createdAt", ">=", startOfMonth)
          .get();

        if (querySnapshot.size >= 5) {
          throw new functions.https.HttpsError(
            "permission-denied",
            "Free plan limit reached. Upgrade for more queries."
          );
        }
      }

      // Step 2: Generate embedding
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputText,
      });

      const userEmbedding = embeddingResponse.data[0].embedding;

      // Step 3: Search Pinecone
      const index = pinecone.Index("indie-games");
      const searchResult = await index.query({
        vector: userEmbedding,
        topK: 10,
        includeMetadata: true,
      });

      const matches = searchResult.matches;

      // Step 4: Calculate Price
      const prices = matches
        .map((g) => parseFloat(g.metadata?.price))
        .filter((p) => !isNaN(p) && p > 0);

      if (prices.length === 0) {
        return {
          suggestedPrice: null,
          competitors: matches.map((g) => ({
            name: g.metadata.name,
            price: "$N/A",
          })),
          explanation:
            "We couldn't calculate a price because none of the matched games have price data.",
        };
      }

      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

      const playtimeFactor =
        playtime === "Long (10+ hrs)"
          ? 1.2
          : playtime === "Short (<3 hrs)"
          ? 0.8
          : 1;
      const cap =
        scope === "Solo Developer"
          ? 9.99
          : scope === "Small Team"
          ? 19.99
          : 49.99;

      const suggestedPrice = Math.min(
        (avgPrice * playtimeFactor).toFixed(2),
        cap
      );

      // Step 5: GPT Explanation
      const gameExamples = matches
        .slice(0, 5)
        .map((g) => `${g.metadata.name} ($${g.metadata.price || "N/A"})`)
        .join(", ");

      const explanationPrompt = `
You're an expert pricing advisor. Based on this description: "${description}",
and these similar games: ${gameExamples}, explain in 2 sentences why $${suggestedPrice} is a good price.
`;

      const chat = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: explanationPrompt }],
      });

      const explanation = chat.choices[0].message.content;

      // Step 6: Save to Firestore
      await db.collection("games").add({
        userId,
        gameName: description,
        genre,
        playtime,
        scope,
        suggestedPrice,
        competitorGames: matches.map((g) => ({
          name: g.metadata.name,
          price: g.metadata.price || "N/A",
        })),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        suggestedPrice,
        competitors: matches.map((g) => ({
          name: g.metadata.name,
          price: g.metadata.price,
          score: g.score,
        })),
        explanation,
      };
    } catch (err) {
      console.error(err);
      throw new functions.https.HttpsError("internal", err.message);
    }
  }
);

exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in."
    );

  const uid = context.auth.uid;
  const userDoc = await db.collection("users").doc(uid).get();
  const subscriptionCode = userDoc.data().subscriptionCode;

  if (!subscriptionCode)
    throw new functions.https.HttpsError("not-found", "No subscription found.");

  try {
    const response = await fetch(
      `https://api.paystack.co/subscription/${subscriptionCode}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${functions.config().paystack.secret}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to cancel subscription");

    await db.collection("users").doc(uid).update({
      subscriptionTier: "free",
      subscriptionCode: admin.firestore.FieldValue.delete(),
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});
