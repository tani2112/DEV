/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cookbook: {
          bg: '#FAF7F2',
          surface: '#FFFFFF',
          card: '#FFFDF9',
          border: '#E8DFD5',
          borderHover: '#D4C4B5',
          primary: '#C2410C',     // Warm terracotta
          primaryHover: '#9A3412',
          accent: '#D97706',      // Turmeric amber
          accentLight: '#FEF3C7',
          sage: '#15803D',        // Fresh herb green
          sageLight: '#DCFCE7',
          textDark: '#292524',    // Warm stone black
          textMuted: '#78716C',   // Warm stone grey
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(136, 78, 25, 0.08), 0 2px 6px -1px rgba(136, 78, 25, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(136, 78, 25, 0.12), 0 4px 10px -2px rgba(136, 78, 25, 0.06)',
      }
    },
  },
  plugins: [],
}
