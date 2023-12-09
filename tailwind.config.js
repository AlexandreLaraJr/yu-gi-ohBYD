/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'phone': '360px',
      'tablet': '720px',
      'desktop': '1024px',
      'desktopxl': '1440px'
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}