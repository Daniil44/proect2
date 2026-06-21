import { defineConfig } from "vite";

export default defineConfig({
    root: "views",
    build: {
        outDir: "../public/dist",
        emptyOutDir: true
    }
});