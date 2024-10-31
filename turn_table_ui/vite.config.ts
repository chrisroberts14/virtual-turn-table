import { fileURLToPath } from "node:url";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Get the current directory (where the Vite process is running)
const currentDir = fileURLToPath(new URL(".", import.meta.url));

// Load environment variables conditionally
export default defineConfig(({ mode }) => {
	if (mode === "development") {
		dotenv.config({ path: `${currentDir}../.env` });
	} else {
		dotenv.config({ path: `${currentDir}/.env` });
	}

	return {
		build: {
			sourcemap: true,
		},
		plugins: [
			react(),
			tsconfigPaths(),
			sentryVitePlugin({
				authToken: process.env.SENTRY_AUTH_TOKEN,
				org: "christopher-roberts",
				project: "vtt-ui",
			}),
		],
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
