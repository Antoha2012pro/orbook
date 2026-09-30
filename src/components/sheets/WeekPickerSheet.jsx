import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDays,
  addMonths,
  eachWeekOfInterval,
  endOfMonth,
  getISOWeek,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfISOWeek,
  startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDayLessons, getHoliday } from "../../shared/data/timetable";
import { useNow } from "../../shared/hooks/useNow";
import { cn } from "../../shared/utils/cn";
import { formatDe, parseISODate, toISODate } from "../../shared/utils/dates";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";

// Заголовки колонок
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// ─────────────────────────────────────────────────────────────
// Шторка «Woche wählen» (скрин 7). Адрес: ?sheet=kalender&kw=2025-09-15
// Месячный календарь: клик по дню выбирает всю его неделю,
// «KW xx öffnen» переходит на эту неделю.
// ─────────────────────────────────────────────────────────────
const WeekPickerSheet = ({ open, onClose, sheet }) => {
  return (
    <Sheet open={open} onClose={onClose} title="Woche wählen">
      {/* key — при новом открытии календарь начинается с переданной недели */}
      <WeekPicker key={sheet.kw} initialWeek={parseISODate(sheet.kw)} />
    </Sheet>
  );
};

const WeekPicker = ({ initialWeek }) => {
  const now = useNow(); // сегодня
  const navigate = useNavigate(); // переход на неделю
  const [selected, setSelected] = useState(() => startOfISOWeek(initialWeek ?? now)); // выбранная неделя (понедельник)
  const [month, setMonth] = useState(() => startOfMonth(initialWeek ?? now)); // показываемый месяц

  // Недели месяца: от понедельника недели с 1-м числом до недели с последним числом
  const weeks = eachWeekOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }, { weekStartsOn: 1 });

  // Праздники этого месяца — для подписи внизу
  const monthHolidays = weeks
    .flatMap((monday) => Array.from({ length: 7 }, (_, i) => addDays(monday, i))) // все дни сетки
    .filter((day) => isSameMonth(day, month) && getHoliday(day)); // только праздники этого месяца

  // Кнопка «Heute»: выбрать текущую неделю и её месяц
  const goToday = () => {
    setSelected(startOfISOWeek(now));
    setMonth(startOfMonth(now));
  };

  // «KW xx öffnen»: переход на страницу недели (параметры шторки уходят из адреса — она закроется)
  const openWeek = () => navigate(`/woche?woche=${toISODate(selected)}`);

  return (
    <>
      {/* ── месяц и стрелки ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Vorheriger Monat"
          onClick={() => setMonth((m) => addMonths(m, -1))}
          className="grid size-9 place-items-center rounded-full bg-card text-muted"
        >
          <ChevronLeft className="size-4.5" />
        </button>
        <p className="text-[17px] font-black text-ink">{formatDe(month, "MMMM yyyy")}</p>
        <button
          type="button"
          aria-label="Nächster Monat"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="grid size-9 place-items-center rounded-full bg-card text-muted"
        >
          <ChevronRight className="size-4.5" />
        </button>
      </div>

      {/* ── календарь: колонка KW + 7 дней ── */}
      <div className="flex flex-col gap-1">
        {/* заголовки колонок */}
        <div className="grid grid-cols-8 text-center text-[11px] font-extrabold text-faint">
          <span>KW</span>
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {weeks.map((monday) => {
          const isSelected = isSameDay(monday, selected); // эта неделя выбрана?
          return (
            <div
              key={monday.toISOString()}
              className={cn("grid grid-cols-8 items-center rounded-full", isSelected && "bg-tint")} // подсветка всей недели
            >
              {/* номер недели */}
              <span className="text-center text-[11px] font-extrabold text-faint">{getISOWeek(monday)}</span>

              {Array.from({ length: 7 }, (_, i) => addDays(monday, i)).map((day) => {
                const inMonth = isSameMonth(day, month); // день этого месяца?
                const isToday = isSameDay(day, now); // сегодня?
                const holiday = getHoliday(day); // праздник?
                const hasExam = getDayLessons(day).some((l) => l?.exam); // есть Klausur?

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelected(startOfISOWeek(day))} // выбрать неделю этого дня
                    aria-label={`${formatDe(day, "EEEE, d. MMMM")}${holiday ? ` · ${holiday}` : ""}`}
                    className="relative mx-auto grid size-9 place-items-center"
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full text-[14px] font-extrabold",
                        isToday && "bg-accent text-on-accent", // сегодня — фиолетовый кружок
                        !isToday && (!inMonth ? "text-faint2" : isWeekend(day) || holiday ? "text-faint" : "text-ink"),
                      )}
                    >
                      {formatDe(day, "d")}
                    </span>
                    {/* точка под числом: Klausur — фиолетовая, праздник — серая */}
                    {(hasExam || holiday) && (
                      <span
                        className={cn(
                          "absolute bottom-0 size-1 rounded-full",
                          hasExam ? "bg-accent" : "bg-faint2",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── легенда ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-bold text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent" /> Klausur
        </span>
        {monthHolidays.map((day) => (
          <span key={day.toISOString()} className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-faint2" /> {formatDe(day, "d. MMM")} · {getHoliday(day)}
          </span>
        ))}
      </div>

      {/* ── кнопки ── */}
      <div className="flex gap-2.5">
        <Button onClick={goToday}>Heute</Button>
        <Button variant="primary" onClick={openWeek}>
          KW {getISOWeek(selected)} öffnen
        </Button>
      </div>
    </>
  );
};

export default WeekPickerSheet;
