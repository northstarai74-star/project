/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF7',
        blush: {
          DEFAULT: '#F2B8CB',
          light: '#F7D9E3',
          dark: '#E794AF',
        },
        gold: {
          DEFAULT: '#C9A44C',
          light: '#D4AF37',
          dark: '#A8863B',
        },
        charcoal: '#2B2320',
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
        soft: '0 10px 40px -12px rgba(43, 35, 32, 0.15)',
        gold: '0 8px 24px -8px rgba(201, 164, 76, 0.45)',
      },
      backgroundImage: {
        'gold-foil':
          'linear-gradient(120deg, #C9A44C 0%, #F2D98A 25%, #C9A44C 50%, #F2D98A 75%, #C9A44C 100%)',
      },
    },
  },
  plugins: [],
}
