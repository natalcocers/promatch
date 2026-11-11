import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import Rating from "@/pages/Rating";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Help from "@/pages/Help";
import Terms from "@/pages/Terms";
import Chat from "@/pages/chat/Chat";

import ClientHome from "@/pages/client/Home";
import ClientCategory from "@/pages/client/Category";
import ClientListing from "@/pages/client/Listing";
import ClientProviderProfile from "@/pages/client/ProviderProfile";
import ClientContact from "@/pages/client/Contact";
import ClientSearch from "@/pages/client/Search";
import ClientSearching from "@/pages/client/Searching";
import ClientFavorites from "@/pages/client/Favorites";
import ClientProfile from "@/pages/client/Profile";

import ProviderHome from "@/pages/provider/Home";
import ProviderRequestDetail from "@/pages/provider/RequestDetail";
import ProviderProfile from "@/pages/provider/Profile";
import ProviderCalendar from "@/pages/provider/Calendar";
import ProviderSubscription from "@/pages/provider/Subscription";

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, guest, loading } = useAuth();
  if (loading) return <p className="p-6 font-tech text-sm text-navy/50">Cargando...</p>;
  if (!session && !guest) return <Navigate to="/bienvenida" replace />;
  return <>{children}</>;
}

// El switch de rol / rutas de prestador solo tienen sentido para quienes
// ya activaron el modo prestador — salvo /prestador/perfil, que es donde
// se activa (mapa de UX, arquitectura general).
function RequireProviderMode({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <p className="p-6 font-tech text-sm text-navy/50">Cargando...</p>;
  if (!profile?.is_provider_active) return <Navigate to="/prestador/perfil" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    // key={pathname} remonta este div en cada cambio de ruta para que la
    // animación pm-page-in (index.css) se repita — un fade + slide sutil,
    // no un cambio de layout real.
    <div key={location.pathname} className="pm-page-in">
      <Routes>
      <Route path="/bienvenida" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <ClientHome />
          </RequireAuth>
        }
      />
      <Route
        path="/categoria/:categoryId"
        element={
          <RequireAuth>
            <ClientCategory />
          </RequireAuth>
        }
      />
      <Route
        path="/categoria/:categoryId/:specialtyId"
        element={
          <RequireAuth>
            <ClientListing />
          </RequireAuth>
        }
      />
      <Route
        path="/profesional/:providerId"
        element={
          <RequireAuth>
            <ClientProviderProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/profesional/:providerId/contacto"
        element={
          <RequireAuth>
            <ClientContact />
          </RequireAuth>
        }
      />
      <Route
        path="/solicitud/:requestId/buscando"
        element={
          <RequireAuth>
            <ClientSearching />
          </RequireAuth>
        }
      />
      <Route
        path="/buscar"
        element={
          <RequireAuth>
            <ClientSearch />
          </RequireAuth>
        }
      />
      <Route
        path="/mensajes"
        element={
          <RequireAuth>
            <Messages mode="client" />
          </RequireAuth>
        }
      />
      <Route
        path="/favoritos"
        element={
          <RequireAuth>
            <ClientFavorites />
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth>
            <ClientProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/notificaciones"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />
      <Route
        path="/ayuda"
        element={
          <RequireAuth>
            <Help />
          </RequireAuth>
        }
      />
      <Route
        path="/terminos"
        element={
          <RequireAuth>
            <Terms />
          </RequireAuth>
        }
      />

      <Route
        path="/prestador/perfil"
        element={
          <RequireAuth>
            <ProviderProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/prestador"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <ProviderHome />
            </RequireProviderMode>
          </RequireAuth>
        }
      />
      <Route
        path="/prestador/solicitudes"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <ProviderHome />
            </RequireProviderMode>
          </RequireAuth>
        }
      />
      <Route
        path="/prestador/solicitudes/:requestId"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <ProviderRequestDetail />
            </RequireProviderMode>
          </RequireAuth>
        }
      />
      <Route
        path="/prestador/mensajes"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <Messages mode="provider" />
            </RequireProviderMode>
          </RequireAuth>
        }
      />
      <Route
        path="/prestador/calendario"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <ProviderCalendar />
            </RequireProviderMode>
          </RequireAuth>
        }
      />
      <Route
        path="/prestador/suscripcion"
        element={
          <RequireAuth>
            <RequireProviderMode>
              <ProviderSubscription />
            </RequireProviderMode>
          </RequireAuth>
        }
      />

      <Route
        path="/chat/:conversationId"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      />
      <Route
        path="/calificar/:requestId"
        element={
          <RequireAuth>
            <Rating />
          </RequireAuth>
        }
      />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
