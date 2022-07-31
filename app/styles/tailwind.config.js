module.exports = {
  content: ['**/*.hbs', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [import('flowbite/plugin.js')],
};
