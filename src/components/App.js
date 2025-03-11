import React from "react";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import { AuthProvider, useAuth } from "./Authentication/AuthContext";
import SignUp from "./Authentication/SignUp";
import SignIn from "./Authentication/SignIn";
import Contact from "./Contact";
import Profile from "./Profile";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Footer from "./Footer";
import Leaderboard from "./Home/Leaderboard";
import Dashboard from "./Home/Dashboard";
import NavHeader from "./Home/NavHeader";
import AuthGuard from "./AuthGuard";
import TesterDashboard from "./Home/TesterDashboard";
import Pricing from "./Home/Pricing";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Navbar /> */}
        <NavHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:demoId" element={<Dashboard />} />
          <Route path="/tester/:demoId" element={<TesterDashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
      {/* <Footer /> */}
    </AuthProvider>
  );
}

export default App;
