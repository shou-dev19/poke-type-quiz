/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pokemon type colors
        'fire': '#F08030',
        'water': '#6890F0',
        'grass': '#78C850',
        'electric': '#F8D030',
        'psychic': '#F85888',
        'ice': '#98D8D8',
        'dragon': '#7038F8',
        'dark': '#705848',
        'fairy': '#EE99AC',
        'normal': '#A8A878',
        'fighting': '#C03028',
        'poison': '#A040A0',
        'ground': '#E0C068',
        'flying': '#A890F0',
        'bug': '#A8B820',
        'rock': '#B8A038',
        'ghost': '#705898',
        'steel': '#B8B8D0',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}