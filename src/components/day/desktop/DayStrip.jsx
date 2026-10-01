import { Link } from "react-router-dom";
import { addDays, isSameDay, startOfISOWeek } from "date-fns";
import { CircleDashed, Flag } from "lucide-react";
import { getDayLessons } from "../../../shared/data/timetable";
import { cn } from "../../../shared/utils/cn";
import { formatDe, toISODate } from "../../../shared/utils/dates";

// ─────────────────────────────────────────────────────────────
// Полоса дней недели над списком (макет «Tag · Liste»):
//   MO 15.   DI 16. ◌   [MI 17. heute]   DO 18. •   FR 19. ⚑
// Значки справа: ◌ — что-то отменено, • — Vertretung, ⚑ — Klausur.
// search — хвост адреса, чтобы вид (Liste/Zeitleiste) сохранялся
// ─────────────────────────────────────────────────────────────
const DayStrip = ({ date, now, search }) => {
  const monday = startOfISOWeek(date); // понедельник недели
  const days = Array.from({ length: 5 }, (_, i) => addDays(monday, i)); // Mo–Fr

  return (
    <nav aria-label="Wochentage" className="flex h-13 gap-1 rounded-full bg-sand p-1">
      {days.map((day) => {
        const lessons = getDayLessons(day); // уроки дня — для значков
        const active = isSameDay(day, date); // открытый день
        const marker = lessons.some((l) => l?.exam)
          ? "exam"
          : lessons.some((l) => l?.status === "changed")
            ? "changed"
            : lessons.some((l) => l?.status === "cancelled")
              ? "cancelled"
              : null; // самое важное событие дня

        return (
          <Link
            key={day.toISOString()}
            to={`/tag/${toISODate(day)}${search}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 rounded-full px-4 transition-colors",
              active ? "bg-accent text-on-accent" : "text-ink hover:bg-card/60",
            )}
          >
            <span className={cn("text-caption font-extrabold uppercase", active ? "text-today-sub" : "text-faint")}>
              {formatDe(day, "EEEEEE")}
            </span>
            <span className="text-body font-black">{formatDe(day, "d.")}</span>
            {isSameDay(day, now) && <span className={cn("text-small font-semibold", active ? "text-today-sub" : "text-accent")}>heute</span>}

            {/* значок справа */}
            <span className={cn("ml-auto", active ? "text-today-sub" : "text-accent")}>
              {marker === "exam" && <Flag className="size-3.5" />}
              {marker === "changed" && <span className="block size-2 rounded-full bg-current" />}
              {marker === "cancelled" && <CircleDashed className="size-3.5 text-faint" />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DayStrip;
