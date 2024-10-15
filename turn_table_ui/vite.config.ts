import { fileURLToPath } from "node:url";
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
		plugins: [react(), tsconfigPaths()],
	};
});
