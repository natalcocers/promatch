import { BackHeader } from "@/components/layout/BackHeader";

export default function Terms() {
  return (
    <div className="min-h-screen bg-cream px-6 pt-6 pb-10 dark:bg-navy-dark">
      <BackHeader label="Configuración" to="/perfil" />
      <h1 className="mb-5 mt-2 font-rounded text-lg font-bold text-navy dark:text-cream">
        Términos y política de privacidad
      </h1>

      <div className="space-y-4 font-caption text-sm leading-relaxed text-navy/70 dark:text-cream/70">
        <p>
          Mi Profesional conecta clientes con profesionales independientes verificados. No cobramos comisión por
          los servicios contratados a través de la app.
        </p>
        <p>
          Los datos de tu perfil (nombre, ubicación aproximada, identidad verificada) se muestran a otros
          usuarios solo en la medida necesaria para coordinar un servicio. Podés editar o borrar tu
          ubicación en cualquier momento desde tu perfil.
        </p>
        <p>
          Esta es una versión resumida mientras terminamos el texto legal completo — si tenés dudas puntuales,
          escribinos desde Ayuda y soporte.
        </p>
      </div>
    </div>
  );
}
