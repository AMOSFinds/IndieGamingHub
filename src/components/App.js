import React from "react";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import AllGames from "./Home/AllGames/AllGames";
import AllDevs from "./Home/DevProfile/AllDevs";
import DevProfileForm from "./Home/DevProfile/DevProfileForm";
import Favorites from "./Home/AllGames/Favorites";
import { AuthProvider, useAuth } from "./Authentication/AuthContext";
import SignUp from "./Authentication/SignUp";
import SignIn from "./Authentication/SignIn";
import Algorithm from "./Home/Recommendations/Algorithm";
import Contact from "./Contact";
import Profile from "./Profile";
import DevPage from "./Home/DevProfile/DevPage";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Footer from "./Footer";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allgames" element={<AllGames />} />
          <Route path="/all-devs" element={<AllDevs />} />
          <Route path="/devprofile-form" element={<DevProfileForm />} />
          <Route path="/devpage" element={<DevPage />} />
          <Route path="/devpage/:devId" element={<DevPage />} />
          {/* DevPage route */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/algorithm" element={<Algorithm />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Router>
      <Footer />
    </AuthProvider>
  );
}

export default App;
