import { addDays, isSameDay } from "date-fns";
import { getDayLessons, periods } from "../../../shared/data/timetable";
import { useNow } from "../../../shared/hooks/useNow";
import { useUserStore } from "../../../shared/store/userStore";
import { applyHidden } from "../../../shared/utils/lessons";
import { isPeriodPast } from "../../../shared/utils/time";
import LessonContextMenu from "../../lesson/LessonContextMenu";
import LessonTooltip from "../../lesson/LessonTooltip";
import DesktopLessonCard from "./DesktopLessonCard";
import GridDayHeader from "./GridDayHeader";

// ─────────────────────────────────────────────────────────────
// Вид недели «Stunden + Tag» (макет «Woche · Stunden + gewählter Tag»):
// строки — уроки (1…6), колонки — дни. Выбранный день обведён фиолетовым,
// его уроки показаны справа в DayPanel.
// selectedDay — выбранный день; onSelectDay(day) — клик по шапке дня
// ─────────────────────────────────────────────────────────────
const PeriodGrid = ({ weekStart, dayCount, selectedDay, onSelectDay, onLessonClick }) => {
  const now = useNow(); // текущее время
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета

  const days = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i)); // колонки
  const selectedIndex = days.findIndex((d) => isSameDay(d, selectedDay)); // колонка выбранного дня

  return (
    <div
      className="grid gap-x-2.5 gap-y-3"
      // 64px под номер урока + равные колонки дней; строки: шапка + уроки по 104px
      style={{
        gridTemplateColumns: `64px repeat(${dayCount}, minmax(0, 1fr))`,
        gridTemplateRows: `auto repeat(${periods.length}, 104px)`,
      }}
    >
      {/* рамка + фон выбранного дня (под уроками, на всю высоту колонки) */}
      {selectedIndex >= 0 && (
        <div
          aria-hidden
          className="pointer-events-none -m-1.25 rounded-[20px] bg-sand/60 ring-2 ring-accent"
          style={{ gridRow: "1 / -1", gridColumn: selectedIndex + 2 }}
        />
      )}

      {/* ── шапка: дни (клик выбирает день) ── */}
      {days.map((day, di) => (
        <GridDayHeader
          key={day.toISOString()}
          day={day}
          isToday={isSameDay(day, now)}
          type="button"
          aria-pressed={di === selectedIndex} // выбран ли день
          onClick={() => onSelectDay(day)}
          className="relative"
          style={{ gridRow: 1, gridColumn: di + 2 }}
        />
      ))}

      {/* ── номера уроков слева: «1 / 07:30 / 08:15» ── */}
      {periods.map((p, pi) => (
        <div key={p.n} className="flex flex-col justify-center pl-1" style={{ gridRow: pi + 2, gridColumn: 1 }}>
          <span className="text-logo leading-none font-black text-ink">{p.n}</span>
          <span className="mt-1 text-small font-semibold text-faint">{p.start}</span>
          <span className="text-small font-semibold text-faint">{p.end}</span>
        </div>
      ))}

      {/* ── уроки ── */}
      {days.map((day, di) => {
        const lessons = applyHidden(getDayLessons(day), hiddenCourses); // уроки дня без скрытых
        return periods.map((period, index) => {
          const lesson = lessons[index]; // урок в ячейке
          const place = { gridRow: index + 2, gridColumn: di + 2 }; // место в сетке

          // Свободный урок — пунктирная ячейка «frei»
          if (!lesson) {
            return (
              <div
                key={`${di}-${index}`}
                style={place}
                className="relative grid place-items-center rounded-[14px] border-[1.5px] border-dashed border-rule text-caption font-semibold text-faint"
              >
                frei
              </div>
            );
          }

          return (
            <LessonContextMenu key={`${di}-${index}`} lesson={lesson} date={day} index={index}>
              <LessonTooltip lesson={lesson} period={period}>
                <DesktopLessonCard
                  lesson={lesson}
                  overrides={overrides}
                  isPast={isPeriodPast(period, day, now)}
                  onClick={() => onLessonClick(day, index)}
                  className="relative"
                  style={place}
                />
              </LessonTooltip>
            </LessonContextMenu>
          );
        });
      })}
    </div>
  );
};

export default PeriodGrid;
