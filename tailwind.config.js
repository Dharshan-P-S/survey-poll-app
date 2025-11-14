module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          500: '#2563eb', // blue-ish
          600: '#1e40af'
        }
      }
    },
  },
  plugins: [],
};
