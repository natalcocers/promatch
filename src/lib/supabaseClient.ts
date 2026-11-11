import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // No tiramos el import entero: dejamos que la app cargue en modo
  // "sin backend conectado todavía" y que las pantallas muestren su
  // estado vacío en vez de una pantalla blanca. Ver README.md.
  console.warn(
    "[Mi Profesional] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — copiá .env.example a .env y completá con tu proyecto de Supabase."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
