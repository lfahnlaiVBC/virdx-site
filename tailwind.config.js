/** @type {import('tailwindcss').Config} */
import { gridlite, halvar } from './static/fonts/metrics.js';

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
			},
			capsize: {
				metrics: {
					sans: halvar,
					body: halvar,
					display: gridlite
				}
			}
		}
	},
	plugins: [require('@asyarb/tailwind-capsize')]
};
