import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { BackHeader } from "@/components/layout/BackHeader";
import { useServiceRequest, useRespondToRequest } from "@/hooks/useServiceRequests";
import { useCreateConversation } from "@/hooks/useConversation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/database";
import { categoryLabel, specialtyLabel } from "@/lib/catalog";

// Se asume una ventana de 10 minutos para responder un pedido "Ahora" —
// no hay una columna de vencimiento explícita en el esquema todavía, así
// que este countdown es una aproximación visual sobre requested_at.
const RESPONSE_WINDOW_MS = 10 * 60 * 1000;

function useCountdown(deadline: number | null) {
  const [remaining, setRemaining] = useState(deadline ? deadline - Date.now() : 0);
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => setRemaining(deadline - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [deadline]);
  return Math.max(0, remaining);
}

// Detalle de solicitud entrante (mapa de UX 3.2,
// docs/promatch_solicitud_entrante_mockup.html). Aceptar/Rechazar; al
// aceptar se abre el mismo chat con contexto que ve el cliente.
export default function ProviderRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: request } = useServiceRequest(requestId);
  const [client, setClient] = useState<Profile | null>(null);
  const respond = useRespondToRequest();
  const createConversation = useCreateConversation();

  useEffect(() => {
    if (!request?.client_id) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", request.client_id)
      .single()
      .then(({ data }) => setClient(data as Profile));
  }, [request?.client_id]);

  const deadline = request ? new Date(request.requested_at).getTime() + RESPONSE_WINDOW_MS : null;
  const remainingMs = useCountdown(request?.mode === "ahora" ? deadline : null);
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  if (!request) return <p className="p-6 font-tech text-sm text-navy/50 dark:text-cream/50">Cargando...</p>;

  async function goToChat(prefill?: string) {
    if (!request || !profile) return;
    const conversation = await createConversation.mutateAsync({
      serviceRequestId: request.id,
      clientId: request.client_id,
      providerId: profile.id
    });
    const query = prefill ? `&draft=${encodeURIComponent(prefill)}` : "";
    navigate(`/chat/${conversation.id}?request=${request.id}${query}`);
  }

  async function handleAccept() {
    await respond.mutateAsync({ id: request!.id, accept: true });
    await goToChat();
  }

  async function handleReject() {
    await respond.mutateAsync({ id: request!.id, accept: false });
    navigate("/prestador");
  }

  async function handleProposeOther() {
    await respond.mutateAsync({ id: request!.id, accept: true });
    await goToChat("¿Podemos coordinar otro horario? Contame qué días te quedan cómodos.");
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-6 pb-10">
      <BackHeader label="Solicitud" to="/prestador" />

      <div className="mt-4 flex items-center gap-2.5">
        <Avatar name={client?.full_name ?? "Cliente"} src={client?.avatar_url} size="md" />
        <div className="flex-1">
          <p className="font-caption text-sm font-semibold text-navy dark:text-cream">{client?.full_name ?? "Cargando..."}</p>
          {request.mode === "agendado" && request.scheduled_for && (
            <p className="font-tech text-xs text-navy/50 dark:text-cream/50">
              {new Date(request.scheduled_for).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
            </p>
          )}
        </div>
      </div>

      {request.mode === "ahora" && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-orange px-3 py-2.5">
          <span className="flex items-center gap-1.5 font-rounded text-xs font-bold text-navy dark:text-cream">
            <Icon name="bolt" />
            Ahora · urgente
          </span>
          <span className="font-rounded text-xs font-bold text-navy dark:text-cream">
            {remainingMs > 0 ? `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} restantes` : "Vencido"}
          </span>
        </div>
      )}

      <div className="mt-4 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-3">
        <p className="mb-2 font-rounded text-xs font-bold text-navy dark:text-cream">
          {categoryLabel(request.specialty) || "Categoría"} · {specialtyLabel(request.specialty)}
        </p>
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {request.reason_chips.map((chip) => (
            <span key={chip} className="rounded-pill bg-navy/5 dark:bg-cream/5 px-2.5 py-1 text-[10px] text-navy/70 dark:text-cream/70">
              {chip}
            </span>
          ))}
        </div>
        {request.description && <p className="font-tech text-sm leading-relaxed text-navy/70 dark:text-cream/70">{request.description}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-2.5">
        <Button onClick={handleAccept} disabled={respond.isPending}>
          Aceptar
        </Button>
        {request.mode === "agendado" && (
          <Button variant="neutral" onClick={handleProposeOther} disabled={respond.isPending}>
            Proponer otro horario
          </Button>
        )}
        <Button variant="neutral" onClick={handleReject} disabled={respond.isPending}>
          Rechazar
        </Button>
      </div>
    </div>
  );
}
