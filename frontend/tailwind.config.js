/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luna: {
          cream: '#FAF8F5',
          sand: '#F5F2EB',
          pearl: '#F8F6F0',
          charcoal: '#1A1A1A',
          night: '#0D0E12',
          gold: {
            50: '#FBF9F3',
            100: '#F5EFE0',
            200: '#EBDCBF',
            300: '#DEC496',
            400: '#D4AF37',
            500: '#B89324',
            600: '#947318',
            700: '#6E5411',
          },
          slate: {
            800: '#1E232E',
            900: '#131722',
            950: '#0B0E17',
          }
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'luxury-hover': '0 25px 50px -12px rgba(212, 175, 55, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
