import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

const useRecommendations = (userPreferences) => {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const gamesRef = collection(db, "games");
      let q;

      if (userPreferences?.favoriteGenres?.length > 0) {
        // Recommend games in the user's favorite genres
        q = query(
          gamesRef,
          where("genre", "array-contains-any", userPreferences.favoriteGenres)
        );
      } else {
        // Default: Recommend top-rated games
        q = query(gamesRef, orderBy("favorites", "desc"), limit(10));
      }

      try {
        const querySnapshot = await getDocs(q);
        const games = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecommendedGames(games);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [userPreferences, db]);

  return recommendedGames;
};

export default useRecommendations;
