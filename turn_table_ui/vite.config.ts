import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import dotenv from 'dotenv';
import {fileURLToPath} from "node:url";


// Get the current directory (where the Vite process is running)
const currentDir = fileURLToPath(new URL('.', import.meta.url));

// Load environment variables from the parent directory
dotenv.config({ path: `${currentDir}../.env` });


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
