const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    // './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        trektrack: '#fc6d00',
        primary: '#1A6dff',
        second: '#DDEAFF',
        'common-gray': '#ccc',
        'light-gray': '#eee',
        'primay-gray': '#D4DAE3',
        black : '#444'
      },
    },
  },
  plugins: [],
};
