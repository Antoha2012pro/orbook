import { Link } from "react-router-dom";
import { ChartNoAxesColumn, ChevronRight, RefreshCw } from "lucide-react";
import { getDayLessons } from "../../../shared/data/timetable";
import { toISODate } from "../../../shared/utils/dates";

// ─────────────────────────────────────────────────────────────
// Карточка «2 Stunden fallen aus · Di, Mi / 2 Vertretungen · Mi, Do».
// Клик по строке — первый день недели, где это случилось.
// ─────────────────────────────────────────────────────────────
const WeekStatsCard = ({ days, stats }) => {
  // Первый день, где есть урок с таким статусом
  const firstDay = (status) => days.find((day) => getDayLessons(day).some((l) => l?.status === status));

  const rows = [
    {
      icon: ChartNoAxesColumn,
      text: `${stats.cancelled} ${stats.cancelled === 1 ? "Stunde fällt" : "Stunden fallen"} aus`,
      days: stats.cancelledDays.join(", "), // «Di, Mi»
      day: firstDay("cancelled"),
    },
    {
      icon: RefreshCw,
      text: `${stats.changed} ${stats.changed === 1 ? "Vertretung" : "Vertretungen"}`,
      days: stats.changedDays.join(", "), // «Mi, Do»
      day: firstDay("changed"),
    },
  ];

  return (
    <div className="flex flex-col divide-y divide-hair rounded-[20px] bg-card px-3.5">
      {rows.map((row) => {
        // Внутренность строки одинаковая — ссылкой или просто блоком
        const inner = (
          <>
            <row.icon className="size-4.75 shrink-0 text-muted" />
            <span className="min-w-0 flex-1 text-body font-semibold text-ink">{row.text}</span>
            <span className="text-caption font-semibold text-faint">{row.days}</span>
            <ChevronRight className="size-4 shrink-0 text-faint" />
          </>
        );
        return row.day ? (
          <Link key={row.text} to={`/tag/${toISODate(row.day)}`} className="flex items-center gap-3 py-3.5">
            {inner}
          </Link>
        ) : (
          <div key={row.text} className="flex items-center gap-3 py-3.5 opacity-60">
            {inner}
          </div>
        );
      })}
    </div>
  );
};

export default WeekStatsCard;
