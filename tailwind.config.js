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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalContentShow: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0px)' },
        },
        tabContentShow: { // Animazione per il contenuto del tab
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        modalContentShow: 'modalContentShow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards', // Curva più dinamica
        tabContentShow: 'tabContentShow 0.4s ease-out forwards',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
    // ... eventuali altri plugin
  ],
}
