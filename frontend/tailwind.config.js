/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20241F",
        forest: {
          50: "#EEF3EE",
          100: "#D3E0D2",
          200: "#A8C2A6",
          300: "#7CA379",
          400: "#568455",
          500: "#3A6B3A",
          600: "#2C5530",
          700: "#1F4423",
          800: "#183619",
          900: "#122813",
        },
        ochre: "#C68A2E",
        brick: "#9A4B3B",
        paper: "#F6F4EE",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
