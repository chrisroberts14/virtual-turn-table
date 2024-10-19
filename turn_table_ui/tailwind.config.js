import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			keyframes: {
				slideUp: {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideRight: {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				slideLeft: {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(-100%)", opacity: "0" },
				},
				slideInFromLeft: {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				slideOutToRight: {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(100%)", opacity: "0" },
				},
				slideInFromRight: {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				slideOutToLeft: {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(-100%)", opacity: "0" },
				},
			},
			animation: {
				slideUp: "slideUp 0.5s ease-out",
				slideRight: "slideRight 0.5s ease-out",
				slideLeft: "slideLeft 0.5s ease-out",
				slideInFromLeft: "slideInFromLeft 0.5s ease-out",
				slideOutToRight: "slideOutToRight 0.5s ease-out",
				slideInFromRight: "slideInFromRight 0.5s ease-out",
				slideOutToLeft: "slideOutToLeft 0.5s ease-out",
			},
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
