import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useCreateServiceRequest } from "@/hooks/useServiceRequests";
import { useCreateConversation } from "@/hooks/useConversation";
import { useProvider } from "@/hooks/useProviders";
import { categoryLabel, getSpecialty, specialtyLabel } from "@/lib/catalog";

type Step = "modalidad" | "formulario" | "agenda";

// Contacto → formulario → (agenda si es "Agendado") → chat/espera (mapa de
// UX 2.5). Al confirmar, crea el service_request y su conversación. En
// "Ahora" el cliente pasa primero por la pantalla de búsqueda (2.6); en
// "Agendado" va directo al chat con el pedido ya armado.
export default function ClientContact() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: provider } = useProvider(providerId);
  const fileInput = useRef<HTMLInputElement>(null);

  const specialtyId = provider?.specialties[0];
  const reasonChips = getSpecialty(specialtyId)?.specialty.reasonChips ?? [];

  const [step, setStep] = useState<Step>("modalidad");
  const [mode, setMode] = useState<"ahora" | "agendado">("ahora");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const createRequest = useCreateServiceRequest();
  const createConversation = useCreateConversation();

  function toggleChip(chip: string) {
    setSelectedChips((current) => (current.includes(chip) ? current.filter((c) => c !== chip) : [...current, chip]));
  }

  async function handleSubmit() {
    if (!profile || !providerId) return;

    const chips = otherSelected && otherReason ? [...selectedChips, otherReason] : selectedChips;
    const scheduledFor =
      mode === "agendado" && scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}:00` : undefined;

    const request = await createRequest.mutateAsync({
      clientId: profile.id,
      providerId,
      specialty: specialtyId ?? "plomeria",
      reasonChips: chips,
      description: description || undefined,
      mode,
      scheduledFor
    });

    const conversation = await createConversation.mutateAsync({
      serviceRequestId: request.id,
      clientId: profile.id,
      providerId
    });

    if (mode === "ahora") {
      navigate(`/solicitud/${request.id}/buscando?conversation=${conversation.id}`);
    } else {
      navigate(`/chat/${conversation.id}?request=${request.id}`);
    }
  }

  if (step === "modalidad") {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-10">
        <h1 className="font-rounded text-xl font-bold text-navy dark:text-cream">¿Ahora o agendado?</h1>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              setMode("ahora");
              setStep("formulario");
            }}
            className="w-full rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-5 text-left hover:border-orange"
          >
            <p className="font-rounded font-bold text-navy dark:text-cream">Ahora</p>
            <p className="font-tech text-sm text-navy/60 dark:text-cream/60">Necesito que alguien venga lo antes posible.</p>
          </button>
          <button
            onClick={() => {
              setMode("agendado");
              setStep("formulario");
            }}
            className="w-full rounded-2xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark p-5 text-left hover:border-orange"
          >
            <p className="font-rounded font-bold text-navy dark:text-cream">Agendado</p>
            <p className="font-tech text-sm text-navy/60 dark:text-cream/60">Puedo coordinar un día y horario.</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === "formulario") {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-10 pb-10">
        <button onClick={() => setStep("modalidad")} className="flex items-center gap-2 text-navy dark:text-cream">
          <Icon name="chevron-left" className="text-base" />
          <span className="font-tech text-xs text-navy/60 dark:text-cream/60">
            {categoryLabel(specialtyId)} · {specialtyLabel(specialtyId)}
          </span>
        </button>
        <h1 className="mb-4 mt-1 font-rounded text-lg font-bold text-navy dark:text-cream">¿Qué necesitás?</h1>

        <div className="flex flex-wrap gap-2">
          {reasonChips.map((chip) => {
            const selected = selectedChips.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`rounded-pill px-3.5 py-2 font-tech text-xs ${
                  selected ? "bg-navy text-cream" : "border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark text-navy dark:text-cream"
                }`}
              >
                {chip}
              </button>
            );
          })}
          <button
            onClick={() => setOtherSelected((v) => !v)}
            className={`rounded-pill px-3.5 py-2 font-tech text-xs ${
              otherSelected ? "bg-navy text-cream" : "border-2 border-dashed border-navy/30 dark:border-cream/30 bg-cream dark:bg-navy-dark text-navy/60 dark:text-cream/60"
            }`}
          >
            Otro
          </button>
        </div>

        {otherSelected && (
          <input
            autoFocus
            placeholder="Contanos qué necesitás"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="mt-3 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream"
          />
        )}

        <p className="mb-2 mt-4 font-tech text-xs text-navy/50 dark:text-cream/50">Contanos algo más (opcional)</p>
        <textarea
          placeholder="Se rompió la canilla de la cocina y pierde agua sin parar..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream placeholder:text-navy/30 dark:placeholder:text-cream/30"
        />

        <button
          onClick={() => fileInput.current?.click()}
          className="mt-4 flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-navy/30 dark:border-cream/30 bg-cream dark:bg-navy-dark py-3.5"
        >
          <Icon name="camera-plus" className="text-lg text-navy/60 dark:text-cream/60" />
          <span className="font-tech text-xs text-navy/60 dark:text-cream/60">{photoName ?? "Agregar foto (opcional)"}</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
        />

        <Button
          className="mt-6 w-full"
          disabled={selectedChips.length === 0 && !otherReason}
          onClick={() => (mode === "agendado" ? setStep("agenda") : handleSubmit())}
        >
          {createRequest.isPending ? "Enviando..." : "Continuar"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark px-6 pt-10">
      <button onClick={() => setStep("formulario")} className="flex items-center gap-2 text-navy dark:text-cream">
        <Icon name="chevron-left" className="text-base" />
        <span className="font-tech text-xs text-navy/60 dark:text-cream/60">Volver al pedido</span>
      </button>
      <h1 className="mb-6 mt-1 font-rounded text-lg font-bold text-navy dark:text-cream">¿Qué día y horario te sirve?</h1>

      <label className="block font-tech text-xs text-navy/50 dark:text-cream/50">Fecha</label>
      <input
        type="date"
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream"
      />

      <label className="mt-4 block font-tech text-xs text-navy/50 dark:text-cream/50">Horario</label>
      <input
        type="time"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark px-4 py-3 font-tech text-sm text-navy dark:text-cream"
      />

      <Button
        className="mt-6 w-full"
        disabled={!scheduledDate || !scheduledTime || createRequest.isPending}
        onClick={handleSubmit}
      >
        {createRequest.isPending ? "Enviando..." : "Confirmar pedido"}
      </Button>
    </div>
  );
}
