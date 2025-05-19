/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#3b82f6',
        'brand-yellow': '#f59e0b',
      },
      keyframes: {
        modalShow: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0px)' },
        }
      },
      animation: {
        modalShow: 'modalShow 0.3s ease-out forwards',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
    // ... eventuali altri plugin
  ],
}
