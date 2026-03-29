import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
    plugins: [react(), tailwindcss()],
    base: process.env.VITE_BASE_URL || '/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@packages': fileURLToPath(new URL('./packages', import.meta.url)),
        },
    },
    build: {
        chunkSizeWarningLimit: 3000,
    },
}));