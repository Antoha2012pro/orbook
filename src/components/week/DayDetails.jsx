import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Flag, X } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { fachColors, fachNames } from "../../shared/constants/fachColors";
import { periods, getDayLessons } from "../../shared/data/timetable";
import { isPeriodNow, isPeriodPast } from "../../shared/utils/time";
import { useNow } from "../../shared/hooks/useNow";

// Подпись под названием предмета
const lessonNote = (lesson) => {
  if (lesson.status === "cancelled") return "fällt aus";
  if (lesson.exam) return `Klausur${lesson.topic ? ` · ${lesson.topic}` : ""}`;
  if (lesson.status === "changed") return `Vertretung · Raum ${lesson.room}`;
  return `Raum ${lesson.room}`;
};

const DayDetails = ({ day, onClose }) => {
  const now = useNow();
  const lessons = getDayLessons(day);

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-extrabold text-faint">
            {format(day, "d. MMMM", { locale: de })}
          </p>
          <h2 className="text-[26px] leading-tight font-black">
            {format(day, "EEEE", { locale: de })}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="grid size-9.5 shrink-0 place-items-center rounded-full bg-card text-muted"
        >
          <X className="size-4.5" />
        </button>
      </header>

      {lessons.length === 0 ? (
        <p className="py-6 text-center text-muted">Kein Unterricht</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {periods.map((p, pi) => {
            const lesson = lessons[pi];
            if (!lesson) return null;

            const isCancelled = lesson.status === "cancelled";
            const isNow = isPeriodNow(p, day, now);

            return (
              <li key={p.n} className="flex items-center gap-3">
                <div className="w-11 shrink-0 text-center">
                  <div className="text-[15px] leading-5 font-black">{p.n}</div>
                  <div className="text-[10px] font-bold text-faint">
                    {p.start}–{p.end}
                  </div>
                </div>

                <div
                  className={cn(
                    "relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-3.5 py-3",
                    isCancelled
                      ? "border-[1.5px] border-dashed border-faint2 text-faint"
                      : fachColors[lesson.fach],
                    lesson.status === "changed" && "ring-2 ring-accent ring-inset",
                    isPeriodPast(p, day, now) && "opacity-50",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-[15px] font-extrabold", isCancelled && "line-through")}>
                      {fachNames[lesson.fach]}
                    </div>
                    <div className="truncate text-[12px] font-bold opacity-80">{lessonNote(lesson)}</div>
                  </div>

                  {lesson.exam && <Flag className="size-4 shrink-0 text-accent-ink" />}
                  {isNow && (
                    <span className="shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] leading-none font-extrabold text-on-accent">
                      jetzt
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DayDetails;