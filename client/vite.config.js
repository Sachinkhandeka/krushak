import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), 
    ],

    build: {
        outDir: "dist", // Defines the output directory for production builds
        sourcemap: false, // Disable source maps in production for better security
        minify: "terser", // Minify JavaScript with Terser
        chunkSizeWarningLimit: 600, // Reduce warnings for large chunks
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor"; // Separate vendor dependencies for better caching
                    }
                },
            },
        },
    },

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080", // Proxy API requests to backend
                changeOrigin: true,
                secure: false,
            },
        },
    },

    define: {
        "process.env": {}, // Ensures environment variables are available
    },
});
