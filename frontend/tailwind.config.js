/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uncsm: {
          blue: '#025490',
          gold: '#CCAE7A',
          white: '#F4F7F9',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Roboto as default sans font
      }
    },
  },
  plugins: [],
}
