import clsx from "clsx";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

// PLACEHOLDER — sin fotos/personajes ilustrados todavía (brand-brief).
// Avatar de iniciales sobre el degradé de marca hasta que existan fotos
// reales o las ilustraciones de personajes.
export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const sizeClass = { sm: "h-8 w-8 text-xs", md: "h-12 w-12 text-sm", lg: "h-20 w-20 text-xl" }[size];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (src) {
    return <img src={src} alt={name} className={clsx("rounded-full object-cover", sizeClass)} />;
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-brand-gradient font-rounded font-bold text-cream",
        sizeClass
      )}
    >
      {initials || "?"}
    </div>
  );
}
