/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Professional "boutique editorial" palette: warm ivory ground,
        // near-black ink, muted rosewood and brass accents (swapped in from
        // the earlier bubblegum-pink/bright-gold scheme for a more
        // grown-up, trustworthy feel).
        cream: '#FAF6F0',
        blush: {
          DEFAULT: '#C08893',
          light: '#EFDDD9',
          dark: '#9C5F6C',
        },
        gold: {
          DEFAULT: '#A6813C',
          light: '#C9AD73',
          dark: '#7E5F28',
        },
        charcoal: '#211B18',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(33, 27, 24, 0.16)',
        gold: '0 8px 24px -8px rgba(166, 129, 60, 0.4)',
      },
      backgroundImage: {
        'gold-foil':
          'linear-gradient(120deg, #A6813C 0%, #D9C088 25%, #A6813C 50%, #D9C088 75%, #A6813C 100%)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.04) saturate(1.08)' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
