/** @type {import('tailwindcss').Config} */
module.exports = {
	plugins: [require("daisyui")],
	important: true,
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	  ],
  theme: {
    extend: {
		colors: {
			'main-c': '#fad390',
			'second-c': '#786fa6'
		},
	},
  },
}