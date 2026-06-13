/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          navyLight: '#232F3E',
          yellow: '#FFD814',
          yellowHover: '#F7CA00',
          red: '#B12704',
          bg: '#EAEDED',
          teal: '#007185',
          green: '#007600'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
