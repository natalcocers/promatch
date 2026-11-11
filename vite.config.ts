import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Mi Profesional",
        short_name: "Mi Profesional",
        description: "La persona ideal para cada necesidad.",
        theme_color: "#070d34",
        background_color: "#070d34",
        display: "standalone",
        // Generados desde el logo real (src/assets/logo-celeste.png) sobre
        // fondo navy-dark de marca — ver public/pwa-*.png. El "maskable"
        // tiene más padding (zona segura del 80%) para no recortarse mal
        // con las máscaras de ícono de Android (círculo, squircle, etc.).
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
