import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ProMatch",
        short_name: "ProMatch",
        description: "La persona ideal para cada necesidad.",
        theme_color: "#052c7c",
        background_color: "#fffbf7",
        display: "standalone",
        // Placeholder: un solo ícono SVG hasta que exista el logo real en
        // alta resolución (ver src/components/ui/Logo.tsx). Reemplazar por
        // PNGs de 192x192 y 512x512 cuando llegue el asset definitivo.
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
      }
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
