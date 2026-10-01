import { addWeeks, startOfISOWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, List } from "lucide-react";
import { cn } from "../../../shared/utils/cn";
import Segmented from "../../ui/Segmented";
import WeekMenu from "../WeekMenu";
import WeekPickerPopover from "./WeekPickerPopover";

// Круглая белая кнопка 38×38 (как на макете)
const roundButton =
  "grid size-9.5 shrink-0 place-items-center rounded-full bg-card text-ink transition-colors outline-none hover:bg-sand focus-visible:ring-2 focus-visible:ring-accent/50";

// Варианты вида недели
const VIEWS = [
  { value: "zeitraster", label: "Zeitraster", icon: Clock },
  { value: "stunden", label: "Stunden + Tag", icon: List },
];

// ─────────────────────────────────────────────────────────────
// Шапка недели на ПК:
//   KW 38 · 15.–19. September          ‹ [Heute] › 📅   [Zeitraster|Stunden + Tag]  ⋮
//   Diese Woche
// ─────────────────────────────────────────────────────────────
const WeekHeaderDesktop = ({ weekStart, subtitle, title, view, onViewChange, onWeekChange, onToday }) => {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="text-label font-extrabold text-faint">{subtitle}</p>
        <h1 className="text-hero text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* навигация по неделям */}
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Vorige Woche" onClick={() => onWeekChange(addWeeks(weekStart, -1))} className={roundButton}>
            <ChevronLeft className="size-4.25" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className={cn("h-10 rounded-full bg-sand px-4.5 text-body font-bold text-ink transition-colors hover:bg-hair")}
          >
            Heute
          </button>
          <button type="button" aria-label="Nächste Woche" onClick={() => onWeekChange(addWeeks(weekStart, 1))} className={roundButton}>
            <ChevronRight className="size-4.25" />
          </button>
          <WeekPickerPopover weekStart={weekStart} onPick={(monday) => onWeekChange(startOfISOWeek(monday))} buttonClassName={roundButton} />
        </div>

        {/* вид недели + меню */}
        <div className="flex items-center gap-2">
          <Segmented label="Ansicht" options={VIEWS} value={view} onChange={onViewChange} variant="accent" size="sm" className="shrink-0" />
          <WeekMenu weekStart={weekStart} onToday={onToday} />
        </div>
      </div>
    </header>
  );
};

export default WeekHeaderDesktop;
