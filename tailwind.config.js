/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e14',
        surface: '#14191f',
        gold: '#c9a875',
        goldbright: '#e8c98a',
        ink: '#f0e9d8',
        inkdim: '#a8a193',
      },
      fontFamily: {
        display: ['Cinzel_700Bold', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
