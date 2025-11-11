/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        expand: {
          '0%': { 
            transform: 'scale(1) translateY(0)',
            transformOrigin: 'top'
          },
          '50%': { 
            transform: 'scale(1.02) translateY(0)',
            transformOrigin: 'center'
          },
          '100%': { 
            transform: 'scale(1) translateY(0)',
            transformOrigin: 'center'
          }
        },
        collapse: {
          '0%': { 
            transform: 'scale(1) translateY(0)',
            transformOrigin: 'center'
          },
          '50%': { 
            transform: 'scale(1.02) translateY(0)',
            transformOrigin: 'top'
          },
          '100%': { 
            transform: 'scale(1) translateY(0)',
            transformOrigin: 'top'
          }
        }
      },
      animation: {
        'expand': 'expand 500ms ease-out forwards',
        'collapse': 'collapse 500ms ease-out forwards'
      }
    },
  },
  plugins: [],
}