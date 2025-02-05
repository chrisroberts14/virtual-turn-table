import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			rotate: {
				270: "270deg",
			},
			transitionDuration: {
				2000: "2000ms",
			},
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
				scroll: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(100%)" },
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
				scroll: "scroll 2s linear infinite",
			},
		},
	},
	darkMode: "class",
	plugins: [heroui(), require("@xpd/tailwind-3dtransforms")],
};
