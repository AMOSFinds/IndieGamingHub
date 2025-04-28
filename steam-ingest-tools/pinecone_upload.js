// pinecone_upload.js
require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const fs = require("fs");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const run = async () => {
  const embeddings = JSON.parse(fs.readFileSync("game_embeddings.json"));
  const index = pinecone.Index("indie-games");

  const chunkSize = 100;

  for (let i = 0; i < embeddings.length; i += chunkSize) {
    const chunk = embeddings.slice(i, i + chunkSize);
    try {
      await index.upsert(chunk);
      console.log(`Uploaded ${i + chunk.length} / ${embeddings.length}`);
    } catch (err) {
      console.error("Upload failed:", err.message);
    }
  }
};

run();
