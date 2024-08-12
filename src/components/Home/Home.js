import React from "react";
import ShowcasePage from "./ShowcasePage";
import AllGames from "./AllGames/AllGames";
import Footer from "../Footer";

function Home() {
  return (
    <div>
      <ShowcasePage />
      <AllGames />
      <Footer />
    </div>
  );
}

export default Home;
