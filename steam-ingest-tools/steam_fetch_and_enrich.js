const axios = require("axios");
const fs = require("fs");

const STEAM_API = "https://store.steampowered.com/api/appdetails?appids=";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const isIndieGame = (genres) =>
  Array.isArray(genres) &&
  genres.some((g) => g.description.toLowerCase() === "indie");

const fetchAppDetails = async (appid) => {
  try {
    const res = await axios.get(`${STEAM_API}${appid}`);
    const data = res.data[appid];

    if (!data.success || !data.data) return null;

    const info = data.data;
    if (!isIndieGame(info.genres)) return null;

    const priceCents = info.price_overview?.final;
    const price =
      priceCents && priceCents > 0 ? (priceCents / 100).toFixed(2) : null;

    return {
      appid,
      name: info.name,
      genres: info.genres?.map((g) => g.description),
      price,
      average_playtime: info.average_playtime,
      short_description: info.short_description,
    };
  } catch (err) {
    console.log(`Failed for ${appid}`);
    return null;
  }
};

const run = async () => {
  const steamSpyList = await axios.get(
    "https://steamspy.com/api.php?request=all"
  );
  const rawList = Object.values(steamSpyList.data);
  const appIds = rawList.slice(0, 7000).map((game) => game.appid);

  const enriched = [];
  for (let i = 0; i < appIds.length; i++) {
    const result = await fetchAppDetails(appIds[i]);
    if (result) {
      enriched.push(result);
      console.log(`✅ ${enriched.length}: ${result.name}`);
    }

    // Steam rate limit = ~200 req/min → 1 every 300ms
    await delay(300);

    if (enriched.length >= 5000) break;
  }

  fs.writeFileSync("indie_games.json", JSON.stringify(enriched, null, 2));
  console.log(`✅ Saved ${enriched.length} indie games to indie_games.json`);
};

run();
