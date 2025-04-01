// src/components/Footer.js
import React from "react";
import "./Footer.css";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
        <p className="text-sm ">
          © 2025 Devindie |{" "}
          <a
            href="/contact"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200"
          >
            Contact Us <span className="text-white">|</span>
          </a>
          <a
            href="/terms"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200 ml-2"
          >
            Terms <span className="text-white">|</span>
          </a>
          <a
            href="/privacy"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-200 ml-2"
          >
            Privacy
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
