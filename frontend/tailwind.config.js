/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      height: {
        transparent: 'transparent',
        10: '10px',
        30: '30px',
        40: '40px',
        50: '50px',
        125: '125px',
        135: '135px',
        140: '140px',
        150: '150px',
        160: '160px',
      },
      colors: {
        transparent: 'transparent',
      },
    },
  },
  plugins: [],
};
