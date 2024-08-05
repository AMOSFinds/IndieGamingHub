import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase-config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import FavoritesCard from "./FavoritesCard";
import "./Favorites.css";
import LoadingIndicator from "../../LoadingIndicator";
import { useAuth } from "../../Authentication/AuthContext";

const itemsPerPage = 5;

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const favoritesRef = collection(db, `users/${user.uid}/favorites`);
        const q = query(favoritesRef, orderBy("title"));
        const snapshot = await getDocs(q);
        const favs = snapshot.docs.map((doc) => doc.data());
        setFavorites(favs);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const handleRemove = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const handleShare = () => {
    const shareLink = `${window.location.origin}/favorites/${currentUser.uid}`;
    navigator.clipboard.writeText(shareLink);
    alert("Shareable link copied to clipboard!");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = favorites.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <LoadingIndicator />;

  return (
    <div>
      <h2 className="favorites-title">Your Favorite Games</h2>
      <div className="favorites-list">
        {favorites.length === 0 ? (
          <p className="no-favorites">You currently have no favorite games.</p>
        ) : (
          currentItems.map((game) => (
            <div key={game.id} className="game-card">
              <button onClick={handleShare}>Share Favorites</button>
              <FavoritesCard
                key={game.id}
                allgame={game}
                onRemove={handleRemove}
              />
            </div>
          ))
        )}
      </div>
      {favorites.length > 0 && (
        <div className="pagination">
          {[...Array(Math.ceil(favorites.length / itemsPerPage))].map(
            (x, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className="pagination-button"
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Favorites;
