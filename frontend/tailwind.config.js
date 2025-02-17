/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Default sans-serif font
        bengali: ['Noto Sans Bengali', 'sans-serif'],
      },
      colors: {
        primaryColor: '#3498DB',
        textColor: '2C3E50',
        whiteColor: "#FFFFFF"
      },
      backgroundImage: {
        'box-gradient': 'linear-gradient(83.67deg, #2B3952 8.4%, rgba(1, 180, 143, 0.65) 98.41%)',
      },
      letterSpacing: {
        'expense-space': '0.015em',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        'custom': '0px 15px 40px 0px rgba(62, 94, 91, 0.04)',
      }
    },
  },
  plugins: [],
}

