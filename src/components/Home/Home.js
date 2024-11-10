import React from "react";
import ShowcasePage from "./ShowcasePage";
import AllGames from "./AllGames/AllGames";
import Footer from "../Footer";
import Header from "./Header";
import GameDiscoverySection from "./GameDiscoverySection";
import DeveloperProfileSection from "./DeveloperProfileSection";
import DevProfilePage from "./DevProfile/DevProfilePage";

function Home() {
  return (
    <div>
      <Header />
      <ShowcasePage />
      <GameDiscoverySection />
      <DeveloperProfileSection />
    </div>
  );
}

export default Home;
