module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        mf: '990px',
        mwdt: '1600px',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            '-webkit-transform': 'translateX(120%)',
            transform: 'translateX(120%)',
          },
          '100%': {
            '-webkit-transform': 'translateX(0%)',
            transform: 'translateX(0%)',
          },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
      },
      backgroundColor: {
        mainColor: '#7700b3',
        secondaryColor: '#4a008f1c'
      },
    },
  },
  plugins: [],
};
