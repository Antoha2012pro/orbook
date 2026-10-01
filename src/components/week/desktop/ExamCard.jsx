import { Link } from "react-router-dom";
import { cn } from "../../../shared/utils/cn";
import { formatDe, relativeDays, toISODate } from "../../../shared/utils/dates";
import { fachClasses, fachName } from "../../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// Карточка Klausur/Test в правой колонке (макет «Nächste Klausuren»):
//   [19 FR]  KLAUSUR Mathe · 1. Std        in 2 Tagen
//            Quadratische Funktionen
// highlight — ближайшая: фиолетовая рамка и фиолетовое «in 2 Tagen»
// ─────────────────────────────────────────────────────────────
const ExamCard = ({ exam, now, overrides, highlight }) => {
  const { date, lesson, period } = exam;
  const isTest = lesson.examType === "test"; // Test или Klausur

  return (
    <Link
      to={`/tag/${toISODate(date)}`}
      className={cn(
        "flex items-center gap-3 rounded-[20px] bg-card p-3 transition-shadow hover:shadow-md",
        highlight && "ring-[1.5px] ring-accent", // ближайшая — с рамкой
      )}
    >
      {/* дата в цвете предмета */}
      <span className={cn("flex h-11 w-9.5 shrink-0 flex-col items-center justify-center rounded-xl", fachClasses(lesson.fach, overrides))}>
        <span className="text-[19px] leading-none font-black">{formatDe(date, "d")}</span>
        <span className="mt-0.5 text-tiny font-extrabold uppercase">{formatDe(date, "EEEEEE")}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          {/* KLAUSUR — фиолетовый, TEST — песочный */}
          <span
            className={cn(
              "rounded-full px-2 py-0.75 text-micro leading-none font-extrabold tracking-wide uppercase",
              isTest ? "bg-sand text-muted" : "bg-accent text-on-accent",
            )}
          >
            {isTest ? "Test" : "Klausur"}
          </span>
          <span className="truncate text-caption font-semibold text-faint">
            {fachName(lesson.fach)} · {period.n}. Std
          </span>
        </span>
        <span className="mt-1 block truncate text-body font-extrabold text-ink">{lesson.topic}</span>
      </span>

      <span className={cn("shrink-0 text-caption", highlight ? "font-extrabold text-accent-ink" : "font-semibold text-faint")}>
        {relativeDays(date, now)}
      </span>
    </Link>
  );
};

export default ExamCard;
