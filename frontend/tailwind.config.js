/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue, js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors:{
        blue:{
          200 :'#14213d',
          300 :'#023047',
        },
        gray:{
          700 :'#353535',
        },
        yellow:{
          500 :'#ffb703',
        }
      }
    },
  },
  plugins: [],
}

