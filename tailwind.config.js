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
        display: ['Pixelify Sans', 'Nunito', 'sans-serif'],
        pixel: ['Pixelify Sans', 'sans-serif'],
        mono: ['VT323', 'ui-monospace', 'monospace'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        ink: '#f3ead8',
        soft: '#c8bfae',
        muted: '#8d8578',
        line: '#3a3548',
        accent: {
          DEFAULT: '#7dcea0',
          hover: '#63b888',
          lamp: '#e8a872',
          water: '#6aa8d1',
        },
        paper: {
          DEFAULT: '#1c1a28',
          deep: '#12101c',
        },
      },
    },
  },
  plugins: [],
};
