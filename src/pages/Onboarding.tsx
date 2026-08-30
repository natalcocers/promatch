import { Link } from "react-router-dom";
import logoCeleste from "@/assets/logo-celeste.png";
import { Button } from "@/components/ui/Button";

export default function Onboarding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-navy-dark px-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <img src={logoCeleste} alt="" className="h-56 w-56" />
        <div className="flex flex-col items-center gap-1">
          <p className="font-rounded text-6xl font-bold">
            <span className="text-cream">Pro</span>
            <span className="text-accent">Match</span>
          </p>
          <h1 className="font-tech text-xl font-bold text-cream">
            La persona ideal para cada necesidad.
          </h1>
        </div>
      </div>

      <p className="max-w-sm font-caption text-sm text-cream/70">
        Conectá con profesionales verificados, cerca tuyo, las 24 horas. Sin
        comisiones, sin vueltas.
      </p>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link to="/login">
          <Button className="w-full">Empezar</Button>
        </Link>
        <Link to="/login" className="font-tech text-sm text-cream/60 underline">
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  );
}
