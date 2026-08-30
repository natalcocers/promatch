import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useConversationDetails, useMessages, useSendMessage } from "@/hooks/useConversation";
import { useServiceRequest, useMarkCompleted, useConfirmClosed } from "@/hooks/useServiceRequests";

// Chat con tarjeta de contexto pineada (mapa de UX 5.1,
// docs/promatch_chat_mockup.html y promatch_cierre_chat_mockup.html).
// Burbujas sin código de color por rol: lo propio va en azul acento a la
// derecha, lo recibido en blanco a la izquierda — el verde funcional no se
// usa acá, queda intacto para "Disponible"/"Verificado".
export default function Chat() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { messages, loading } = useMessages(conversationId);
  const { data: conversation } = useConversationDetails(conversationId);
  const sendMessage = useSendMessage();
  const [draft, setDraft] = useState(searchParams.get("draft") ?? "");
  const [pinnedOpen, setPinnedOpen] = useState(false);

  const serviceRequestId = searchParams.get("request") ?? undefined;
  const { data: request } = useServiceRequest(serviceRequestId, { refetchInterval: 4000 });
  const markCompleted = useMarkCompleted();
  const confirmClosed = useConfirmClosed();

  useEffect(() => {
    document.getElementById("chat-scroll-end")?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend() {
    if (!draft.trim() || !profile || !conversationId) return;
    await sendMessage.mutateAsync({ conversationId, senderId: profile.id, body: draft.trim() });
    setDraft("");
  }

  const isProvider = profile && conversation && profile.id === conversation.provider_id;
  const isClient = profile && conversation && profile.id === conversation.client_id;
  const other = isProvider ? conversation?.client : conversation?.provider;
  const closed = request?.status === "cerrada";

  return (
    <div className="flex min-h-screen flex-col bg-cream dark:bg-navy-dark">
      <header className="flex items-center gap-2.5 border-b border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark px-4 py-3">
        <button onClick={() => navigate(-1)} aria-label="Volver">
          <Icon name="chevron-left" className="text-navy dark:text-cream" />
        </button>
        <Avatar name={other?.full_name ?? "..."} src={other?.avatar_url} size="sm" />
        <div className="flex-1">
          <p className="font-caption text-sm font-semibold text-navy dark:text-cream">{other?.full_name ?? "Conversación"}</p>
          <p className="font-tech text-[11px] text-navy/50 dark:text-cream/50">Responde rápido</p>
        </div>
        {isProvider && request?.status === "aceptada" && (
          <button
            onClick={() => markCompleted.mutate(request.id)}
            className="font-tech text-xs text-accent underline"
          >
            Marcar terminado
          </button>
        )}
      </header>

      {request && (
        <button
          onClick={() => setPinnedOpen((v) => !v)}
          className="flex items-center gap-2 border-b border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark px-4 py-2.5 text-left"
        >
          <Icon name="pin" className="text-sm text-navy/50 dark:text-cream/50" />
          <span className="flex-1 font-tech text-xs text-navy dark:text-cream">
            {request.reason_chips[0] ?? request.specialty} · {request.mode === "ahora" ? "Ahora" : "Agendado"}
          </span>
          <Icon name={pinnedOpen ? "chevron-up" : "chevron-down"} className="text-sm text-navy/50 dark:text-cream/50" />
        </button>
      )}
      {pinnedOpen && request && (
        <div className="border-b border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark px-4 pb-3 font-tech text-xs text-navy/60 dark:text-cream/60">
          <p>{request.reason_chips.join(", ")}</p>
          {request.description && <p className="mt-1">{request.description}</p>}
        </div>
      )}

      {request?.status === "completada" && isClient && (
        <div className="border-b border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark px-4 py-3">
          <div className="rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-3.5 text-center">
            <p className="mb-1 font-tech text-xs text-navy/50 dark:text-cream/50">
              {other?.full_name ?? "El profesional"} marcó el trabajo como terminado
            </p>
            <p className="mb-3 font-rounded text-sm font-bold text-navy dark:text-cream">¿Quedó resuelto?</p>
            <Button onClick={() => confirmClosed.mutate(request.id)} className="w-full !py-2.5 text-sm">
              Sí, calificar servicio
            </Button>
            <button className="mt-2 font-tech text-xs text-navy/50 dark:text-cream/50">Todavía no</button>
          </div>
        </div>
      )}

      {closed && (
        <div className="border-b border-navy/10 dark:border-cream/10 bg-navy/5 dark:bg-cream/5 px-4 py-3 text-center">
          <p className="font-tech text-sm text-navy/60 dark:text-cream/60">Conversación finalizada</p>
          <button
            onClick={() => navigate(`/calificar/${request!.id}`)}
            className="mt-1 font-tech text-xs text-accent underline"
          >
            Calificar servicio
          </button>
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {loading && <p className="font-tech text-sm text-navy/40 dark:text-cream/40">Cargando mensajes...</p>}
        {messages.map((m) => (
          <div
            key={m.id}
            className={clsx("max-w-[75%] rounded-2xl px-3.5 py-2 font-caption text-sm", {
              "ml-auto rounded-br-md bg-accent text-cream": m.sender_id === profile?.id,
              "rounded-bl-md border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark text-navy dark:text-cream": m.sender_id !== profile?.id
            })}
          >
            {m.body}
          </div>
        ))}
        <div id="chat-scroll-end" />
      </div>

      {!closed && (
        <div className="flex items-center gap-2 border-t border-navy/10 dark:border-cream/10 bg-cream dark:bg-navy-dark p-3">
          <Icon name="paperclip" className="text-lg text-navy/50 dark:text-cream/50" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribí un mensaje..."
            className="flex-1 rounded-pill border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-2 font-tech text-sm text-navy dark:text-cream"
          />
          <button
            onClick={handleSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange text-navy dark:text-cream"
            aria-label="Enviar"
          >
            <Icon name="send" className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
