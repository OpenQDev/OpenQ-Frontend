const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {

    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      DEFAULT: '0.25rem',
      DEFAULT: '4px',
      'md': '0.375rem',
      'lg': '0.75rem',
      'full': '9999px',
      'large': '12px',
    },
    extend: {
      colors: {
        'menu-black': '#090909',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
