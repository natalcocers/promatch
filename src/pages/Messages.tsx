import { Link } from "react-router-dom";
import { TabBar } from "@/components/layout/TabBar";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useConversationsList } from "@/hooks/useConversationsList";

export default function Messages({ mode }: { mode: "client" | "provider" }) {
  const { profile } = useAuth();
  const { data: conversations, isLoading } = useConversationsList(profile?.id);

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pb-24 pt-10">
      <h1 className="mb-4 font-rounded text-lg font-bold text-navy dark:text-cream">Mensajes</h1>

      <section className="space-y-2">
        {isLoading && <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Cargando conversaciones...</p>}
        {!isLoading && !conversations?.length && (
          <p className="font-tech text-sm text-navy/50 dark:text-cream/50">Todavía no tenés conversaciones.</p>
        )}
        {conversations?.map((c) => (
          <Link key={c.id} to={`/chat/${c.id}?request=${c.service_request_id}`}>
            <div className="flex items-center gap-2.5 rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-2.5">
              <Avatar name={c.other_name ?? "?"} src={c.other_avatar} size="sm" />
              <span className="flex-1 font-caption text-sm font-semibold text-navy dark:text-cream">
                {c.other_name ?? "Conversación"}
              </span>
              {c.archived && <span className="font-tech text-xs text-navy/40 dark:text-cream/40">Finalizada</span>}
            </div>
          </Link>
        ))}
      </section>

      <TabBar mode={mode} />
    </div>
  );
}
