/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		// "./app/**/*.{js,ts,jsx,tsx}",
		// "./pages/**/*.{js,ts,jsx,tsx}",
		// "./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			animation: {
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			height: {
				sidebar: 'calc(100vh - 72px)',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar')],
};
