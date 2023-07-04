/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	  ],
  theme: {
    extend: {
		fontFamily: {
			'poppins': ['Poppins', 'sans-serif']
		},
		colors: {
			'main-c': '#fad390',
			'second-c': '#786fa6'
		},
	},
  },
  plugins: [],
}