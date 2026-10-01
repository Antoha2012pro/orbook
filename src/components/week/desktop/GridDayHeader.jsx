import { Info } from "lucide-react";
import { getDayInfo, getDayLessons } from "../../../shared/data/timetable";
import { cn } from "../../../shared/utils/cn";
import { formatDe } from "../../../shared/utils/dates";

// ─────────────────────────────────────────────────────────────
// Шапка дня в сетке недели на ПК: «15 MO» (сегодня — фиолетовая «пилюля»).
// Значок (i) — у дня есть «Info zum Tag» или Klausur.
// as — чем рендерить (Link или button), остальные пропсы — ему же
// ─────────────────────────────────────────────────────────────
const GridDayHeader = ({ as: Component = "button", day, isToday, className, ...props }) => {
  const hasNews = Boolean(getDayInfo(day)) || getDayLessons(day).some((l) => l?.exam); // есть что посмотреть

  return (
    <Component
      {...props}
      aria-label={formatDe(day, "EEEE, d. MMMM")}
      className={cn(
        "flex h-13 items-center gap-2 rounded-[14px] px-3 text-left transition-colors",
        isToday ? "bg-accent text-on-accent" : "text-ink hover:bg-sand",
        className,
      )}
    >
      <span className="text-heading leading-none">{formatDe(day, "d")}</span>
      <span className={cn("text-small font-extrabold uppercase", isToday ? "text-today-sub" : "text-faint")}>
        {formatDe(day, "EEEEEE")}
      </span>
      {hasNews && <Info className={cn("ml-auto size-4 shrink-0", isToday ? "text-today-sub" : "text-accent")} />}
    </Component>
  );
};

export default GridDayHeader;
