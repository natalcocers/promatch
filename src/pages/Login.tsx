import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import logoCeleste from "@/assets/logo-celeste.png";

// Login/registro único (mapa de UX, arquitectura general): misma pantalla
// para ambos casos, la verificación de identidad viene después, no acá.
export default function Login() {
  const navigate = useNavigate();
  const { enterAsGuest } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
      const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
      if (error) {
        setError(error.message);
      } else if (data.user) {
        await supabase.from("profiles").insert({ id: data.user.id, full_name: fullName });
        navigate("/");
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-dark px-6">
      <div className="flex flex-col items-center gap-1">
        <img src={logoCeleste} alt="" className="h-14 w-14" />
        <p className="font-logo text-2xl font-normal">
          <span className="text-cream">Mi</span>
          <span className="text-accent">Profesional</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-cream p-6">
        <div className="flex rounded-pill bg-navy/5 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-pill py-2 text-sm font-tech font-bold ${mode === "login" ? "bg-accent text-cream" : "text-navy/60"}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-pill py-2 text-sm font-tech font-bold ${mode === "signup" ? "bg-accent text-cream" : "text-navy/60"}`}
          >
            Crear cuenta
          </button>
        </div>

        {mode === "signup" && (
          <input
            required
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border-2 border-navy/15 px-4 py-3 font-tech text-sm text-navy"
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border-2 border-navy/15 px-4 py-3 font-tech text-sm text-navy"
        />
        <input
          required
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border-2 border-navy/15 px-4 py-3 font-tech text-sm text-navy"
        />

        {error && <p className="font-tech text-sm text-orange">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Un momento..." : mode === "login" ? "Entrar" : "Crear cuenta"}
        </Button>

        <button
          type="button"
          onClick={() => {
            enterAsGuest();
            navigate("/");
          }}
          className="w-full text-center font-tech text-sm font-bold text-navy/60 underline"
        >
          Entrar como invitado
        </button>
      </form>
    </div>
  );
}
