import { Link } from "react-router-dom";
import { startOfISOWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDe, relativeDayWord, shiftSchoolDay, toISODate } from "../../shared/utils/dates";

// Круглая кнопка-ссылка
const roundLink = "grid size-9.5 shrink-0 place-items-center rounded-full bg-card text-ink";

// ─────────────────────────────────────────────────────────────
// Шапка страницы дня:  ‹  «Mittwoch · heute» / «17. September»   ‹ ›
// search — хвост адреса (?ansicht=zeitleiste), чтобы при листании дней вид сохранялся
// ─────────────────────────────────────────────────────────────
const DayPageHeader = ({ date, now, search = "" }) => {
  const word = relativeDayWord(date, now); // heute / morgen / gestern
  const prev = toISODate(shiftSchoolDay(date, -1)); // предыдущий учебный день
  const next = toISODate(shiftSchoolDay(date, 1)); // следующий учебный день
  const weekLink = `/woche?woche=${toISODate(startOfISOWeek(date))}`; // неделя этого дня

  return (
    <header className="flex items-center gap-2">
      {/* назад к неделе (просто стрелка, без круга — как на макете) */}
      <Link to={weekLink} aria-label="Zur Woche" className="-ml-1.5 grid size-7 shrink-0 place-items-center text-ink">
        <ChevronLeft className="size-5.5" strokeWidth={2.5} />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-4 font-extrabold text-accent">
          {formatDe(date, "EEEE")}
          {word && ` · ${word}`}
        </p>
        <h1 className="truncate text-[27px] leading-[1.1] font-black text-ink">{formatDe(date, "d. MMMM")}</h1>
      </div>

      {/* листать дни (выходные пропускаются) */}
      <Link to={`/tag/${prev}${search}`} aria-label="Vorheriger Schultag" className={roundLink}>
        <ChevronLeft className="size-4.5" />
      </Link>
      <Link to={`/tag/${next}${search}`} aria-label="Nächster Schultag" className={roundLink}>
        <ChevronRight className="size-4.5" />
      </Link>
    </header>
  );
};

export default DayPageHeader;
