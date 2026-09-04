/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium/luxury palette: true onyx-black ink (not a warm brown),
        // ivory ground, and a richer champagne gold with more metallic
        // contrast than a flat brass — the pairing most luxury beauty
        // brands lean on (think black-and-gold packaging) rather than a
        // pastel editorial look.
        cream: '#FAF7F1',
        blush: {
          DEFAULT: '#B98A93',
          light: '#EDDCD8',
          dark: '#8F5A64',
        },
        gold: {
          DEFAULT: '#B8933F',
          light: '#DCC17E',
          dark: '#8C6B28',
        },
        charcoal: '#141110',
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
        soft: '0 10px 40px -12px rgba(20, 17, 16, 0.22)',
        gold: '0 8px 24px -8px rgba(184, 147, 63, 0.45)',
      },
      backgroundImage: {
        'gold-foil':
          'linear-gradient(120deg, #8C6B28 0%, #E9D19E 25%, #8C6B28 50%, #E9D19E 75%, #8C6B28 100%)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.04) saturate(1.08)' },
        },
        foil: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%) rotate(8deg)' },
          '55%, 100%': { transform: 'translateX(220%) rotate(8deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s ease-in-out infinite',
        foil: 'foil 5s ease-in-out infinite',
        sheen: 'sheen 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
