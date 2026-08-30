import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { useServiceRequest, useCancelRequest } from "@/hooks/useServiceRequests";
import { useProvider } from "@/hooks/useProviders";

// Estado "buscando profesional" (mapa de UX 2.6,
// docs/promatch_buscando_profesional_mockup.html). Solo aplica a la
// modalidad "Ahora". Nota: el reenvío automático a otro profesional
// cercano si no responde a tiempo requiere un job de backend (cron/edge
// function) que este MVP todavía no tiene — acá se refleja el estado real
// del pedido (intento actual, si el prestador ya respondió) sin fingir una
// reasignación automática que no existe.
export default function Searching() {
  const { requestId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const conversationId = params.get("conversation");

  const { data: request } = useServiceRequest(requestId, { refetchInterval: 3000 });
  const { data: provider } = useProvider(request?.provider_id ?? undefined);
  const cancelRequest = useCancelRequest();

  useEffect(() => {
    if (request?.status === "aceptada" && conversationId) {
      navigate(`/chat/${conversationId}?request=${request.id}`, { replace: true });
    }
  }, [request?.status, conversationId, navigate, request?.id]);

  if (!request) return <p className="p-6 font-tech text-sm text-navy/50 dark:text-cream/50">Cargando...</p>;

  const rejected = request.status === "rechazada" || request.status === "expirada";

  return (
    <div className="flex min-h-screen flex-col bg-cream dark:bg-navy-dark px-6 pt-10">
      <div className="flex items-center justify-between">
        <span className="font-rounded text-sm font-bold text-navy dark:text-cream">Tu solicitud</span>
        <span className="font-tech text-xs text-navy/50 dark:text-cream/50">
          Intento {request.attempt_count} de {request.max_attempts}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-3 py-2.5">
        <Icon name="tools" className="text-sm text-navy dark:text-cream" />
        <span className="font-tech text-xs text-navy dark:text-cream">
          {request.reason_chips[0] ?? request.specialty} · Ahora
        </span>
      </div>

      {!rejected ? (
        <>
          <div className="my-10 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="pm-ring" />
              <div className="pm-ring d2" />
              <div className="pm-ring d3" />
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-navy">
                <Icon name="user-search" className="text-2xl text-cream" />
              </div>
            </div>
          </div>

          <p className="text-center font-rounded text-sm font-bold text-navy dark:text-cream">
            Buscando un profesional disponible cerca tuyo
          </p>
          <p className="mt-1 text-center font-tech text-xs text-navy/50 dark:text-cream/50">
            Esperando respuesta de {provider?.profile.full_name ?? "el profesional"}.
          </p>
        </>
      ) : (
        <div className="mt-10 text-center">
          <p className="font-rounded text-sm font-bold text-navy dark:text-cream">
            {provider?.profile.full_name ?? "El profesional"} no puede tomar tu pedido ahora.
          </p>
          <p className="mt-1 font-tech text-xs text-navy/50 dark:text-cream/50">Elegí a otro profesional cercano para seguir.</p>
          <button
            onClick={() => navigate("/categoria/hogar/plomeria")}
            className="mt-4 rounded-pill bg-orange px-5 py-2.5 font-rounded text-sm font-bold text-navy dark:text-cream"
          >
            Elegir otro profesional
          </button>
        </div>
      )}

      {!rejected && (
        <button
          onClick={() => requestId && cancelRequest.mutate(requestId)}
          className="mt-auto mb-8 text-center font-tech text-xs text-navy/50 dark:text-cream/50 underline"
        >
          Cancelar búsqueda
        </button>
      )}
    </div>
  );
}
