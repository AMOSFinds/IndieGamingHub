// openai_embed.js
require("dotenv").config();
const fs = require("fs");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const games = JSON.parse(fs.readFileSync("indie_games.json"));

const generateDescription = (game) => {
  return `Game: ${game.name}. Tags: ${game.tags}. Positive Reviews: ${game.positive}. Owners: ${game.owners}.`;
};

const generateEmbeddings = async () => {
  const results = [];

  for (const game of games) {
    const input = generateDescription(game);

    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input,
      });

      const [embedding] = embeddingResponse.data.map((obj) => obj.embedding);
      results.push({
        id: game.appid.toString(),
        metadata: {
          name: game.name,
          price: game.price ? parseFloat(game.price) : undefined,
          genres: game.genres,
          playtime: game.average_playtime,
          description: game.short_description,
        },
        values: embedding,
      });
    } catch (err) {
      console.error(`Failed embedding for ${game.name}:`, err.message);
    }

    // Optional: Rate limit handling
    await new Promise((r) => setTimeout(r, 100)); // 10 per second
  }

  fs.writeFileSync("game_embeddings.json", JSON.stringify(results, null, 2));
  console.log("Finished generating embeddings.");
};

generateEmbeddings();
