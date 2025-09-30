
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}',
    './index.html',
    './node_modules/daisyui/dist/**/*.js',
  ],

  theme: {
    extend: {
      colors: {
        hitech: {
          backgroundLeft: '#2B0A4D',
          backgroundCenter: '#5D2E8C',
          backgroundRight: '#B98CE0',
          card: '#3D185B',
          cardDark: '#341150',
          primaryText: '#E4D5FF',
          secondaryText: '#C6B1E1',
          button: '#B38CFF',
          buttonText: '#3D185B',
        },
      },
      backgroundImage: {
        'hitech-gradient': 'linear-gradient(90deg, #2B0A4D 0%, #5D2E8C 50%, #B98CE0 100%)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        hitech: {
          primary: '#B38CFF',
          secondary: '#C6B1E1',
          accent: '#5D2E8C',
          neutral: '#3D185B',
          'base-100': '#2B0A4D',
          info: '#3D185B',
          success: '#5D2E8C',
          warning: '#B98CE0',
          error: '#E4D5FF',
        },
      },
    ],
  },

  }


