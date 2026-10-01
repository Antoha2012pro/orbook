import { Link } from "react-router-dom";
import { ChartNoAxesGantt, ChevronLeft, ChevronRight, List, Share } from "lucide-react";
import { formatDe, relativeDayWord, shiftSchoolDay, toISODate } from "../../../shared/utils/dates";
import Segmented from "../../ui/Segmented";

// Круглая белая кнопка 38×38 (как на макете)
const roundButton =
  "grid size-9.5 shrink-0 place-items-center rounded-full bg-card text-ink transition-colors outline-none hover:bg-sand focus-visible:ring-2 focus-visible:ring-accent/50";

// Варианты вида дня
const VIEWS = [
  { value: "liste", label: "Liste", icon: List },
  { value: "zeitleiste", label: "Zeitleiste", icon: ChartNoAxesGantt },
];

// ─────────────────────────────────────────────────────────────
// Шапка страницы дня на ПК (макет «Tag · Liste»):
//   Mittwoch · heute                     [Liste|Zeitleiste]  ‹ ›  ⇪
//   17. September
// search — хвост адреса (?ansicht=zeitleiste), чтобы при листании дней вид сохранялся
// ─────────────────────────────────────────────────────────────
const DayHeaderDesktop = ({ date, now, view, onViewChange, onShare, search }) => {
  const word = relativeDayWord(date, now); // heute / morgen / gestern
  const prev = toISODate(shiftSchoolDay(date, -1)); // предыдущий учебный день
  const next = toISODate(shiftSchoolDay(date, 1)); // следующий учебный день

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="text-label font-extrabold text-accent">
          {formatDe(date, "EEEE")}
          {word && ` · ${word}`}
        </p>
        <h1 className="text-hero text-ink">{formatDe(date, "d. MMMM")}</h1>
      </div>

      <div className="flex items-center gap-6">
        <Segmented label="Ansicht" options={VIEWS} value={view} onChange={onViewChange} variant="accent" size="sm" className="shrink-0" />
        <div className="flex items-center gap-2">
          <Link to={`/tag/${prev}${search}`} aria-label="Vortag" className={roundButton}>
            <ChevronLeft className="size-4.25" />
          </Link>
          <Link to={`/tag/${next}${search}`} aria-label="Nächster Tag" className={roundButton}>
            <ChevronRight className="size-4.25" />
          </Link>
          <button type="button" aria-label="Tag teilen" onClick={onShare} className={roundButton}>
            <Share className="size-4.25" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DayHeaderDesktop;
