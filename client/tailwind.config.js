/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'truck-blue': '#1e40af',
        'truck-orange': '#ea580c',
        'truck-gray': '#374151',
        'road-gray': '#6b7280',
      },
      fontFamily: {
        'truck': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
} 