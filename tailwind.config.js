const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: colors.blueGray,
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      sky: colors.sky,
      red: colors.red,
      yellow: colors.orange,
      indigo: colors.indigo,
      green: colors.teal,
      purple: colors.purple,
      white: colors.white,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
