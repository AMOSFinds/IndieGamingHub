// Home.js
import React from "react";
import { motion } from "framer-motion";
import NavHeader from "./NavHeader"; // Adjust path
import Footer from "../Footer"; // Adjust path
import { FaUnity } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      <NavHeader />
      <main className="container mx-auto px-4 py-12 pt-16 text-center flex-grow">
        {/* Hero Section */}
        <motion.h1
          className="text-4xl font-bold text-teal-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Fast, Affordable Human Playtesting for Indie Devs
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Upload your game demo, get real feedback in 24 hours—free to start!
        </motion.p>
        <motion.div
          className="flex flex-col items-center space-y-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="/signup"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-transform hover:scale-105"
          >
            Sign Up Free
          </a>
          {/* <a
            href="/signin"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-transform hover:scale-105"
          >
            Sign In
          </a> */}
        </motion.div>
        <div className="max-w-md mx-auto mb-8">
          <img
            src="images/dashboardtest.PNG"
            alt="Dashboard Preview"
            className="h-48 md:h-64 w-full opacity-80 rounded-lg object-cover"
          />
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-gray-400 mb-4">Trusted by 100+ Indie Devs</p>
          <div className="flex justify-center space-x-4">
            <img
              src="images/unitylogo1.PNG"
              alt="Unity"
              className="h-8 opacity-70"
            />
            <img
              src="images/godotlogo.PNG"
              alt="Godot"
              className="h-8 opacity-70"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-4xl font-bold text-teal-400 mb-20 text-center">
            Why Devindie?
          </h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 my-30">
            <div className="text-gray-400 ">
              <ul className="list-disc list-inside space-y-4">
                <li className="flex items-center mt-10">
                  <span className="text-teal-400 mr-2">✓</span>
                  <span className="text-lg">24-hour feedback</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-400 mr-2">✓</span>
                  <span className="text-lg">Curated testers</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-400 mr-2">✓</span>
                  <span className="text-lg">Free analytics</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="images/gamingpic2.jpg" // Replace with your image path
                alt="Game Controller"
                className="h-48 md:h-64 w-full opacity-70 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      <section className="py-12">
        <motion.h2
          className="text-2xl font-bold text-teal-400 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Simple, Affordable Pricing
        </motion.h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl text-white font-bold mb-2">Free</h3>
            <p className="text-gray-300 mb-4">Perfect for getting started</p>
            <p className="text-3xl text-teal-400 mb-4">$0 / month</p>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 1 demo/month
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 1-3 testers per
                demo
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 24-hour feedback
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> Basic analytics
              </li>
            </ul>
            <motion.a
              href="/signup"
              className="mt-6 block bg-teal-500 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-600"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Get Started Free
            </motion.a>
          </motion.div>
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl text-white font-bold mb-2">Pro</h3>
            <p className="text-gray-300 mb-4">For growing indie projects</p>
            <p className="text-3xl text-teal-400 mb-4">$15 / month</p>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 5 demos/month
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 3-5 testers per
                demo
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 18-hour feedback
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> Enhanced analytics
              </li>
            </ul>
            <motion.a
              href="/pricing"
              className="mt-6 block bg-teal-500 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-600"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Upgrade to Pro
            </motion.a>
          </motion.div>
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl text-white font-bold mb-2">Premium</h3>
            <p className="text-gray-300 mb-4">For serious indie devs</p>
            <p className="text-3xl text-teal-400 mb-4">$25 / month</p>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> Unlimited
                demos/month
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 5+ testers per
                demo
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> 12-hour feedback
              </li>
              <li className="flex items-center">
                <span className="text-teal-400 mr-2">✓</span> Advanced analytics
              </li>
            </ul>
            <motion.a
              href="/pricing"
              className="mt-6 block bg-purple-500 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-600"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Upgrade to Premium
            </motion.a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
