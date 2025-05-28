/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}"
  ],
  darkMode: ["class"],     // class-based dark mode
  theme: {
    extend: {}
  },
  plugins: []
}
