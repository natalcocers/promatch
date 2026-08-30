import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ProviderListItem } from "@/types/database";

// Centro por defecto cuando no hay geolocalización real del cliente en
// este MVP (ver useNearbyProviders) — coincide con el location_label de
// demo "Palermo, CABA". Si el navegador da permiso, se usa la ubicación
// real en su lugar.
const PALERMO_CENTER: [number, number] = [-34.5875, -58.4205];

// Pines propios en vez del ícono default de Leaflet — evita el problema
// conocido de rutas de imagen rotas con bundlers (Vite/webpack) y de paso
// permite colorear por estado: verde funcional = disponible ahora, navy =
// agendado. El verde acá SÍ es el mismo rol que en el resto de la app
// (Badge "Disponible ahora"), no un uso decorativo nuevo.
function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid #fffbf7;box-shadow:0 1px 4px rgba(7,13,52,0.35)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -26]
  });
}

const availableIcon = pinIcon("#56c689");
const scheduledIcon = pinIcon("#052c7c");

export function ProvidersMap({ providers }: { providers: ProviderListItem[] }) {
  const [center, setCenter] = useState<[number, number]>(PALERMO_CENTER);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
      () => {
        /* permiso denegado o no disponible: se queda con el centro por defecto */
      },
      { timeout: 4000 }
    );
  }, []);

  const withLocation = providers.filter(
    (p): p is ProviderListItem & { location_lat: number; location_lng: number } =>
      p.location_lat != null && p.location_lng != null
  );

  return (
    <div className="pm-map h-64 w-full overflow-hidden rounded-xl border-2 border-navy/15 dark:border-cream/15">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        {/* Tiles de Wikimedia en vez del OSM estándar: estilo más limpio y
            gratuito sin API key (CartoDB Positron, la primera opción,
            empezó a pedir key). Igual que cualquier tile raster por zoom,
            las calles chicas recién aparecen al acercar el zoom. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png"
        />
        {withLocation.map((p) => (
          <Marker
            key={p.profile_id}
            position={[p.location_lat, p.location_lng]}
            icon={p.available_now ? availableIcon : scheduledIcon}
          >
            <Popup>
              <strong>{p.profile.full_name}</strong>
              <br />
              {p.work_zone}
              <br />
              {p.available_now ? "Disponible ahora" : p.next_slot_label ?? "No disponible"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {withLocation.length === 0 && (
        <p className="mt-2 px-1 font-tech text-xs text-navy/50 dark:text-cream/50">
          Ninguno de estos profesionales tiene ubicación cargada todavía.
        </p>
      )}
    </div>
  );
}
