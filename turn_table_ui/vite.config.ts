import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	return {
		build: {
			sourcemap: true,
		},
		plugins: [react(), tsconfigPaths()],
		test: {
			environment: "jsdom",
			globals: true,
			coverage: {
				exclude: [
					"**/*.js",
					"**/site.ts",
					"**/vite.config.ts",
					"__tests__",
					"**/vite-env.d.ts",
					"**/provider.tsx",
					"**/main.tsx",
				],
			},
		},
	};
});
