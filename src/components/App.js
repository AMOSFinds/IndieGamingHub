import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import { AuthProvider, useAuth } from "./Authentication/AuthContext";
import SignUp from "./Authentication/SignUp";
import SignIn from "./Authentication/SignIn";
import Contact from "./Contact";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Dashboard from "./Home/Dashboard";
import NavHeader from "./Home/NavHeader";
import AuthGuard from "./AuthGuard";
import Pricing from "./Home/Pricing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
