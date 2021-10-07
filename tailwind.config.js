module.exports = {
  purge: [
    './**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
      'off-white':'#fffcf4',
      'beige':'#f9f0db',
      'pastel-blue':'#ffe5f3',
      }
    },   
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
