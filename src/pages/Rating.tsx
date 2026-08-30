import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useServiceRequest } from "@/hooks/useServiceRequests";
import { useProvider } from "@/hooks/useProviders";
import { useSubmitReview } from "@/hooks/useReviews";

const quickTags = ["Puntual", "Prolijo", "Buena comunicación", "Precio justo"];

// Pantalla de calificación (mapa de UX 5.3, docs/promatch_calificar_servicio_mockup.html).
// "Omitir por ahora" siempre disponible — nunca se fuerza la reseña.
export default function Rating() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: request } = useServiceRequest(requestId);
  const { data: provider } = useProvider(request?.provider_id ?? undefined);
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]));
  }

  async function handleSubmit() {
    if (!profile || !request?.provider_id || !requestId) return;
    await submitReview.mutateAsync({
      serviceRequestId: requestId,
      reviewerId: profile.id,
      providerId: request.provider_id,
      rating,
      quickTags: tags,
      comment: comment || undefined
    });
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-12">
      <h1 className="text-center font-rounded text-lg font-bold text-navy dark:text-cream">¿Cómo estuvo el servicio?</h1>
      <p className="mt-1 text-center font-tech text-xs text-navy/50 dark:text-cream/50">
        {provider?.profile.full_name ?? "Profesional"}
        {request?.reason_chips[0] ? ` · ${request.reason_chips[0]}` : ""}
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`${n} estrellas`}>
            <Icon
              name={n <= rating ? "star-solid" : "star"}
              className={`text-2xl ${n <= rating ? "text-amber-600" : "text-navy/20 dark:text-cream/20"}`}
            />
          </button>
        ))}
      </div>

      <p className="mb-2 mt-6 text-center font-tech text-xs text-navy/50 dark:text-cream/50">Elegí lo que se aplique</p>
      <div className="flex flex-wrap justify-center gap-2">
        {quickTags.map((tag) => {
          const selected = tags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-pill px-3 py-1.5 font-tech text-xs ${
                selected ? "bg-navy text-cream" : "border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark text-navy dark:text-cream"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <textarea
        placeholder="Contanos algo más (opcional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="mt-6 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream placeholder:text-navy/30 dark:placeholder:text-cream/30"
      />

      <div className="mt-6 flex flex-col gap-2">
        <Button disabled={rating === 0 || submitReview.isPending} onClick={handleSubmit}>
          {submitReview.isPending ? "Enviando..." : "Enviar calificación"}
        </Button>
        <button onClick={() => navigate("/")} className="text-center font-tech text-xs text-navy/50 dark:text-cream/50 underline">
          Omitir por ahora
        </button>
      </div>
    </div>
  );
}
