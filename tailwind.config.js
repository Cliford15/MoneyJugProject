/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
      archivoblack: ['Archivo Black', 'sans-serif'],
      bungee: ['Bungee Spice', 'cursive'],
    },
    },
  },
  plugins: [],
}
