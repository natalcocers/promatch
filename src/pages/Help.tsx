import { BackHeader } from "@/components/layout/BackHeader";

const faqs = [
  {
    q: "¿Cómo contacto a un profesional?",
    a: "Entrá a su perfil y tocá 'Contactar'. Se abre un chat directo, sin intermediarios ni comisiones."
  },
  {
    q: "¿Qué significa 'Identidad verificada'?",
    a: "Ese profesional ya validó su identidad con ProMatch. Es un requisito para aparecer en las búsquedas."
  },
  {
    q: "¿Cómo cancelo una solicitud?",
    a: "Desde el chat de la solicitud, con el profesional al tanto — así evitamos que te dejen esperando."
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-cream px-6 pt-6 pb-10 dark:bg-navy-dark">
      <BackHeader label="Configuración" to="/perfil" />
      <h1 className="mb-5 mt-2 font-rounded text-lg font-bold text-navy dark:text-cream">Ayuda y soporte</h1>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div key={item.q}>
            <p className="font-tech text-sm font-bold text-navy dark:text-cream">{item.q}</p>
            <p className="mt-1 font-caption text-sm text-navy/60 dark:text-cream/60">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-caption text-sm text-navy/50 dark:text-cream/50">
        ¿No encontraste lo que buscabas? Escribinos a{" "}
        <a href="mailto:soporte@promatch.app" className="text-accent underline">
          soporte@promatch.app
        </a>
        .
      </p>
    </div>
  );
}
