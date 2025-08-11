/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Naya color palette yahan add kiya gaya hai
      colors: {
        background: '#0D1117', // Main background color (Dark Navy)
        primary: '#E6EDF3',     // Main text color (Light Gray/White)
        secondary: '#8B949E',   // Secondary text color (Gray)
        accent: {
          DEFAULT: '#388BFD', // Main accent color (Bright Blue)
          hover: '#58A6FF',  // Accent color on hover
        },
        card: '#161B22',        // Card background color (Slightly lighter than main bg)
        border: '#30363D',      // Border color
      },
      // Smooth fade-in animation ke liye
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}