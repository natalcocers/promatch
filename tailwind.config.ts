import type { Config } from "tailwindcss";

// Paleta y tipografía tomadas de docs/promatch-brand-brief.md.
// Los nombres de color son roles de marca, no valores crudos: usarlos
// en vez de hex sueltos en los componentes para que un cambio de paleta
// futuro se haga en un solo lugar.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#052c7c", // Principal — base de marca
          dark: "#070d34" // Neutro / azul muy oscuro — headers, fondos alto contraste
        },
        accent: "#327af3", // Acento claro — links, hover, extremo del degradé
        green: {
          functional: "#56c689", // EXCLUSIVO: "Verificado" / "Disponible ahora". Nunca decorativo.
          lime: "#89dd7f" // Decorativo — cajas, detalles gráficos, nunca estados de verificación
        },
        orange: "#ec5e28", // Urgencia / CTAs de acción
        cream: "#fffbf7" // Fondo cálido — nunca gris frío
      },
      fontFamily: {
        // Fuentes de marca, autoalojadas desde public/fonts/ (@font-face
        // en index.css): Momo Trust Display (redondeada/cálida, títulos),
        // Space Grotesk (geométrica/técnica, cuerpo y CTAs) y Manrope
        // (texto secundario puntual). Para cambiar de fuente: editar SOLO
        // --font-rounded / --font-tech / --font-caption en index.css, no
        // hace falta tocar componentes ni este config.
        rounded: ["var(--font-rounded)", "system-ui", "sans-serif"],
        tech: ["var(--font-tech)", "system-ui", "sans-serif"],
        caption: ["var(--font-caption)", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #052c7c 0%, #327af3 100%)"
      },
      borderRadius: {
        pill: "999px"
      }
    }
  },
  plugins: []
} satisfies Config;
