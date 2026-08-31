import type { CSSProperties } from "react";
import clsx from "clsx";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronDown,
  IconPin,
  IconPaperclip,
  IconSend,
  IconBell,
  IconDots,
  IconFingerprint,
  IconCheck,
  IconFileInvoice,
  IconMapPin,
  IconClock,
  IconCreditCard,
  IconCameraPlus,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconBolt,
  IconSearch,
  IconList,
  IconMap2,
  IconStar,
  IconStarFilled,
  IconBriefcase,
  IconMoon,
  IconHelpCircle,
  IconFileText,
  IconTrash,
  IconHeart,
  IconHeartFilled,
  IconTools,
  IconUserSearch,
  IconHome,
  IconMessage,
  IconUser,
  IconListDetails,
  IconCalendar,
  IconCalendarPlus,
  IconHammer,
  IconDroplet,
  IconFlame,
  IconKey,
  IconBrush,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconRouter,
  IconSparkles,
  IconActivity,
  IconSchool,
  IconLanguage,
  IconStethoscope,
  IconApple,
  IconX,
  IconCircleCheck,
  IconWifi,
  IconDatabase,
  IconPrinter,
  IconDeviceDesktop,
  IconPlant,
  IconMusic,
  IconCode,
  IconClipboardCheck,
  IconPalette,
  IconPaw,
  IconWalk
} from "@tabler/icons-react";

// Tipado laxo a propósito: cada ícono de @tabler/icons-react trae su
// propio ForwardRefExoticComponent<IconProps & RefAttributes<...>>, y
// TypeScript no unifica esas firmas individuales en un Record común sin
// fricción real (stroke es string|number allá, propTypes no coincide,
// etc.) — el componente Icon de acá abajo sigue siendo el único punto
// con props explícitas y controladas.
type IconComponent = React.ComponentType<Record<string, unknown>>;

// Set de íconos elegido por Natalia en el laboratorio de opciones
// ("línea amigable": trazo grueso y redondeado) — antes esto era el
// webfont de Tabler (glyphs fijos, imposible engrosar); ahora son
// componentes SVG reales de @tabler/icons-react, así que el peso del
// trazo es un prop (ver STROKE_WIDTH acá abajo).
const ICONS: Record<string, IconComponent> = {
  "chevron-left": IconChevronLeft,
  "chevron-right": IconChevronRight,
  "chevron-up": IconChevronUp,
  "chevron-down": IconChevronDown,
  pin: IconPin,
  paperclip: IconPaperclip,
  send: IconSend,
  bell: IconBell,
  dots: IconDots,
  fingerprint: IconFingerprint,
  check: IconCheck,
  "file-invoice": IconFileInvoice,
  "map-pin": IconMapPin,
  clock: IconClock,
  "credit-card": IconCreditCard,
  "camera-plus": IconCameraPlus,
  "rosette-discount-check": IconRosetteDiscountCheck,
  "shield-check": IconShieldCheck,
  bolt: IconBolt,
  search: IconSearch,
  list: IconList,
  "map-2": IconMap2,
  star: IconStar,
  "star-solid": IconStarFilled,
  briefcase: IconBriefcase,
  moon: IconMoon,
  "help-circle": IconHelpCircle,
  "file-text": IconFileText,
  trash: IconTrash,
  heart: IconHeart,
  "heart-solid": IconHeartFilled,
  tools: IconTools,
  "user-search": IconUserSearch,
  "home-2": IconHome,
  message: IconMessage,
  user: IconUser,
  "list-details": IconListDetails,
  calendar: IconCalendar,
  "calendar-plus": IconCalendarPlus,
  hammer: IconHammer,
  droplet: IconDroplet,
  flame: IconFlame,
  key: IconKey,
  brush: IconBrush,
  "device-laptop": IconDeviceLaptop,
  "device-mobile": IconDeviceMobile,
  router: IconRouter,
  sparkles: IconSparkles,
  activity: IconActivity,
  school: IconSchool,
  language: IconLanguage,
  stethoscope: IconStethoscope,
  apple: IconApple,
  x: IconX,
  "circle-check": IconCircleCheck,
  wifi: IconWifi,
  database: IconDatabase,
  printer: IconPrinter,
  "device-desktop": IconDeviceDesktop,
  plant: IconPlant,
  music: IconMusic,
  code: IconCode,
  "clipboard-check": IconClipboardCheck,
  palette: IconPalette,
  paw: IconPaw,
  walk: IconWalk
};

// Sigue el tamaño de fuente heredado (className="text-lg" etc. en todos
// los call sites existentes) en vez de un tamaño fijo en px — mismo
// comportamiento que tenía el webfont, para no tocar ningún call site.
const SIZE_STYLE: CSSProperties = { width: "1em", height: "1em" };
const STROKE_WIDTH = 2.5;

// Pedido puntual sobre la casita del tab bar: un trazo más grueso agranda
// el redondeo de esquinas que ya trae Tabler (strokeLinejoin: "round"), o
// sea que se ve más curva sin cambiar el ícono.
const STROKE_OVERRIDES: Record<string, number> = {
  "home-2": 3
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name];
  if (!Component) return null;

  const filled = name.endsWith("-solid");
  const strokeWidth = STROKE_OVERRIDES[name] ?? STROKE_WIDTH;

  return (
    <Component
      className={clsx("inline-block shrink-0 align-[-0.125em]", className)}
      style={SIZE_STYLE}
      stroke={filled ? undefined : strokeWidth}
      aria-hidden={true}
    />
  );
}
