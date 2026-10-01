import { Link } from "react-router-dom";
import { getUpcomingExams } from "../../shared/data/timetable";
import { useNow } from "../../shared/hooks/useNow";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { formatDe, relativeDays, toISODate } from "../../shared/utils/dates";
import { fachClasses, fachName } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// «Bald» в сайдбаре: 3 ближайшие Klausuren/Tests.
// Квадрат слева — дата в цвете предмета, справа — «Klausur · Mathe / in 2 Tagen».
// ─────────────────────────────────────────────────────────────
const SoonList = () => {
  const now = useNow(); // текущее время
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета предметов
  const exams = getUpcomingExams(now).slice(0, 3); // три ближайшие

  if (exams.length === 0) return null; // нечего показывать

  return (
    <section className="mt-7">
      <h3 className="px-3 text-label font-extrabold text-faint">Bald</h3>
      <ul className="mt-2.5 flex flex-col gap-1">
        {exams.map(({ date, lesson, period }, i) => (
          <li key={`${toISODate(date)}-${period.n}`}>
            <Link
              to={`/tag/${toISODate(date)}`}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-sand"
            >
              {/* дата в цвете предмета */}
              <span
                className={cn(
                  "flex h-8.5 w-8 shrink-0 flex-col items-center justify-center rounded-lg",
                  fachClasses(lesson.fach, overrides),
                )}
              >
                <span className="text-label leading-none font-black">{formatDe(date, "d")}</span>
                <span className="text-tiny leading-none font-extrabold uppercase">{formatDe(date, "EEEEEE")}</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body-sm font-semibold text-ink">
                  {lesson.examType === "test" ? "Test" : "Klausur"} · {fachName(lesson.fach)}
                </span>
                {/* ближайшая — фиолетовым, остальные — серым (как на макете) */}
                <span className={cn("block text-caption font-semibold", i === 0 ? "text-accent-ink" : "text-faint")}>
                  {relativeDays(date, now)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SoonList;
