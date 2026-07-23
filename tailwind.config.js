/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'IBM Plex Sans', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        ink: '#14241c',
        soft: '#3a4f44',
        muted: '#6a7d72',
        line: '#d5e4da',
        accent: {
          DEFAULT: '#2f8f5b',
          hover: '#247448',
          teal: '#3fa96e',
        },
        paper: {
          DEFAULT: '#fbfdfb',
          deep: '#eef6f0',
        },
      },
    },
  },
  plugins: [],
};
