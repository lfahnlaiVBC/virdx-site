/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: ['class', '[data-mode="dark"]'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Halvar', 'sans-serif'],
				body: ['Halvar', 'sans-serif'],
				display: ['Gridlite', 'sans-serif']
			},
			fontVariationSettings: {
				wght: 'var(--font-wght-g)'
			}
		}
	},
	plugins: []
};
