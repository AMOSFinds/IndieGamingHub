import React from "react";
import Header from "./Header";
import GameDiscoverySection from "./GameDiscoverySection";
import DeveloperProfileSection from "./DeveloperProfileSection";
import About from "../About";
import BlogSection from "../BlogPosts/BlogSection";
import EmailSignUpSection from "./EmailSignupSection";

function Home() {
  return (
    <div>
      <Header />
      <GameDiscoverySection />
    </div>
  );
}

export default Home;
