/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        dark: '#0a0a0a',
        darker: '#050505',
        gray: {
          900: '#1a1a1a',
          800: '#2a2a2a',
          700: '#3a3a3a',
          600: '#4a4a4a',
        },
        accent: '#c9a227',
        'accent-light': '#e6c455',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
