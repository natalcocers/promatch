import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

export function NotificationBell() {
  return (
    <Link
      to="/notificaciones"
      aria-label="Notificaciones"
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy/15 dark:border-cream/15 bg-cream dark:bg-navy-dark text-navy dark:text-cream"
    >
      <Icon name="bell" className="text-base" />
    </Link>
  );
}
