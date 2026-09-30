import { Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "../../shared/utils/cn";

// Шапка дня в сетке («MI 17»). Это ссылка на страницу дня (to="/tag/2025-09-17")
const DayHeader = ({ day, isToday, hasExam, to, style }) => {
  return (
    <Link
      to={to}
      style={style}
      aria-label={format(day, "EEEE, d. MMMM", { locale: de })}
      className={cn(
        "relative flex flex-col items-center rounded-2xl py-1 transition-colors",
        isToday ? "bg-accent text-on-accent" : "text-ink hover:bg-sand",
      )}
    >
      <span
        className={cn(
          "mb-px text-[12px] leading-4 font-extrabold uppercase",
          isToday ? "text-today-sub" : "text-faint",
        )}
      >
        {format(day, "EEEEEE", { locale: de })}
      </span>
      <span className="text-[20px] leading-6 font-black">{format(day, "d")}</span>

      {isToday && (
        <span className="absolute top-1.25 right-1.75 size-1.5 rounded-full bg-today-sub" />
      )}
      {!isToday && hasExam && (
        <span className="absolute top-1.25 right-1.75 size-1.5 rounded-full bg-accent" />
      )}
    </Link>
  );
};

export default DayHeader;
