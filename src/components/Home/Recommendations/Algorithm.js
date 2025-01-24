import React, { useEffect, useState } from "react";
import allgames from "../AllGames/AllGameData";
import useUserPreferences from "./useUserPreferences";
import AllGamesCard from "../AllGames/AllGamesCard";

const Algorithm = () => {
  const { preferences, loading, error } = useUserPreferences();
  const [recommendedGames, setRecommendedGames] = useState([]);

  // useEffect(() => {
  //   if (preferences) {
  //     const { genres, platforms, playstyle } = preferences;

  //     // Filter games based on user preferences
  //     let filteredGames = allgames.filter(
  //       (game) =>
  //         genres.includes(game.genre) && platforms.includes(game.platform)
  //     );

  //     // Rank games based on playstyle
  //     filteredGames.sort((a, b) => {
  //       const aScore = a.playstyle === playstyle ? 1 : 0;
  //       const bScore = b.playstyle === playstyle ? 1 : 0;
  //       return bScore - aScore;
  //     });

  //     setRecommendedGames(filteredGames);
  //   }
  // }, [preferences]);

  useEffect(() => {
    if (preferences) {
      const filteredGames = allgames.filter((game) => {
        const matchesGenre =
          preferences.genres && preferences.genres.includes(game.genre);
        const matchesPlatform =
          preferences.platforms &&
          preferences.platforms.includes(game.platform);
        const matchesPlaystyle =
          preferences.playstyle &&
          game.playstyles.includes(preferences.playstyle);
        return matchesGenre || matchesPlatform || matchesPlaystyle;
      });
      setRecommendedGames(filteredGames);
    }
  }, [preferences]);

  if (loading) return <p>Loading preferences...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="favorites-title">Recommended Games for You</h2>
      {recommendedGames.length > 0 ? (
        recommendedGames.map((game) => (
          <AllGamesCard key={game.id} allgame={game} />
        ))
      ) : (
        <p>No recommendations available based on your preferences.</p>
      )}
    </div>
  );
};

export default Algorithm;
