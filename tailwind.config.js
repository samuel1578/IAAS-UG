/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'sans': ['Gelasio', 'serif'],
      'serif': ['Gelasio', 'serif'],
      'gelasio': ['Gelasio', 'serif'],
    },
    extend: {
      screens: {
        'xs': '320px',
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }], // 14px, increased from default 12px
      },
    },
  },
  plugins: [],
};
