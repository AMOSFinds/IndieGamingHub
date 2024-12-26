import React, { useState } from "react";
import AllGamesCard from "./AllGamesCard";
import allgames from "./AllGameData"; // Import the games data
import "./AllGames.css";
import SimpleAllGamesCard from "./SimpleAllGamesCard";

const itemsPerPage = 6; // Number of games per page

function AllGames() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Filter games based on search term and selected genre
  const filteredGames = allgames.filter(
    (game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre ? game.genre.includes(selectedGenre) : true)
  );

  // Calculate the number of pages based on filtered games
  const pageCount = Math.ceil(filteredGames.length / itemsPerPage);

  // Get current games to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGames.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="allgames-container">
      <div className="allgames-page">
        <div className="search-box">
          <div className="allgames-search-filter">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="search-bar"
            />
            <div className="filters">
              <button onClick={() => setSelectedGenre("Puzzle")}>Puzzle</button>
              <button onClick={() => setSelectedGenre("Adventure")}>
                Adventure
              </button>
              <button onClick={() => setSelectedGenre("Simulation")}>
                Simulation
              </button>
              <button onClick={() => setSelectedGenre("Horror")}>Horror</button>
              <button onClick={() => setSelectedGenre("")}>Clear Filter</button>
            </div>
          </div>
        </div>
        <div className="currentItems">
          {currentItems.map((game) => (
            <SimpleAllGamesCard key={game.id} allgame={game} />
          ))}
        </div>

        <div className="pagination">
          {[...Array(pageCount)].map((x, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className="pagination-button"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllGames;
