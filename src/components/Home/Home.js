import React from "react";
import Header from "./Header";
import GameDiscoverySection from "./GameDiscoverySection";
import DeveloperProfileSection from "./DeveloperProfileSection";
import About from "../About";
import BlogSection from "../BlogPosts/BlogSection";

function Home() {
  return (
    <div>
      <Header />
      <GameDiscoverySection />
      <DeveloperProfileSection />
    </div>
  );
}

export default Home;
