import React from "react";
import { motion } from "framer-motion";
import PaystackCheckout from "./PaystackCheckout";

export default function Pricing() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-teal-400 mb-10">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold">Free</h2>
          <p className="text-3xl text-teal-400 my-4">$0</p>
          <p className="text-gray-300 mb-4">Basic pricing tool access</p>
        </div>

        {/* Pro */}
        <div className="bg-gray-800 rounded-lg p-6 text-center border border-teal-400">
          <h2 className="text-xl font-bold">Pro</h2>
          <p className="text-3xl text-teal-400 my-4">$9</p>
          <p className="text-gray-300 mb-4">Full AI tool + pricing history</p>
          <PaystackCheckout plan="pro" />
        </div>

        {/* Enterprise */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold">Enterprise</h2>
          <p className="text-3xl text-teal-400 my-4">$19</p>
          <p className="text-gray-300 mb-4">All features + concierge support</p>
          <PaystackCheckout plan="enterprise" />
        </div>
      </div>
    </div>
  );
}
