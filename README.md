# ProMatch — MVP

App de servicios de dos lados (clientes y prestadores). Ver `docs/` para
marca, reglas de diseño del deck y el mapa completo de UX — este README
documenta cómo está armado el proyecto que implementa un recorte de eso.

## Alcance de este MVP

Circuito **completo de punta a punta**, acotado a **una sola categoría**:
**Hogar → Plomería**. Ver `docs/ProMatch-mapa-completo-UX.md` para el diseño
completo de producto; lo que no está construido todavía queda marcado con
pantallas "Próximamente" (`src/pages/ComingSoon.tsx`) en vez de romper la
navegación.

**Construido:**
- Registro/login único (Supabase Auth).
- Activación de modo prestador (perfil + especialidad Plomería).
- Home cliente → categoría Hogar → listado Plomería → perfil de
  profesional.
- Contacto (Ahora/Agendado) → formulario con chips de motivo → chat con
  tarjeta de contexto pineada.
- Home prestador → solicitudes entrantes → aceptar/rechazar → chat.
- Cierre del servicio (prestador marca terminado → cliente confirma) +
  calificación con etiquetas rápidas.
- Notificaciones in-app: tabla y RLS listas (`notifications`); todavía sin
  pantalla propia — se agrega en la siguiente iteración.

**Fuera de este MVP** (diseñado en el mapa de UX, no construido todavía):
verificación de identidad por IA real (el campo `identity_verified` existe
pero se setea a mano/por seed), validación fiscal real (`fiscal_status`
existe pero sin flujo), suscripción y pago con MercadoPago (tabla
`subscriptions` lista, sin UI), multi-categoría, favoritos (tabla
`favorites` lista, sin UI), calendario del prestador, mapa interactivo
(usamos distancia calculada con PostGIS, sin mapa visual), reenvío
automático de solicitudes "Ahora" a otro prestador.

## Decisiones técnicas (confirmadas con Natalia)

- **Plataforma:** web app responsive (PWA vía `vite-plugin-pwa`), no app
  nativa todavía.
- **Stack:** React + TypeScript + Vite (SPA, sin SSR — casi todo vive
  detrás de login) + Tailwind CSS + Supabase (Postgres, Auth, Realtime,
  Storage).
- **Fuentes:** **Momo Trust Display** (rounded, títulos y logo) y
  **Space Grotesk** (tech, el resto del texto), cargadas vía `<link>` de
  Google Fonts en `index.html` y referenciadas como variables CSS en
  `src/index.css` — para cambiar de fuente se edita **solo** ese archivo
  (dos líneas `--font-rounded` / `--font-tech`), sin tocar
  `tailwind.config.ts` ni componentes.
- **Assets de marca:** todavía no hay logo en SVG ni personajes
  ilustrados. `src/components/ui/Logo.tsx` y `src/components/ui/Avatar.tsx`
  son placeholders mínimos, aislados para reemplazar sin tocar el resto de
  la UI cuando lleguen los assets definitivos.
- **Paleta y reglas visuales:** tokens de Tailwind en `tailwind.config.ts`
  tomados 1:1 de `docs/promatch-brand-brief.md`. El verde funcional
  (`green-functional`) está reservado por convención de nombre para
  "Verificado"/"Disponible ahora" — no usarlo como color decorativo (regla
  del mapa de UX sección 4 y del deck).

## Estructura

```
docs/                       Documentos de marca, diseño y UX (fuente de verdad de producto)
supabase/
  migrations/0001_init.sql  Esquema completo (tablas, tipos, RLS)
  seed/seed.sql             Datos de ejemplo (2 plomeros + 1 cliente) para probar local
src/
  components/ui/            Kit de diseño (Button, Pill, Badge, Card, Ring, Logo, Avatar)
  components/layout/        TabBar (cliente / prestador)
  context/AuthContext.tsx   Sesión + profile actual
  hooks/                    Data layer (React Query + Supabase)
  pages/client/             Camino cliente
  pages/provider/           Camino prestador
  pages/chat/               Chat compartido por ambos roles
  App.tsx                   Rutas y guards (RequireAuth, RequireProviderMode)
```

## Cómo correrlo

Requiere **Node.js 20+** (no estaba instalado en este entorno — instalarlo
primero: https://nodejs.org, o con `winget install OpenJS.NodeJS.LTS`).

```bash
npm install
cp .env.example .env   # completar con tu proyecto de Supabase
npm run dev
```

### Backend (Supabase)

1. Crear un proyecto en https://supabase.com.
2. Copiar `Project URL` y `anon public key` a `.env`.
3. Correr la migración: con Supabase CLI (`supabase link` + `supabase db
   push`), o pegando el contenido de `supabase/migrations/0001_init.sql` en
   el SQL Editor del dashboard.
4. Opcional, para tener datos de prueba: correr también
   `supabase/seed/seed.sql` (pensado para local/dev — crea usuarios
   directo en `auth.users`, no usar en producción).

## Próximos pasos sugeridos

1. Instalar Node y correr `npm install` para validar que todo compila
   (`npm run build`) — no se pudo verificar en este entorno.
2. Crear el proyecto de Supabase y correr la migración + seed.
3. Probar el circuito completo en el navegador: registrarse como cliente,
   activar modo prestador en otra cuenta (o usar el seed), contactar,
   chatear, cerrar y calificar.
4. Sumar la pantalla de notificaciones in-app (la tabla ya existe).
5. Cuando estén el logo real y las fuentes compradas, reemplazar
   `Logo.tsx`, `Avatar.tsx` y las dos variables de fuente — el resto de la
   UI no debería necesitar cambios.
