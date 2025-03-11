module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1a202c",
        teal: {
          400: "#00c4b4",
          300: "#66e0d5",
          500: "#00a896",
          600: "#008b7a",
        },
        purple: {
          500: "#6200ea",
          600: "#4c00b4",
        },
        white: "#ffffff",
      },
    },
  },
  plugins: [], // Optional, but built-in dark mode works
  darkMode: "class", // Enable dark mode by default with a class
};
