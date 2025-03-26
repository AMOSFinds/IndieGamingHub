import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { useAuth } from "../Authentication/AuthContext";
import "./NavHeader.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NavHeader() {
  const { currentUser, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show loading spinner
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Truncate email for mobile
  const truncateEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length > 10) {
      return `${name.slice(0, 1)}.${name.slice(-1)}@${domain}`;
    }
    return email;
  };

  return (
    <motion.header
      className="bg-gray-900 text-white shadow-md fixed w-full top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-teal-400">
            Devindie
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-teal-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-teal-400 transition-colors duration-200"
            >
              Dashboard
            </Link>
            {/* <Link
              to="/pricing"
              className="hover:text-teal-400 transition-colors duration-200"
            >
              Pricing
            </Link> */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm truncate max-w-xs">
                  {currentUser.email}
                </span>
                <button
                  onClick={() => {
                    auth.signOut();
                  }}
                  className="bg-teal-500 px-3 py-1 rounded-md hover:bg-teal-600 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/signin"
                  className="bg-teal-500 px-3 py-1 rounded-md hover:bg-teal-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-500 px-3 py-1 rounded-md hover:bg-purple-600 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-gray-800 p-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/"
              className="block hover:text-teal-400 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="block hover:text-teal-400 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            {currentUser ? (
              <>
                <span className="block text-sm truncate">
                  {currentUser.email}
                </span>
                <button
                  onClick={() => {
                    auth.signOut();
                    toggleMenu();
                  }}
                  className="block w-full text-left bg-teal-500 px-3 py-1 rounded-md hover:bg-teal-600 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block bg-teal-500 px-3 py-1 rounded-md hover:bg-teal-600 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-purple-500 px-3 py-1 rounded-md hover:bg-purple-600 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
