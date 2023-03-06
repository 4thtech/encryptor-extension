/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "./src/**/**/*.{js,ts,jsx,tsx,vue}",
    "./src/**/**/**/*.{js,ts,jsx,tsx,vue}",
    "./src/**/**/**/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2cd8a7',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
