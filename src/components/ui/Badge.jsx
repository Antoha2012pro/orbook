import { cn } from "../../shared/utils/cn";

// Цвета бейджей по типу
const variants = {
  changed: "bg-tint text-accent-ink", // VERTRETUNG
  cancelled: "bg-sand text-faint", // FÄLLT AUS
  exam: "bg-accent text-on-accent", // KLAUSUR
  live: "bg-accent text-on-accent", // LÄUFT · 27 MIN
};

// Маленький бейдж капсом: <Badge variant="changed">Vertretung</Badge>
const Badge = ({ variant = "changed", className, children }) => {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-1 text-[10px] leading-none font-extrabold tracking-wide whitespace-nowrap uppercase",
        variants[variant], // цвет по типу
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
