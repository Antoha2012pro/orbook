import { ChevronRight, CircleSlash, Flag, RefreshCw } from "lucide-react";
import { getUpcomingChanges } from "../../../shared/data/timetable";
import { useSheet } from "../../../shared/hooks/useSheet";
import { formatDe, relativeDays, toISODate } from "../../../shared/utils/dates";
import { fachName } from "../../../shared/utils/lessons";

// Значок для вида события
const icons = { changed: RefreshCw, cancelled: CircleSlash, exam: Flag };

// ─────────────────────────────────────────────────────────────
// «Kommt noch» в правой колонке дня: что изменится в ближайшие дни.
//   ↻ Do · 4. Std Geschichte        Vertretung ›
//     Raum B12 · Kle
//   ⚑ Fr · Klausur Mathe            in 2 Tagen ›
// ─────────────────────────────────────────────────────────────
const UpcomingCard = ({ now }) => {
  const { openSheet } = useSheet(); // открыть урок
  const items = getUpcomingChanges(now).slice(0, 4); // до 4 событий

  if (items.length === 0) return null; // ничего не меняется

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="px-1 text-label font-extrabold text-faint">Kommt noch</h2>
      <div className="flex flex-col divide-y divide-hair rounded-[24px] bg-card px-4">
        {items.map(({ date, lesson, period, kind }) => {
          const Icon = icons[kind]; // значок
          const day = formatDe(date, "EEEEEE"); // «Do»
          const title = kind === "exam" ? `${day} · ${lesson.examType === "test" ? "Test" : "Klausur"} ${fachName(lesson.fach)}` : `${day} · ${period.n}. Std ${fachName(lesson.fach)}`;
          const right = kind === "exam" ? relativeDays(date, now) : kind === "changed" ? "Vertretung" : "fällt aus"; // справа
          return (
            <button
              key={`${toISODate(date)}-${period.n}`}
              type="button"
              onClick={() => openSheet("stunde", { datum: toISODate(date), stunde: period.n })}
              className="flex items-center gap-3 py-3 text-left"
            >
              <Icon className="size-4.5 shrink-0 text-muted" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body font-semibold text-ink">{title}</span>
                {kind !== "exam" && (
                  <span className="block truncate text-caption font-semibold text-faint">
                    Raum {lesson.room} · {lesson.teacher}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-label font-semibold text-faint">{right}</span>
              <ChevronRight className="size-4 shrink-0 text-faint" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingCard;
