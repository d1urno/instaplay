/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        clay: '#2c3e50'
      }
    },
    textShadow: {
      default: '0 2px 5px rgba(0, 0, 0, 0.3)',
      lg: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    variants: [
      'responsive',
      'group-hover',
      'focus-within',
      'first',
      'last',
      'odd',
      'even',
      'hover',
      'focus',
      'active',
      'visited',
      'disabled'
    ],
    plugins: [require('tailwindcss-typography')()]
  }
}
