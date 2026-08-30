import { useState } from "react";
import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Switch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient";

// Preferencias sin respaldo en backend todavía (notificaciones, privacidad
// de ubicación) — se guardan localmente para que el toggle no se sienta
// roto mientras no haya columnas/API para esto. Modo oscuro es la única
// que sí es real (ver ThemeContext): controla la clase "dark" en <html>.
function useLocalToggle(key: string, initial: boolean) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored === null ? initial : stored === "true";
  });
  function set(next: boolean) {
    setValue(next);
    localStorage.setItem(key, String(next));
  }
  return [value, set] as const;
}

// Pantalla de cuenta del cliente — sin mockup propio todavía (mapa de UX
// sección 10 la lista como pendiente de diseñar). Se arma con lo mínimo
// para que la app sea navegable: datos de la cuenta, ubicación mostrada en
// el home, entrada a activar/ver el modo prestador, configuración y cerrar
// sesión.
export default function ClientProfile() {
  const { profile, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editingLocation, setEditingLocation] = useState(false);
  const [location, setLocation] = useState(profile?.location_label ?? "");
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useLocalToggle("promatch-pref-notifications", true);
  const [locationVisible, setLocationVisible] = useLocalToggle("promatch-pref-location-visible", true);

  async function handleLogout() {
    if (window.confirm("¿Cerrar sesión?")) await supabase.auth.signOut();
  }

  async function saveLocation() {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ location_label: location || null }).eq("id", profile.id);
    await refreshProfile();
    setSaving(false);
    setEditingLocation(false);
  }

  function handleDeleteAccount() {
    if (window.confirm("¿Eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      window.alert("Todavía no está disponible. Escribinos desde Ayuda y soporte y lo hacemos por vos.");
    }
  }

  return (
    <div className="min-h-screen bg-cream px-6 pb-24 pt-10 dark:bg-navy-dark">
      <h1 className="mb-4 font-rounded text-lg font-bold text-navy dark:text-cream">Mi perfil</h1>

      <div className="flex items-center gap-3 rounded-2xl border-2 border-navy/15 bg-cream p-4 dark:border-cream/15 dark:bg-navy-dark">
        <Avatar name={profile?.full_name ?? ""} src={profile?.avatar_url} size="lg" />
        <div>
          <p className="font-caption text-sm font-bold text-navy dark:text-cream">{profile?.full_name}</p>
          <Badge tone={profile?.identity_verified ? "verified" : "neutral"} className="mt-1">
            {profile?.identity_verified ? "Identidad verificada" : "Identidad pendiente"}
          </Badge>
        </div>
      </div>

      <div className="mt-3 rounded-xl border-2 border-navy/15 bg-cream px-3 py-3 dark:border-cream/15 dark:bg-navy-dark">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="map-pin" className="text-navy dark:text-cream" />
            Ubicación
          </span>
          {!editingLocation && (
            <button onClick={() => setEditingLocation(true)} className="font-tech text-xs text-accent">
              {profile?.location_label ? "Editar" : "Agregar"}
            </button>
          )}
        </div>
        {editingLocation ? (
          <div className="mt-2 flex gap-2">
            <input
              autoFocus
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Palermo, CABA"
              className="flex-1 rounded-lg border-2 border-navy/15 px-3 py-2 font-tech text-sm dark:border-cream/15 dark:bg-navy-dark dark:text-cream"
            />
            <button
              onClick={saveLocation}
              disabled={saving}
              className="rounded-lg bg-orange px-3 font-rounded text-xs font-bold text-navy"
            >
              {saving ? "..." : "Guardar"}
            </button>
          </div>
        ) : (
          <p className="mt-1 font-tech text-xs text-navy/50 dark:text-cream/50">
            {profile?.location_label || "No configurada"}
          </p>
        )}
      </div>

      <Link to="/prestador/perfil">
        <div className="mt-3 flex items-center justify-between rounded-xl border-2 border-navy/15 bg-cream px-3 py-3 dark:border-cream/15 dark:bg-navy-dark">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="briefcase" className="text-navy dark:text-cream" />
            {profile?.is_provider_active ? "Mi perfil profesional" : "Activar modo prestador"}
          </span>
          <Icon name="chevron-right" className="text-navy/30 dark:text-cream/30" />
        </div>
      </Link>

      <p className="mb-2 mt-6 font-rounded text-sm font-bold text-navy dark:text-cream">Configuración</p>
      <div className="divide-y divide-navy/10 rounded-xl border-2 border-navy/15 bg-cream dark:divide-cream/10 dark:border-cream/15 dark:bg-navy-dark">
        <div className="flex items-center justify-between px-3 py-3">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="moon" className="text-navy dark:text-cream" />
            Modo oscuro
          </span>
          <Switch checked={theme === "dark"} onChange={toggleTheme} label="Modo oscuro" />
        </div>

        <div className="flex items-center justify-between px-3 py-3">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="bell" className="text-navy dark:text-cream" />
            Notificaciones
          </span>
          <Switch checked={notifications} onChange={setNotifications} label="Notificaciones" />
        </div>

        <div className="flex items-center justify-between px-3 py-3">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="map-pin" className="text-navy dark:text-cream" />
            Ubicación visible para prestadores
          </span>
          <Switch checked={locationVisible} onChange={setLocationVisible} label="Ubicación visible para prestadores" />
        </div>

        <Link to="/ayuda" className="flex items-center justify-between px-3 py-3">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="help-circle" className="text-navy dark:text-cream" />
            Ayuda y soporte
          </span>
          <Icon name="chevron-right" className="text-navy/30 dark:text-cream/30" />
        </Link>

        <Link to="/terminos" className="flex items-center justify-between px-3 py-3">
          <span className="flex items-center gap-1.5 font-caption text-sm text-navy dark:text-cream">
            <Icon name="file-text" className="text-navy dark:text-cream" />
            Términos y política de privacidad
          </span>
          <Icon name="chevron-right" className="text-navy/30 dark:text-cream/30" />
        </Link>

        <button onClick={handleDeleteAccount} className="flex w-full items-center gap-1.5 px-3 py-3 text-left">
          <Icon name="trash" className="text-orange" />
          <span className="font-caption text-sm text-orange">Eliminar cuenta</span>
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full text-center font-tech text-sm text-navy/50 underline dark:text-cream/50"
      >
        Cerrar sesión
      </button>

      <TabBar mode="client" />
    </div>
  );
}
