import React, { useState } from "react";
import { motion } from "framer-motion";
import NavHeader from "./NavHeader";
import Footer from "../Footer";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "https://gmail.us14.list-manage.com/subscribe/post-json?u=36a93385c4941d3698bfd7432&id=1be2adad2d&c=?",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EMAIL: email,
          }),
        }
      );

      // Since Mailchimp JSONP returns opaque response, simulate success
      alert(
        "✅ Subscription successful! The pricing guide will be sent to you shortly!"
      );
      // window.open(
      //   "https://your-firebase-link.com/Indie_Game_Pricing_Guide.pdf",
      //   "_blank"
      // );
      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("There was a problem subscribing. Please try again.");
    }
  };

  const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

    function getTimeRemaining() {
      const deadline = new Date("2025-04-10T23:59:59Z");
      const total = Date.parse(deadline) - Date.now();
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / 1000 / 60 / 60) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      return { total, days, hours, minutes, seconds };
    }

    React.useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(getTimeRemaining());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    if (timeLeft.total <= 0)
      return <p className="text-teal-400 font-bold">Beta is closed</p>;

    return (
      <div className="text-2xl font-mono text-teal-400 flex justify-center space-x-4">
        <span>{timeLeft.days}d</span>
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
        <span>{timeLeft.seconds}s</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      <NavHeader />
      <main className="container mx-auto px-4 py-12 pt-16 text-center flex-grow">
        {/* <motion.h1
          className="text-4xl md:text-5xl font-bold text-teal-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          AI-Powered Game Pricing Intelligence
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Upload an indie game title and get smart pricing recommendations based
          on real-time Steam competitor analysis. Optimize your pricing
          strategy, increase conversions, and stay competitive — in minutes.
        </motion.p> */}

        <div className="mb-10">
          <div className="inline-block px-4 py-1 text-sm bg-red-600 text-white rounded-full uppercase font-bold tracking-wide mb-4">
            Limited Beta: 50 Indie Devs Only
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Price Your Game Wrong, Lose Everything
          </motion.h1>

          <motion.p
            className="text-md md:text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Most indie games fail to price themselves right—and it kills their
            momentum. Our tool analyzes real Steam competitors to help you price
            smart and grow fast. Beta closes in:
          </motion.p>

          <div className="mt-6 text-center">
            <Countdown />
          </div>
        </div>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* <a
            href="/signup"
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg text-white text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Try It Free
          </a> */}
          <a
            href="/signup"
            className="mt-6 inline-block bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-lg text-white text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Join the Beta Now (50 Spots Only)
          </a>
        </motion.div>

        <section className="mb-20">
          <h3 className="text-3xl text-teal-400 font-bold mb-8">
            Why Devindie?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-white">
                Smart Pricing
              </h4>
              <p className="text-gray-400">
                We scan real-time Steam data to give you price suggestions based
                on similar games in your niche.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-white">
                Competitor Insights
              </h4>
              <p className="text-gray-400">
                See how your pricing compares to top and trending indie titles,
                with actionable analytics.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-2 text-white">
                Instant Results
              </h4>
              <p className="text-gray-400">
                No setup. No integrations. Just type your game title and let our
                system do the rest.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            What Indie Devs Are Saying
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-gray-300 italic">
              “This tool gave me instant clarity on how to price my game without
              second-guessing myself.”
              <br />
              <span className="text-teal-400">– @PixelWizardDev</span>
            </p>
            <p className="text-gray-300 italic">
              “The pricing insights are surprisingly accurate. I now feel
              confident pitching to publishers.”
              <br />
              <span className="text-teal-400">– @RetroNovaGames</span>
            </p>
            <p className="text-gray-300 italic">
              “It’s like having a market analyst for your game pricing... but
              free.”
              <br />
              <span className="text-teal-400">– @LofiKnight</span>
            </p>
            <p className="text-gray-300 italic">
              “It showed me exactly what my niche was charging. I raised my
              price — and sold more.”
              <br />
              <span className="text-teal-400">– @DungeonBrewStudio</span>
            </p>
          </div>
        </section>

        <section className="mb-20 mt-20">
          <h3 className="text-3xl font-bold text-teal-400 mb-10">
            Simple, Transparent Pricing
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-white mb-2">Free</h4>
              <p className="text-gray-300 mb-4">For testing it out</p>
              <p className="text-2xl text-teal-400 mb-4">$0 / month</p>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>✓ 3 queries/month</li>
                <li>✓ Basic competitor data</li>
                <li>✓ Community support</li>
              </ul>
              <a
                href="/signup"
                className="block mt-6 bg-teal-500 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-600"
              >
                Get Started
              </a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-white mb-2">Pro</h4>
              <p className="text-gray-300 mb-4">For growing devs</p>
              <p className="text-2xl text-teal-400 mb-4">$29 / month</p>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>✓ 10 queries/month</li>
                <li>✓ In-depth pricing metrics</li>
                <li>✓ Auto-updated data</li>
              </ul>
              <a
                href="/dashboard"
                className="block mt-6 bg-teal-500 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-600"
              >
                Upgrade to Pro
              </a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-white mb-2">Enterprise</h4>
              <p className="text-gray-300 mb-4">For studios and publishers</p>
              <p className="text-2xl text-teal-400 mb-4">$99 / month</p>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>✓ Unlimited queries</li>
                <li>✓ Pricing history trends</li>
                <li>✓ Studio-level support</li>
              </ul>
              <a
                href="/dashboard"
                className="block mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-600"
              >
                Upgrade to Enterprise
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-4">
            One-time payment giving you access for 30 days. Subscriptions
            launching soon!
          </p>
        </section>

        <section className="mb-20 max-w-4xl mx-auto text-left">
          <h3 className="text-3xl font-bold text-teal-400 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="text-gray-300 space-y-6">
            <div>
              <h4 className="font-semibold text-white">What is Devindie?</h4>
              <p>
                Devindie is a SaaS tool that helps indie game developers find
                the best price for their games using real Steam data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">How does it work?</h4>
              <p>
                Just type a game in the same genre or niche as your own, and
                Devindie will analyze similar titles and return a smart pricing
                recommendation instantly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Is it free to try?</h4>
              <p>
                Yes. Our Free tier lets you run 3 pricing queries per month with
                limited data. Upgrade anytime for full access.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">
                Do you support multiplayer or mobile games?
              </h4>
              <p>
                Yes. As long as it's listed or comparable on Steam, Devindie can
                analyze it.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-lg mx-auto mt-12 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold text-center text-teal-400 mb-4">
            🎁 Get the Free Indie Game Pricing Guide
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Subscribe for expert pricing tips, Steam market insights, and free
            indie dev tools.
          </p>

          <form
            onSubmit={handleEmailSubmit}
            className="max-w-md mx-auto mb-8 text-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-2 rounded-l-lg bg-gray-700 text-white w-2/3"
            />
            <button
              type="submit"
              className="p-2 bg-teal-500 rounded-r-lg w-1/3 hover:bg-teal-600"
            >
              Subscribe
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
