/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        cereal: ['Cereal', 'sans-serif'],
      },
      colors: {
        // Light Mode Colors
        primary: '#FFFFFF',   // Màu nền chính (trắng)
        secondary: '#F0F0F0', // Màu nền phụ (xám nhạt)
        accent: '#FF5A5F',    // Màu nhấn (đỏ cam Airbnb)
        textLight: '#222222', // Màu văn bản chính (đen nhạt)

        // Dark Mode Colors
        darkPrimary: '#121212',   // Nền chính (xám rất đậm)
        darkSecondary: '#333333', // Nền phụ (xám đậm)
        darkAccent: '#FF5A5F',    // Màu nhấn (làm dịu đi so với light mode)
        textDark: '#E0E0E0',      // Màu văn bản (trắng nhẹ)

        pinkCustom: '#e91e63',
        rateColor: 'rgba(34, 34, 34, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideLeft: 'slideLeft 400ms ease-in-out',
        slideRight: 'slideRight 400ms ease-in-out',
      },
      transitionProperty: {
        'height': 'height',
      },
      height: {
        // View Height
        'vh-10': '10vh',
        'vh-20': '20vh',
        'vh-30': '30vh',
        'vh-40': '40vh',
        'vh-50': '50vh',
        'vh-60': '60vh',
        'vh-70': '70vh',
        'vh-80': '80vh',
        'vh-90': '90vh',
      }
    },
  },
  plugins: [],
};
