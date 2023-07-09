/** @type {import("vite").UserConfig} */

import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";

const globalVendorPackages = Object.keys(dependencies);

function renderChunks(deps: Record<string, string>) {
	const chunks = {};
	Object.keys(deps).forEach(key => {
		if (globalVendorPackages.includes(key)) return;
		chunks[key] = [key];
	});
	return chunks;
}

export default defineConfig(option => ({
	plugins: [react()],
	json: {
		stringify: true
	},
	resolve: {
		alias: {
			"~": resolve(__dirname, "./src")
		}
	},
	server: { port: 3001 },
	preview: { port: 3001 }
	// build: {
	// 	cssCodeSplit: false,
	// 	sourcemap: option.mode === "development",
	// 	rollupOptions: {
	// 		output: {
	// 			manualChunks: {
	// 				vendor: globalVendorPackages,
	// 				...renderChunks(dependencies)
	// 			}
	// 		}
	// 	}
	// }
}));
