import { useState } from "react";
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
import { formatDe } from "../../shared/utils/dates";
import Button from "../ui/Button";

// Заголовки колонок
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// ─────────────────────────────────────────────────────────────
// Месячный календарь «Woche wählen» (используется в шторке на телефоне
// и в выпадающем окне на ПК). Клик по дню выбирает всю его неделю.
// onOpenWeek(понедельник) — нажали «KW xx öffnen»
// ─────────────────────────────────────────────────────────────
const WeekPicker = ({ initialWeek, onOpenWeek }) => {
  const now = useNow(); // сегодня
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

  // «KW xx öffnen»: сообщаем наверх, какую неделю открыть
  const openWeek = () => onOpenWeek(selected);

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
        <p className="text-subhead text-ink">{formatDe(month, "MMMM yyyy")}</p>
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
        <div className="grid grid-cols-8 text-center text-small font-extrabold text-faint">
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
              <span className="text-center text-small font-extrabold text-faint">{getISOWeek(monday)}</span>

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
                        "grid size-8 place-items-center rounded-full text-body-sm font-extrabold",
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
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption font-bold text-muted">
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

export default WeekPicker;
